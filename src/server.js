// -------------------- config --------------------------------
// server.js can configure things (index.js just entrypoint can't do anything)
// import our packages we have'v been installed
const express = require('express'); 
const app = express(); // initializing express after we import it (means the instance of express is our app)
const cors = require('cors');
const helmet = require('helmet');

// Set values for the server's address
// if set to 0 it will randomly pick up a different port, 
// so make the app more robust (you could set up as 3000 but if you run a lot app locally and some port might take by other applications) 
const PORT = process.env.PORT || 0; 
// open to every one, so every only can access the certain part of the api(such as add score to the score board but can't change the scoreboard)
const HOST = '0.0.0.0'; 

// Cool trick for when promises or other complex callstack things are crashing & breaking:
void process.on('unhandledRejection', (reason, p) => { // if there an unhandled rejection, do something else(such as promise crashing or false)
    console.log(`Things got pretty major here! Big error:\n`+ p);
    console.log(`That error happened because of:\n` + reason);
});

// some configurations for helmet,just some security things
// Configure server security, based on documentation outlined here:
// https://www.npmjs.com/package/helmet
// TLDR: Very niche things from older days of the web can still be used to hack APIs
// but we can block most things with these settings.
app.use(helmet()); // Use the helmet library to protect the code
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(helmet.contentSecurityPolicy({
    directives:{
        defaultSrc:["'self'"]
    }
}));

// because backend and frontend communicate with json,so we need to tell express to receive and send json format
// Configure API data receiving & sending
// Assume we always receive and send JSON
app.use(express.json()); // tell express to receive and send JSON format(express is server side, postman is client side)
app.use(express.urlencoded({extended:true})); // makes data send to the API safe

// Configure CORS, add domains to the origin array as needed.
// This is basically where you need to know what your ReactJS app is hosted on.
// eg. React app at localhost:3000 and deployedApp.com can communicate to this API, 
// but a React app at localhost:3001 or SomeRandomWebsite.com can NOT communicate to this API. 
var corsOptions = {
    // the frontend can only talk to these domains, so if your app deploy on different domain, you should add to here
    origin: ["http://localhost:3000", "https://deployedApp.com"], // only your backend api need to know your front end url, 
    // front end does need to know back end
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions));


// require .env and initialize it 
require('dotenv').config() // load up .env file

// console.log("Firebase project ID is: " + process.env.FIREBASE_ADMIN_PROJECT_ID)

const firebaseAdmin = require('firebase-admin')// load up firebase // require firebase admin
firebaseAdmin.initializeApp({ 
    credential:firebaseAdmin.credential.cert({ // build a certificate and give all of the custom data
        "projectId": process.env.FIREBASE_ADMIN_PROJECT_ID,
        "privateKey":process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
        "clientEmail":process.env.FIREBASE_ADMIN_CLIENT_EMAIL
    }) 
})


// -------------------- Routes --------------------------------

// Actual server behaviour
// This is frontend client (React, Postman, cURL) talking to API
app.get('/', (req, res) => { // the '/' is home page, req could be your authorization or your form data etc. 
    // the responds is what the api responds to front end
    console.log('ExpressJS API homepage received a request.');
  // gets the environment (production or staging) if there is a environment variable use the variable as the value,
  // if not say 'not yet set' and then become to target 
    const target = process.env.NODE_ENV || 'not yet set'; 
    res.json({ // send through json object as your data
        'message':`Hello ${target} world!`
    });
    res.send('')
});


// ⭐️import our BlogRoutes file, if we have more specific route all import in server⭐️ 
const importedBlogRouting = require('./Blogs/BlogsRoutes'); 
app.use('/blogs', importedBlogRouting); // use 'use' keyword to execute routes (middleware) in express app
// the param(blogs) can be any thing, just make sure match the url param e.g. localhost:55000/blogs/1234

const importedUserRouting = require('./Users/UserRoutes')
app.use('/users',importedUserRouting)  // anything start with /users should go ./Users/UserRoutes


// Notice that we're not calling app.listen() anywhere in here.
// This file contains just the setup/config of the server,
// so that the server can be used more-simply for things like Jest testing.
// Because everything is bundled into app, 
// we can export that and a few other important variables.
module.exports = { // expose Node.js modules
    app, PORT, HOST
}
