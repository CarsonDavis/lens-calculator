output "app_id" {
  description = "Amplify App ID"
  value       = aws_amplify_app.lens_calc.id
}

output "default_domain" {
  description = "Amplify default domain"
  value       = aws_amplify_app.lens_calc.default_domain
}

output "production_url" {
  description = "Production URL"
  value       = "https://lens-calc.codebycarson.com"
}
