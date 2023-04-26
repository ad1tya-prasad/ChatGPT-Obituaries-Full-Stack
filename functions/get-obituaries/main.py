import boto3
from boto3.dynamodb.conditions import Key
# get_obituary_url = "https://atljom7p67ty535xlh7ygxv24m0ntzyj.lambda-url.ca-central-1.on.aws/"

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('obituaries-30148859')

def lambda_handler(event, context):
    try:
        res = table.scan()
    except Exception as e:
        print(e)
        return {
            'statusCode': 500,
            'message': f'error {e}'
        }
    
    return {
        'statusCode': 200,
        'obituaries': res["Items"],
        'count': len(res["Items"]),
        'message': 'success',
        "body": res["Items"]
    }