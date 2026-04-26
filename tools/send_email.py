#!/usr/bin/env python3
"""
send_email.py — AgenticComplete outbound email tool
Sends email from editor@agenticcomplete.com via the Gmail API.

Usage:
    python send_email.py --to recipient@example.com --subject "Subject" --body "Body text"
    python send_email.py --to recipient@example.com --subject "Subject" --body "Body text" --html

Auth setup (one-time):
    python send_email.py --setup

Credentials:
    Place your OAuth client_secret.json in the same directory as this script.
    After --setup, a token.json will be created alongside it.
"""

import argparse
import base64
import json
import os
import sys
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from pathlib import Path

SCRIPT_DIR = Path(__file__).parent.resolve()
CLIENT_SECRET_FILE = SCRIPT_DIR / "client_secret.json"
TOKEN_FILE = SCRIPT_DIR / "token.json"

SCOPES = ["https://www.googleapis.com/auth/gmail.send"]
SENDER = "editor@agenticcomplete.com"


def get_credentials():
    """Load or refresh OAuth2 credentials, running the auth flow if needed."""
    try:
        from google.auth.transport.requests import Request
        from google.oauth2.credentials import Credentials
        from google_auth_oauthlib.flow import InstalledAppFlow
    except ImportError:
        print("ERROR: Required packages not installed.")
        print("Run: pip install google-auth google-auth-oauthlib google-auth-httplib2 google-api-python-client")
        sys.exit(1)

    creds = None

    if TOKEN_FILE.exists():
        creds = Credentials.from_authorized_user_file(str(TOKEN_FILE), SCOPES)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            if not CLIENT_SECRET_FILE.exists():
                print(f"ERROR: client_secret.json not found at {CLIENT_SECRET_FILE}")
                print("Download it from Google Cloud Console > APIs & Services > Credentials.")
                sys.exit(1)
            flow = InstalledAppFlow.from_client_secrets_file(str(CLIENT_SECRET_FILE), SCOPES)
            creds = flow.run_local_server(port=0)

        with open(TOKEN_FILE, "w") as f:
            f.write(creds.to_json())
        print(f"Token saved to {TOKEN_FILE}")

    return creds


def build_message(to, subject, body, html=False):
    """Construct a MIME email message."""
    if html:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = SENDER
        msg["To"] = to
        msg.attach(MIMEText(body, "plain"))
        msg.attach(MIMEText(body, "html"))
    else:
        msg = MIMEText(body, "plain")
        msg["Subject"] = subject
        msg["From"] = SENDER
        msg["To"] = to

    return {"raw": base64.urlsafe_b64encode(msg.as_bytes()).decode()}


def send_email(to, subject, body, html=False):
    """Send an email and return the message ID."""
    try:
        from googleapiclient.discovery import build
    except ImportError:
        print("ERROR: google-api-python-client not installed.")
        print("Run: pip install google-api-python-client")
        sys.exit(1)

    creds = get_credentials()
    service = build("gmail", "v1", credentials=creds)
    message = build_message(to, subject, body, html)

    result = service.users().messages().send(userId="me", body=message).execute()
    return result.get("id")


def main():
    parser = argparse.ArgumentParser(description="Send email from editor@agenticcomplete.com")
    parser.add_argument("--setup", action="store_true", help="Run one-time OAuth authorization")
    parser.add_argument("--to", help="Recipient email address")
    parser.add_argument("--subject", help="Email subject")
    parser.add_argument("--body", help="Email body text")
    parser.add_argument("--html", action="store_true", help="Send body as HTML")
    args = parser.parse_args()

    if args.setup:
        print("Running one-time OAuth authorization...")
        get_credentials()
        print("Authorization complete. token.json saved.")
        print("You can now send emails autonomously.")
        return

    if not all([args.to, args.subject, args.body]):
        parser.print_help()
        sys.exit(1)

    msg_id = send_email(args.to, args.subject, args.body, args.html)
    print(f"Sent. Gmail message ID: {msg_id}")


if __name__ == "__main__":
    main()
