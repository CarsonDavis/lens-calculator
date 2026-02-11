resource "aws_amplify_app" "lens_calc" {
  name       = "lens-calc"
  repository = "https://github.com/CarsonDavis/lens-calculator"
  platform   = "WEB"

  build_spec = file("${path.module}/../amplify.yml")

  enable_auto_branch_creation = false
  enable_branch_auto_deletion = true
}

resource "aws_amplify_branch" "master" {
  app_id      = aws_amplify_app.lens_calc.id
  branch_name = "master"

  stage                       = "PRODUCTION"
  enable_auto_build           = true
  enable_pull_request_preview = true
}

resource "aws_amplify_domain_association" "codebycarson" {
  app_id                = aws_amplify_app.lens_calc.id
  domain_name           = "codebycarson.com"
  wait_for_verification = false

  sub_domain {
    branch_name = aws_amplify_branch.master.branch_name
    prefix      = "lens-calc"
  }
}
