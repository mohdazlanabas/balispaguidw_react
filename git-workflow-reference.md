# Git Workflow Reference Guide
> *Compiled for Roger - December 2025*  
> *"It's not possible... No, it's necessary" - to master Git properly*

## Table of Contents
1. [Basic Git Branch Workflow](#1-basic-git-branch-workflow)
2. [Reverting and Destroying Branches](#2-reverting-and-destroying-branches)
3. [Incremental Commits and Reverting](#3-incremental-commits-and-reverting)
4. [Understanding git reset HEAD~1](#4-understanding-git-reset-head1)

---

## 1. Basic Git Branch Workflow

### Your Original Process (With Corrections)

❌ **Your Version:**
```bash
git checkout -b staging
# do code changes
git add .
git commit
git push
git checkout -b mian  # Wrong: creates new branch
git merge             # Wrong: no branch specified
```

✅ **Correct Version:**
```bash
# Create and switch to new feature branch
git checkout -b staging

# Make your code changes
# ... editing files ...

# Stage your changes
git add .

# Commit with descriptive message
git commit -m "Your commit message here"

# Push the new branch to remote (first time)
git push -u origin staging

# Switch to main branch (not create new)
git checkout main  # Note: no -b flag, and "main" not "mian"

# Pull latest changes from remote main (important!)
git pull origin main

# Merge staging into main
git merge staging

# Push merged changes to remote
git push origin main
```

### Key Points:
- Use `git checkout main` (without `-b`) to switch to existing branch
- Always pull latest main before merging
- Specify branch names in merge commands
- Fix typo: "mian" → "main"

---

## 2. Reverting and Destroying Branches

### Scenario: Made mistakes in staging, want to start fresh

#### Method 1: Delete and Recreate Branch
```bash
# Step 1: Switch back to main
git checkout main

# Step 2: Delete the local staging branch
git branch -d staging
# If it complains about unmerged changes, force it:
git branch -D staging

# Step 3: If you already pushed staging to remote, delete it there too
git push origin --delete staging

# Step 4: Create a fresh staging branch from main
git checkout -b staging
```

#### Method 2: Reset Branch Without Deleting
```bash
# While on staging branch, reset to match main exactly
git reset --hard origin/main
# This wipes all local changes and makes staging identical to main
```

#### Safety Checks Before Destroying:
```bash
# See what you're about to lose
git status
git diff main
```

⚠️ **Warning:** `--hard` and `-D` are destructive operations with no undo!

---

## 3. Incremental Commits and Reverting

### Making Incremental Commits

```bash
# On staging branch
git checkout staging

# Make Change 1
# ... edit files for feature 1 ...
git add .
git commit -m "Change 1: Add user authentication"

# Make Change 2
# ... edit files for feature 2 ...
git add .
git commit -m "Change 2: Add payment processing"

# Make Change 3
# ... edit files for feature 3 ...
git add .
git commit -m "Change 3: Add email notifications"
```

### Reverting from Change 2 back to Change 1

#### Option 1: Soft Reset (keeps changes as uncommitted)
```bash
# Check your commit history first
git log --oneline

# Reset to Change 1 (moves back 1 commit from Change 2)
git reset --soft HEAD~1

# Your Change 2 files are now in staging area, uncommitted
# You can review or modify before recommitting
```

#### Option 2: Hard Reset (destroys changes completely)
```bash
# Reset to Change 1 and destroy Change 2
git reset --hard HEAD~1

# Change 2 is gone forever (locally)
```

#### Option 3: Revert (creates new commit that undoes)
```bash
# This is safest for shared branches
git revert HEAD

# Creates new commit that undoes Change 2
# History preserved: Change 1 → Change 2 → Revert Commit
```

### Useful Commands for Navigation:
```bash
# See commit history
git log --oneline -5

# See what changed in each commit
git show HEAD    # Latest commit
git show HEAD~1  # One commit back

# Compare commits
git diff HEAD~2 HEAD~1  # Compare Change 1 to Change 2
```

---

## 4. Understanding git reset HEAD~1

### The Critical Clarification

After completing Change 1, Change 2, and Change 3 commits:

```bash
git reset --soft HEAD~1
```

**This brings you back to Change 2, NOT Change 1!**

### Visual Explanation:

```
Initial State (after 3 commits):
[Change 1] → [Change 2] → [Change 3] ← HEAD

After git reset --soft HEAD~1:
[Change 1] → [Change 2] ← HEAD
             (Change 3 code is uncommitted but staged)

After git reset --soft HEAD~2:
[Change 1] ← HEAD
(Change 2 & 3 code are uncommitted but staged)
```

### HEAD Reference Guide:

| Command | Moves To | Effect |
|---------|----------|--------|
| `HEAD` | Current position | Stay where you are |
| `HEAD~1` | 1 commit back | Previous commit |
| `HEAD~2` | 2 commits back | Two commits ago |
| `HEAD~3` | 3 commits back | Three commits ago |

### Reset Types Comparison:

| Reset Type | Command | Commits | Working Directory | Staging Area |
|------------|---------|---------|-------------------|--------------|
| **--soft** | `git reset --soft HEAD~1` | Removed | Kept | Kept |
| **--mixed** | `git reset HEAD~1` | Removed | Kept | Cleared |
| **--hard** | `git reset --hard HEAD~1` | Removed | Cleared | Cleared |

---

## Quick Reference Cheat Sheet

### Most Common Commands:

```bash
# Create new branch
git checkout -b branch-name

# Switch branches
git checkout branch-name

# Delete branch
git branch -D branch-name

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (destroy changes)
git reset --hard HEAD~1

# See where you are
git log --oneline -5

# Compare with main
git diff main

# Emergency recovery
git reflog  # Shows all HEAD movements
```

### Golden Rules:
1. **Always pull before merging**
2. **Use `--soft` when you might want the code back**
3. **Use `--hard` when you're absolutely sure**
4. **Use `revert` on shared/public branches**
5. **Use `reset` on local/private branches**

---

## Pro Tips

1. **Before any destructive operation:**
   ```bash
   git stash  # Temporarily save uncommitted work
   ```

2. **Create backup branch before experiments:**
   ```bash
   git checkout -b staging-backup
   ```

3. **Interactive staging for precise commits:**
   ```bash
   git add -p  # Choose specific chunks to commit
   ```

4. **Recover from mistakes:**
   ```bash
   git reflog  # Shows history of HEAD movements
   git reset --hard HEAD@{2}  # Go back to specific reflog entry
   ```

---

*"Cooper, this is no time for caution" - but with Git, a little caution saves a lot of pain.*

**Remember:** Git is a time machine for your code. Use it wisely!
