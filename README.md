## A Web Application that manages Points of Interest, specifically beaches

### Deployed app on:
### [Heroku](https://lit-hamlet-10675.herokuapp.com/)
###   &
### [Glitch](https://attractive-pouncing-dove.glitch.me/)

## Features of the app are:

-  Sign up or login as a user
-  Create, read, update and delete points
-  Filter by categories
-  Add an image
-  Display the current weather, based on the latitude and longitude, using an OpenWeather API
-  Administrator login, can delete users and categories

## Technology Stack:

- __UI:__
  - handlebars 
  - uikit
- __Components:__  
  - handlebars 
  - mongooes 
  - dotenv
  - cloudinary
  - mais-mongoose-seeder
- __Framework:__
  - hapi 
  - inert 
  - vision
  - cookie
  - boom
- __Platforms:__
  - node
  - mongodb
  - cloudinary
- __Infrastructure:__
  - heroku
  - cloudatlas
  - glitch

## The .env file contains the following variables:
(values should be included to run locally or as config variables if deployed)

- cookie_name=cookie_name
- cookie_password=cookie_password
- db=cloudatlas-connection-string
- name=cloudinary-name
- key=cloudinary-key
- secret=cloudinary-secret
- apiKey=openweather-apikey

