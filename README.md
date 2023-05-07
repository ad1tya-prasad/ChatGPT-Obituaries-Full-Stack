# Fake Obituaries Full Stack Project

This full stack application uses React and AWS that generates obituaries for people. It uses [ChatGPT's Completion API](https://platform.openai.com/docs/api-reference/making-requests) to generate an obituary, along with [Amazon Polly](https://aws.amazon.com/polly/) to turn the obituary into speech, and the [Cloudinary Upload API](https://cloudinary.com/documentation/image_upload_api_reference) to store the speech and a picture of the deceased (may they rest in peace).

## Front End

The front end of this application is created using React and is hosted on Netlify, you can find the website [here](https://obituary-maker.netlify.app) (obituary-maker.netlify.app).

## Back End

The back end of this application consists of of 2 AWS lambda functions and an AWS DynamoDB table. All of the back end infrastructure is created and maintained using Terraform.

The two lambda functions are:

  - `get-obituaries`: to retrieve all the obituaries. Function URL only allows `GET` requests
  - `create-obituary`: to create a new obituary, this function is a bit more complicated;
        1. It first reads all the data from the user (including the image)
        2. then, it stores the image into Cloudinary, followed by generating an obituary for the given person using ChatGPT.
        3. Further, it takes the generated obituary and uses Amazon Polly to generate an mp3 file which then gets stored into Cloudinary as well.
        4. Lastly, it stores all the given data of the user along with the urls for the image and speech files being stored in Cloudinary.

Note: The API keys needed for each API call are stored securly using AWS Systems Manager in Parameter Store. They are read using the AWS Systems Manager API.

The DynamoDB Table:

- This table holds the following characteristics:
    - "name": name of the person
    - "born": birthday
    - "died": date of death
    - "img": image url saved in Cloudinary
    - "obituary": obituary generated by ChatGPT
    - "voice": url of speech saved in Cloudinary


## Architecture Overview
<br/>
<p align="center">
  <img src="https://res.cloudinary.com/mkf/image/upload/v1680411648/last-show_dvjjez.svg" alt="the-last-show-architecture" width="800"/>
</p>
<br/>
