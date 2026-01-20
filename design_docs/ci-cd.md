# CI/CD Strategy

## Hosting Decision

**Platform:** AWS Amplify Hosting
**Domain:** `lens-calc.codebycarson.com`

### Why Amplify

- Fully controllable via CLI — no web console required for setup or management
- Integrates directly with existing Route53 hosted zone (`codebycarson.com`)
- Automatic SSL via ACM
- Preview deploys on pull requests
- Free tier covers our needs (1000 build mins/month)

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
2. **Amplify** creates preview deploy at `pr-{number}.{app-id}.amplifyapp.com`

### On Push to Master

1. **GitHub Actions** runs same checks
2. **Amplify** deploys to production at `lens-calc.codebycarson.com`

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

## Setup Commands

```bash
# Create the Amplify app (one-time)
aws amplify create-app \
  --name lens-calc \
  --repository https://github.com/cdavis/lens-calculator \
  --platform WEB \
  --profile personal

# Connect the branch
aws amplify create-branch \
  --app-id <app-id> \
  --branch-name master \
  --profile personal

# Configure custom domain
aws amplify create-domain-association \
  --app-id <app-id> \
  --domain-name codebycarson.com \
  --sub-domain-settings prefix=lens-calc,branchName=master \
  --profile personal
```

## Ongoing Management

Essentially none for a static site:

- Push to master → auto deploys
- Open PR → preview appears
- Merge PR → preview cleaned up
- SSL renewal → automatic

Rare maintenance:

- Check build logs if deploys fail
- Update Node version in build settings if needed
