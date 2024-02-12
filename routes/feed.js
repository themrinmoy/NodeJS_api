const express = require('express');
const { body } = require('express-validator');

const feedController = require('../controllers/feed');
const isAuth = require('../middleware/is-auth')

const router = express.Router();

// getting all posts
// /feed/posts => GET
router.get('/posts', isAuth, feedController.getPosts);

// creating single post
// /feed/post => POST
router.post('/post', isAuth,
    [
        body('title')
            .trim()
            .isLength({ min: 5 }),
        body('content')
            .trim()
            .isLength({ min: 5 })
    ],
    feedController.createPost
);


// getting single post
// getting single post

router.get('/post/:postId', isAuth, feedController.getPost);



// updating single post
router.put('/post/:postId', isAuth,
    [
        body('title')
            .trim()
            .isLength({ min: 5 }),
        body('content')
            .trim()
            .isLength({ min: 5 })
    ],
    feedController.updatePost
);


// deleting single post
// 
router.delete('/post/:postId', isAuth, feedController.deletePost)



module.exports = router;