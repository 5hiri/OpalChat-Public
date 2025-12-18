# Publishing selected commits to `OpalChat-Public` (Cherry-pick guide)
Use this when you want to publish **only certain commits** from the private/internal repo (`OpalChat`) into your public repo (`OpalChat-Public`).

This guide uses **Option A**: add the public repo as a second remote in this repo, then `cherry-pick` only the commits you want.

---

## Prereqs / assumptions

- You are currently in the `OpalChat` repo folder.
- You have the `OpalChat-Public` repo URL (HTTPS or SSH).
- You understand that `cherry-pick` copies commits (it does not “link” repos).

> Tip: If you’re unsure what branch names are used, check with `git branch`.

---

## One-time setup (add the public remote)

From the `OpalChat` repo root:

```bash
git remote add public <URL-of-OpalChat-Public>
git remote -v
```

If you already added it earlier and need to update the URL:

```bash
git remote set-url public <URL-of-OpalChat-Public>
git remote -v
```

---

## Publish workflow (repeat whenever you want to ship commits)

### 1) Make sure your base branch is up to date

Pick the branch you normally work from (commonly `main`):

```bash
git checkout main
git pull
```

### 2) Create (or reuse) a dedicated “public publish” branch

Create it the first time:

```bash
git checkout -b public-sync
```

Or reuse it later:

```bash
git checkout public-sync
git rebase main
```

> Why: keeping a dedicated branch makes it easy to see what you’ve queued for public, and to retry without contaminating your normal work branches.

### 3) Identify the commit(s) you want to publish

```bash
git log --oneline --decorate
```

Copy the SHA(s) you want.

### 4) Cherry-pick the commit(s) onto `public-sync`

Single commit:

```bash
git cherry-pick <commitSHA>
```

Multiple specific commits:

```bash
git cherry-pick <sha1> <sha2> <sha3>
```

A contiguous range (oldest → newest):

```bash
git cherry-pick <oldestSHA>^..<newestSHA>
```

### 5) Push to the public repo

If you want to push `public-sync` to the public repo’s `main` branch:

```bash
git push public public-sync:main
```

If you prefer a PR workflow, push to a branch on the public repo instead:

```bash
git push public public-sync:public-sync
```

Then open a PR in your Git host from `public-sync` → `main`.

---

## Conflict handling (during cherry-pick)

If `git cherry-pick` reports conflicts:

1) See what’s conflicted:

```bash
git status
```

2) Resolve conflicts in the files.

3) Mark resolved files as staged:

```bash
git add -A
```

4) Continue the cherry-pick:

```bash
git cherry-pick --continue
```

If you want to abort the cherry-pick and go back to how things were:

```bash
git cherry-pick --abort
```

If you’re cherry-picking a sequence and want to skip the current commit:

```bash
git cherry-pick --skip
```

---

## “Exit code 1” / push failed — common causes

### 1) Authentication / permission

- If using HTTPS, ensure you’re signed in / using a PAT if required.
- If using SSH, confirm your SSH key is loaded and the remote URL is SSH.

Useful checks:

```bash
git remote -v
git ls-remote public
```

If `git ls-remote public` fails, it’s usually auth/URL.

### 2) Branch protection / no direct pushes to `main`

If the public repo requires PRs, direct push to `main` will fail.

Use the PR flow instead:

```bash
git push public public-sync:public-sync
```

### 3) Non-fast-forward / public `main` moved

If the public repo’s `main` has commits you don’t have locally, a direct push to `main` may be rejected.

Fetch the public repo and rebase your publish branch on it:

```bash
git fetch public main
git checkout public-sync
git rebase public/main
```

Then push again.

---

## Safety notes

- Always double-check you’re not publishing secrets. Before pushing, you can scan the diff:

```bash
git show --name-only
```

- If you accidentally cherry-pick something you don’t want on `public-sync`, you can reset the branch (careful):

```bash
git reset --hard <goodCommitSHA>
```

---

## Quick reference (minimal)

```bash
# one-time

git remote add public <URL-of-OpalChat-Public>

# per publish

git checkout main
git pull
git checkout -b public-sync

git log --oneline --decorate

git cherry-pick <commitSHA>

git push public public-sync:main
```
