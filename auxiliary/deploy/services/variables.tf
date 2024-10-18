variable "environment" {
  type = string
  default = "DEV"
  description = "The type of environment to deploy."
  validation {
    condition = contains(["DEV", "PROD"], var.environment)
    error_message = "The environment must be either DEV or PROD."
  }
}
