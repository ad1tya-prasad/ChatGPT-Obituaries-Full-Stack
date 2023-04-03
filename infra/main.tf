terraform {
  required_providers {
    aws = {
      version = ">= 4.0.0"
      source  = "hashicorp/aws"
    }
  }
}

provider "aws" {
  region = "ca-central-1"
}

# two lambda functions w/ function url

locals {
  get-obituary-name = "get-obituary-30140288"
  create-obituary-name = "create-obituary-30140288"
  handler-name = "main.lambda_handler"
  getter-artifact = "${get-obituary-name}/artifact.zip"
  creator-artifact = "${create-obituary-name}/artifact.zip"
}

resource "aws_s3_bucket" "getter-artifact" {
  bucket = local.getter-artifact
}

resource "aws_s3_bucket" "creator-artifact" {
  bucket = local.creator-artifact
}

resource "aws_iam_role" "lambda" {
  name               = "iam-for-lambda"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

# create a policy for logging and dynamodb access
resource "aws_iam_policy" "logs_and_dynamodb" {
  name        = "lambda-logging-and-dynamodb"
  description = "IAM policy for logging from a lambda"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
        "dynamodb:PutItem",
        "dynamodb:Query"
      ],
      "Resource": ["arn:aws:logs:*:*:*", "${aws_dynamodb_table.notes.arn}"],
      "Effect": "Allow"
    }
  ]
}
EOF
}

# attach the logs policy to the function role
resource "aws_iam_role_policy_attachment" "lambda_logs_and_dynamodb" {
  role       = aws_iam_role.lambda.name
  policy_arn = aws_iam_policy.logs_and_dynamodb.arn
}

## LAMBDA FUNCTIONS

resource "aws_lambda_function" "get-obituary-30140288" {
  s3_bucket     = aws_s3_bucket.getter-artifact.bucket
  s3_key        = local.getter-artifact
  function_name = local.get-obituary-name
  role          = aws_iam_role.lambda.arn
  handler       = local.handler-name

  runtime       = "python3.9"
}

resource "aws_lambda_function_url" "get-url" {
  function_name = aws_lambda_function.get-obituary-30140288.function_name
  authorization_type = "NONE"

  cors {
    allow_credentials = true
    allow_origins     = ["*"]
    allow_methods     = ["GET"]
    allow_headers     = ["*"]
    expose_headers    = ["keep-alive", "date"]
  }
}

resource "aws_lambda_function" "create-obituary-30140288" {
  function_name = local.create-obituary-name
  role          = aws_iam_role.lambda.arn
  handler       = local.handler-name
  filename      = local.creator-artifact
  
  runtime       = "python3.9"
}

resource "aws_lambda_function_url" "create-url" {
  function_name = aws_lambda_function.create-obituary-30140288.function_name
  authorization_type = "NONE"

  cors {
    allow_credentials = true
    allow_origins     = ["*"]
    allow_methods     = ["POST"]
    allow_headers     = ["*"]
    expose_headers    = ["keep-alive", "date"]
  }
}

# one dynamodb table

resource "aws_dynamodb_table" "obituary-30148859" {
  name           = "obituary-30148859"
  billing_mode   = "PROVISIONED"

  read_capacity = 1

  write_capacity = 1

  hash_key = "name"

  attribute {
    name = "name"
    type = "S"
  }
}

# roles and policies as needed
# step functions (if you're going for the bonus marks)


