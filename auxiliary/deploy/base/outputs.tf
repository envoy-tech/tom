output "MPS_S3_BUCKET" {
  value = aws_s3_bucket.mps_store.bucket
}

output "OPTIMIZATION_ENGINE_ECR_URL" {
  value = aws_ecr_repository.optimization_engine.repository_url
}

output "TRIP_MANAGER_ECR_URL" {
  value = aws_ecr_repository.trip_manager.repository_url
}

output "AWS_SNS_ARN" {
  value = aws_sns_topic.default.arn
}

output "SNS_TOPIC_NAME" {
  value = aws_sns_topic.default.name
}

output "RDS_URL" {
  value = aws_rds_cluster.rds.endpoint
}

output "RDS_USERNAME" {
  value = aws_rds_cluster.rds.master_username
}
