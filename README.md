# Command Line Website
This repo contains a website with a GUI designed like a Linux terminal with a few commands and with login and signup from the shell.

This application uses the following technologies:
* Nodejs
* MongoDb - Database for login and signup.
* Express 
* jQuery - For handling the terminal usage.

# Getting Started

* Clone the repo. (i.e.  git clone https://github.com/abhigyank/Command-Line-Website.git)

## Pre-requisites - Local

1. npm
2. Nodejs  
3. MongoDb

* mongodb port - listening @ `mongodb://localhost:27017` 

### Pre-requisites - Repository

In the cloned repository folder run - :

`npm install`

This wll install all the dependencies of this repository.


### Dependencies

`bcrypt-nodejs: '0.0.3`,
`body-parser: ^1.17.2`,
`cookie-parser: ^1.4.3`,
`ejs: ^2.5.6`,
`express: ^4.15.3`,
`express-session: ^1.15.3`,
`mongoose: ^4.10.5`,
`passport: ^0.3.2`,
`passport-local: ^1.0.0`,
`fs-extra: ^7.0.1`

# Building & Running

Once you have the pre-requisite services up and running and dependencies installed, then you are ready to build and run the  terminal website. Before running, you need tp confirm that MONGODB is running. Check that by running `mongo` in a terminal.


To run the website, go to the `Command-Line-Website` directory and run:

`node app.js`  or 'nodejs app.js'

You should see `listening 3000` on the terminal.

The website should be live at http://localhost:3000/

# Only GUI without Login

To use only the frontend of this repository which includes the terminal UI and UX on a website, which then can be used to with a different backend language and database.


1. Copy `index.ejs` from the 'views' folder and rename it as `index.html`.
2. Remove the following code from `index.html`
	```<% if(user){%>
  	 <script>var username = '<%= user.local.name %>';
  	 logged = 1;</script>
  	 <% } %>```
3. Copy the contents of 'public' folder into same directory as `index.html`.
4. Open `index.html` in a browser.

# Modifying

##  Terminal commands

All the commands are recognised in `script.js` in public/js/ directory. Any additional commands can be added there and existing command's behavior can be modified.

## Database Schema

The user details schema is modelled in `user.js` in model. Authentication is done using PassportJs middleware and configured in `passport.js`.
