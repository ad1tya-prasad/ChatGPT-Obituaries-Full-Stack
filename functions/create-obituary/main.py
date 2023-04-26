import base64
import hashlib
import os
import boto3
# create_obituary_url = "https://46ztutzdfa27mynq26mrqnfflu0vdjat.lambda-url.ca-central-1.on.aws/"
# get_obituary_url = "https://atljom7p67ty535xlh7ygxv24m0ntzyj.lambda-url.ca-central-1.on.aws/"

client = boto3.client('ssm')
import requests
# doesnt come with python - need to install for lambda function
from requests_toolbelt.multipart import decoder

import time

def lambda_handler(event, body):
    # read data and decode
    body = event['body']    
    if event["isBase64Encoded"]:
        body = base64.b64decode(body)

    content_type = event["headers"]["content-type"]

    # reading data from actual request
    data = decoder.MultipartDecoder(body, content_type)

    # returns parts of the data in binary
    binary_data = [part.content for part in data.parts]
    # decoding binary data
    # converting into string
    ## Data has to go in in this order
    # 1. img
    # 2. name
    # 3. born
    # 4. died
    name = binary_data[1].decode()
    born = binary_data[2].decode()
    died = binary_data[3].decode()


    # you only have access to the /tmp folder in lambda
    key = "obituary.png"
    file_name = os.path.join("/tmp", key)
    with open(file_name, "wb") as f:
        f.write(binary_data[0])
    

    # saving img to cloudinary url
    cloudinary_res = cloudinary_Upload_API(file_name) #, extra_params={"eagers": "e_art:zorro"}
    print("img saved to cloudinary:", cloudinary_res["secure_url"])
    
    # saving chat GPT response
    chat_gpt_res = ask_gpt(f"write an obituary about a fictional character named {name} who was born on {born} and died on {died}.") # f"write an obituary about a fictional character named {name} who was born on {born} and died on {died}."
    print("chat gpt response saved", chat_gpt_res)

    # saving voice url
    voice_file = read_this(chat_gpt_res, name)
    voice_url = cloudinary_Upload_API(voice_file, resource_type="raw")["secure_url"]
    print("voice saved to cloudinary")


    # saving to dynamodb
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('obituaries-30148859')
    table.put_item(
        Item={
            "name": name,
            "born": born,
            "died": died,
            "img": cloudinary_res["secure_url"],
            "obituary": chat_gpt_res,
            "voice": voice_url
        }
    )
    print("saved to dynamodb")

    return {
        "statusCode": 200,
        "message": "success",

    }

def get_keys():
    keys = client.get_parameters_by_path(
    Path='/the-last-show/',
    Recursive=True,
    WithDecryption=True,
    )
    return keys



## Cloudinar example
# extra_params = eagers from readme
# eager = {e_art: zorry, e_grayscale: true}
def cloudinary_Upload_API(filename, resource_type="image", extra_params=None):
    """
    Uploads imgs to cloudinary
    """

    api_key = "727296853575353"
    cloud_name = "dtc1cyghz"
    # read this from parameter store
    api_secret = get_keys()["Parameters"][0]["Value"]

    body = {
        "api_key": api_key,
    }
    # body.update(extra_params)

    files = {
        "file": open(filename, "rb")
    }

    # create signature
    body["signature"] = create_signature(body, api_secret)
    print("data:", body)

    # send req
    url = f"https://api.cloudinary.com/v1_1/{cloud_name}/{resource_type}/upload"
    res = requests.post(url, files=files, data=body)

    return res.json()

# this returns secure_url which you can use in the dunamodb table and send to the fontend to use


def create_signature(body, api_secret):
    """
    Creates signature for cloudinary
    """
    # remove keys that are not needed
    exculde_keys = ["api_key", "source_types", "cloud_name"]
    timestamp = int(time.time())
    body["timestamp"] = timestamp
    # sort body keys
    sorted_body = sort_dict(body, exculde_keys)
    # create string with sorted keys
    query_string = create_query_string(sorted_body)
    query_string_append = f"{query_string}{api_secret}"
    hashed = hashlib.sha1(query_string_append.encode())
    signature = hashed.hexdigest()
    return signature
    


def sort_dict(dict, exclude):
    return {k: v for k,v in sorted(dict.items(), key=lambda item: item[0]) if k not in exclude}

def create_query_string(body):
    query_string = ""
    for idx, (k, v) in enumerate(body.items()):
        if idx == 0:
            query_string = f"{k}={v}"
        else:
            query_string = f"{query_string}&{k}={v}"

    return query_string

# chatgpt send req
def ask_gpt(prompt):
    OPENAI_KEY = get_keys()["Parameters"][1]["Value"]
    url = "https://api.openai.com/v1/completions"
    # need to read api key from parameter store in AWS
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {OPENAI_KEY}"
    }
    body = {
        "model":"text-davinci-003",
        "prompt": prompt,
        "max_tokens": 100,
        "temperature": 0.2,
    }
    print('sending request in ask_gpt')

    res = requests.post(url, headers=headers, json=body)
    print("request sent")
    return res.json()["choices"][0]["text"]

def read_this(text, name):
    # read text
    # return audio file
    # return url of audio file
    client = boto3.client('polly')
    response = client.synthesize_speech(
    Engine='standard', 
    LanguageCode='en-US',
    OutputFormat='mp3',
    Text=text,
    TextType='text',
    VoiceId='Joey'
    )

    filename = f"{name}_obituary.mp3"
    filename = os.path.join("/tmp", filename)
    with open(filename, "wb") as f:
        f.write(response["AudioStream"].read())
    
    # upload to cloudinary with res = cloudinary_Upload_API(filename, resource_type="raw")

    # put url in dynamodb table
    # send to frontend
    return filename

