import json
import boto3
import requests
from boto3.dynamodb.conditions import Key
# get_obituary_url = "https://atljom7p67ty535xlh7ygxv24m0ntzyj.lambda-url.ca-central-1.on.aws/"

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('obituaries-30148859')

def lambda_handler(event, context):
    body = json.loads(event["body"])
    res = table.query(KeyConditionExpression=Key('name').eq(body["name"]))
    return {
        'statusCode': 200,
        'obituaries': res["Items"],
        'count': len(res["Items"]),
        'message': 'success'
    }