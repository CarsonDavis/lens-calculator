terraform {
  backend "s3" {
    bucket       = "cdavis-lens-calc-tfstate"
    key          = "terraform.tfstate"
    region       = "us-east-1"
    profile      = "personal"
  }
}
