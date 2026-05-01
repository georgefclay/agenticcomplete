# STOP — READ THIS BEFORE ANY GIT COMMIT

Do NOT use local git commands (`git add`, `git commit`) on this repo from the sandbox.
The sandbox cannot handle git lock files on the macOS mount. Every attempt creates a stale
lock file that blocks all subsequent git operations and requires manual cleanup.

This has happened multiple times. Use the GitHub API instead. Always.

---

## GitHub API Commit Helper

```python
import urllib.request, json, base64

TOKEN = open('/Users/george/Desktop/agenticcomplete/ops/.github-token').read().strip()
REPO = 'georgefclay/agenticcomplete'
BASE = f'https://api.github.com/repos/{REPO}/contents'

def get_sha(path):
    req = urllib.request.Request(f'{BASE}/{path}', headers={'Authorization': f'token {TOKEN}'})
    try:
        with urllib.request.urlopen(req) as r:
            return json.load(r)['sha']
    except:
        return None

def gh_put(path, content_bytes, message):
    payload = {
        'message': message,
        'content': base64.b64encode(content_bytes).decode(),
        'sha': get_sha(path),
        'committer': {'name': 'Agentic Complete', 'email': 'editor@agenticcomplete.com'}
    }
    req = urllib.request.Request(
        f'{BASE}/{path}',
        data=json.dumps(payload).encode(),
        headers={'Authorization': f'token {TOKEN}', 'Content-Type': 'application/json'},
        method='PUT'
    )
    with urllib.request.urlopen(req) as r:
        result = json.load(r)
        print('Committed:', result['commit']['sha'])

# Usage — call once per file:
gh_put('path/to/file.ext', open('/Users/george/Desktop/agenticcomplete/path/to/file.ext', 'rb').read(), 'commit message here')
```

Each `gh_put` call creates one commit. Call it once per file that changed. That is fine.

---

## If lock files already exist

Do not try to rm them from the sandbox — it will fail with "Operation not permitted."
Do not ask George to delete them — he has already done this too many times.
Use the GitHub API above. It bypasses local git entirely and is unaffected by lock files.
