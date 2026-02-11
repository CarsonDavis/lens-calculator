# AWS Amplify PR Preview Setup Guide

A standalone, repo-agnostic guide for setting up Amplify Hosting with PR preview deploys on any static site repo.

---

## How It Works

### Amplify Branches vs GitHub Branches

Amplify "branches" are deploy targets that mirror GitHub branches. Each Amplify branch builds and serves your site at its own subdomain (`<branch-name>.<app-id>.amplifyapp.com`). Branches can be created three ways:

1. **Manually** — via `aws amplify create-branch`
2. **Auto branch creation** — Amplify watches for new GitHub branches matching a pattern and creates deploy targets automatically
3. **PR previews** — Amplify creates a `pr-{N}` branch (stage: `PULL_REQUEST`) for each pull request

### PR Preview Lifecycle

1. PR opened against the configured branch (e.g. `master`) → Amplify creates a `pr-{N}` branch and builds it
2. Amplify bot comments on the PR with the preview URL (`pr-{N}.<app-id>.amplifyapp.com`)
3. Preview stays live and rebuilds on each push while the PR is open
4. PR merged/closed → Amplify deletes the `pr-{N}` branch and tears down the subdomain

### Production Deploys

Push to `master` (or your configured production branch) → Amplify auto-builds and deploys to your production URL.

### The `enableAutoBranchCreation` Pitfall

Amplify has two overlapping features for branch deploys:

- **Auto branch creation** (`enableAutoBranchCreation`) — creates a deploy at `{branch-name}.amplifyapp.com` for every pushed branch matching a pattern
- **PR previews** (`enablePullRequestPreview`) — creates a deploy at `pr-{N}.amplifyapp.com` for each PR

When both are enabled, every PR triggers **two builds** — one for the branch name and one for `pr-{N}`. This:

- **Doubles build minutes** with no benefit, since only the `pr-{N}` URL appears in the GitHub comment
- **Creates stale deploys**: when a PR is merged, the `pr-{N}` branch is automatically cleaned up, but the branch-name deploy persists until manually deleted
- **Stale deploys are publicly accessible**, consume hosting bandwidth, and count toward the 50-branch limit

### Correct Settings

| Setting                    | Level  | Value   | Purpose                                                     |
| -------------------------- | ------ | ------- | ----------------------------------------------------------- |
| `enablePullRequestPreview` | Branch | `true`  | Creates `pr-{N}` preview deploys for each PR                |
| `enableAutoBranchCreation` | App    | `false` | Prevents duplicate builds and stale branch deploys          |
| `enableBranchAutoDeletion` | App    | `true`  | Auto-deletes Amplify branches when GitHub branch is deleted |

**Key detail:** `enablePullRequestPreview` is a **branch-level** setting (set on your production branch, e.g. `master`), not an app-level setting. The other two are app-level.

---

## Implementation Guide

All commands use `<PLACEHOLDERS>` — replace them with your actual values.

### Prerequisites

- AWS CLI installed and configured with a named profile
- A GitHub repository for your project
- An `amplify.yml` build spec in the repo root (see next step)

### Step 1: Create `amplify.yml`

Add this to the root of your repository:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

Adjust `npm run build`, `baseDirectory`, and cache paths to match your project's toolchain.

### Step 2: Create the Amplify App

```bash
aws amplify create-app \
  --name <APP_NAME> \
  --repository <GITHUB_REPO_URL> \
  --platform WEB \
  --profile <AWS_PROFILE>
```

Note the `appId` in the response — you'll need it for all subsequent commands.

### Step 3: Create the Production Branch with PR Previews

```bash
aws amplify create-branch \
  --app-id <APP_ID> \
  --branch-name master \
  --enable-pull-request-preview \
  --profile <AWS_PROFILE>
```

This connects Amplify to your `master` branch and enables PR previews for PRs targeting it.

### Step 4: Configure App Settings

```bash
aws amplify update-app \
  --app-id <APP_ID> \
  --enable-branch-auto-deletion \
  --no-enable-auto-branch-creation \
  --profile <AWS_PROFILE>
```

This ensures:

- Stale Amplify branches are cleaned up when their GitHub branch is deleted
- Auto branch creation is off (no duplicate builds — see pitfall above)

### Step 5 (Optional): Custom Domain

```bash
aws amplify create-domain-association \
  --app-id <APP_ID> \
  --domain-name <DOMAIN> \
  --sub-domain-settings prefix=<SUBDOMAIN>,branchName=master \
  --profile <AWS_PROFILE>
```

This configures `<SUBDOMAIN>.<DOMAIN>` to point to your production branch. Requires a Route53 hosted zone for `<DOMAIN>`. Amplify handles SSL automatically.

### Step 6 (Optional): GitHub Actions CI

Amplify handles build and deploy, but it doesn't run your linter or tests. Add a GitHub Actions workflow for that:

```yaml
# .github/workflows/ci.yml
name: CI

on:
  pull_request:
  push:
    branches: [master]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'

      - run: npm ci

      - run: npm run typecheck

      - run: npm run lint

      - run: npm run test:run
```

Adjust the steps to match your project (e.g. remove `typecheck` if you're not using TypeScript).

### Step 7: Verify the Setup

1. **Push a branch** and **open a PR** against `master`
2. Confirm the Amplify bot comments on the PR with a preview URL
3. Visit the preview URL — your site should be live
4. Confirm only **one** Amplify branch was created (`pr-{N}`), not two:
   ```bash
   aws amplify list-branches --app-id <APP_ID> --profile <AWS_PROFILE>
   ```
5. **Merge the PR**
6. Confirm the preview is torn down (preview URL returns 404)
7. Confirm production deployed with the merged changes

---

## Ongoing Management

For a static site, there's essentially nothing to manage:

- Push to `master` → auto deploys
- Open PR → preview appears
- Merge PR → preview cleaned up
- SSL renewal → automatic

Rare maintenance:

```bash
# Check build logs if a deploy fails
aws amplify list-jobs \
  --app-id <APP_ID> \
  --branch-name master \
  --profile <AWS_PROFILE>

# List branches to check for stale deploys
aws amplify list-branches \
  --app-id <APP_ID> \
  --profile <AWS_PROFILE>

# Delete a stale branch if needed
aws amplify delete-branch \
  --app-id <APP_ID> \
  --branch-name <BRANCH_NAME> \
  --profile <AWS_PROFILE>
```
