# CI/CD Strategy

## Hosting Decision

**Platform:** AWS Amplify Hosting
**Domain:** `lens-calc.codebycarson.com`
**App ID:** `d3hc3pd3kpeza5`

### Why Amplify

- Fully controllable via IaC (OpenTofu) — no web console required for setup or management
- Integrates directly with existing Route53 hosted zone (`codebycarson.com`)
- Automatic SSL via ACM
- Preview deploys on pull requests
- Free tier covers our needs (1000 build mins/month, 15 GB served/month)

### Alternatives Considered

| Option                | Pros                                    | Cons                                                          |
| --------------------- | --------------------------------------- | ------------------------------------------------------------- |
| Cloudflare Pages      | Faster edge network, generous free tier | Requires dashboard login for GitHub OAuth, DNS via CNAME      |
| S3 + CloudFront + CDK | Full control, matches existing projects | More infrastructure code to maintain for a simple static site |
| Vercel/Netlify        | Simple setup, good DX                   | Dashboard required, another vendor to manage                  |

## Pipeline

### On Pull Request

1. **GitHub Actions** runs:
   - `npm run typecheck`
   - `npm run lint`
   - `npm run test:run`
2. **Amplify** creates preview deploy at `pr-{number}.d3hc3pd3kpeza5.amplifyapp.com`

### On Push to Master

1. **GitHub Actions** runs same checks
2. **Amplify** deploys to production at `lens-calc.codebycarson.com`

## Amplify Configuration

### Current Settings

| Setting                    | Value   | Purpose                                                     |
| -------------------------- | ------- | ----------------------------------------------------------- |
| `enablePullRequestPreview` | `true`  | Creates `pr-{N}` preview deploys for each PR against master |
| `enableAutoBranchCreation` | `false` | Disabled — PR previews make this redundant (see below)      |
| `enableBranchAutoDeletion` | `true`  | Auto-deletes Amplify branches when GitHub branch is deleted |

### PR Preview Lifecycle

1. PR opened → Amplify creates a `pr-{N}` branch (stage: `PULL_REQUEST`) and builds it
2. Amplify bot comments on PR with preview URL
3. Preview is live while PR is open
4. PR merged → Amplify deletes the `pr-{N}` branch and tears down the subdomain

### Why Auto Branch Creation Is Disabled

Amplify has two overlapping features for branch deploys:

- **Auto branch creation** (`enableAutoBranchCreation`) — creates a deploy at `{branch-name}.amplifyapp.com` for every pushed branch matching a pattern
- **PR previews** (`enablePullRequestPreview`) — creates a deploy at `pr-{N}.amplifyapp.com` for each PR

When both are enabled, every PR triggers **two builds** — one for the branch name and one for `pr-{N}`. This doubles build minute usage with no benefit, since the PR preview is the one linked in the GitHub comment.

Auto branch creation is also the source of stale branch deploys: when a PR is merged, the `pr-{N}` branch is automatically cleaned up, but the branch-name deploy persists until manually deleted. These stale deploys are publicly accessible, consume hosting bandwidth, and count toward the 50-branch limit.

**Decision:** Keep only PR previews. One build per PR, automatic cleanup on merge.

## Build Configuration

```yaml
# amplify.yml
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

## Infrastructure as Code

All infrastructure is managed via OpenTofu in [`infrastructure/`](../infrastructure/). Three resources are defined in `main.tf`:

- **`aws_amplify_app`** — the Amplify app itself (repo link, build spec, branch creation/deletion settings)
- **`aws_amplify_branch`** — the `master` branch (production stage, auto-build, PR previews enabled)
- **`aws_amplify_domain_association`** — custom domain `lens-calc.codebycarson.com`

To make infrastructure changes: edit the `.tf` files, then `tofu plan` and `tofu apply`.

<details>
<summary>Historical: original CLI setup</summary>

The app was originally created via CLI commands before being migrated to IaC:

```bash
# Create the Amplify app (one-time)
aws amplify create-app \
  --name lens-calc \
  --repository https://github.com/CarsonDavis/lens-calculator \
  --platform WEB \
  --profile personal

# Connect the branch
aws amplify create-branch \
  --app-id d3hc3pd3kpeza5 \
  --branch-name master \
  --profile personal

# Configure custom domain
aws amplify create-domain-association \
  --app-id d3hc3pd3kpeza5 \
  --domain-name codebycarson.com \
  --sub-domain-settings prefix=lens-calc,branchName=master \
  --profile personal
```

</details>

## Ongoing Management

Essentially none for a static site:

- Push to master → auto deploys
- Open PR → preview appears
- Merge PR → preview cleaned up (both `pr-{N}` and branch auto-deletion)
- SSL renewal → automatic

Infrastructure changes (settings, domains, branch config) go through OpenTofu — edit the `.tf` files in `infrastructure/`, then `tofu plan` / `tofu apply`.

Rare operational commands (these are runtime queries, not infrastructure setup):

- Check build logs if deploys fail: `aws amplify list-jobs --app-id d3hc3pd3kpeza5 --branch-name master --profile personal`
- List branches to check for stale deploys: `aws amplify list-branches --app-id d3hc3pd3kpeza5 --profile personal`
- Delete a stale branch if needed: `aws amplify delete-branch --app-id d3hc3pd3kpeza5 --branch-name <name> --profile personal`
- Update Node version in build settings if needed
