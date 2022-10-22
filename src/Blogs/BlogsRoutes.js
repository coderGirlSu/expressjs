// this file for add routes
const { request } = require('express');
const express = require('express'); // importing express because express provides the framework of the router

// Create a bundle of routes. We'll export this out and then import it into src/index.js.
const routes = express.Router(); // make a instance of router
// import blogs functions
const { getAllPosts, getSpecificPost, createSpecificPost, updateSpecificPost, deleteSpecificPost } = require('./BlogsFunctions')


// This is the "root" route for the Router instance. 
// Its actual name in the URL will depend on how it's configured in src/index.js

// ⭐️⭐️tell express what to do if you get a GET request with this path, run this function⭐️⭐️
routes.get('/', async (request, response) => { // says the home page'/' of the blog will be this routes
    let postsResult = await getAllPosts()
    response.json(postsResult) // we want response in json format, so we need to write it same as json format too
    // response.json({ 
    //     "message":`Received a request on ${request.originalUrl}`
    // }); // read what the url is from our request
});

// Set up route params with the colon before the name.
routes.get('/', async (request, response) => {

let singleBlogPost = await getSpecificPost(request.params.blogID)
response.json(singleBlogPost)

    // response.json(`Received a GET request for a blog post with ID of ${request.params.blogID}`);

});

// Use Postman or another HTTP tool to visit a POST route.
routes.post('/:blogID', async (request, response) => {

    let creationResult = await createSpecificPost({
        postTitle: request.body.postTitle,
        postContent: request.body.postContent,
        postAuthorID: request.body.postAuthorID
    })

    response.json(creationResult)

    // console.log(request.body)

    // response.json(`Received a POST request for a blog post with ID of ${request.params.blogID}`);
});

// delete is HTTP verb same as postman
routes.delete('/:postID',async (request,response)=>{
    let deleteResult = await deleteSpecificPost(request.params.postID)
    response.json(deleteResult)
})

routes.put('/:postID', async (request, response) => { // update blog
    let updateResult = await updateSpecificPost({
        postID: request.params.postID,
        postTitle: request.body.postTitle,
        postContent: request.body.postContent,
        postAuthorID: request.body.postAuthorID
    })
    response.json(updateResult)
})

module.exports = routes;