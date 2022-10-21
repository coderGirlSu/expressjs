// this file for add routes
const express = require('express'); // importing express because express provides the framework of the router

// Create a bundle of routes. We'll export this out and then import it into src/index.js.
const routes = express.Router(); // make a instance of router

// This is the "root" route for the Router instance. 
// Its actual name in the URL will depend on how it's configured in src/index.js

// ⭐️⭐️tell express what to do if you get a GET request with this path, run this function⭐️⭐️
routes.get('/', (request, response) => { // says the home page'/' of the blog will be this routes
    response.json({ // we want response in json format, so we need to write it same as json format too
        "message":`Received a request on ${request.originalUrl}`
    }); // read what the url is from our request
});

// Set up route params with the colon before the name.
routes.get('/:blogID', (request, response) => {

    response.json(`Received a GET request for a blog post with ID of ${request.params.blogID}`);

});

// Use Postman or another HTTP tool to visit a POST route.
routes.post('/:blogID', (request, response) => {
    console.log(request.body)

    response.json(`Received a POST request for a blog post with ID of ${request.params.blogID}`);
});

module.exports = routes;