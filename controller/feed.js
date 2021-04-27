const {validationResult} = require('express-validator')
const connectDB = require('../database/connection')
const Post = require('../model/post')
const User = require('../model/user')
const isAuth = require('../middleware/is-auth')



exports.getPosts =  (req, res, next) => {
Post.find()
.then(post => {
    if(!posts){
        const error = new Error('Failed Fetching Post!')
        error.statusCode = 402
        throw error
    }
    res.status(200)
    .json({message: 'Posts Fetched Successfully!'
    , posts: posts})
}).catch(err => {
if(!err.statusCode){
    err.statusCode = 402

}
next(err)
})

}


exports.createPost =  (req, res, next) => {
const errors = validationResult(req)
if(!errors.isEmpty()){
    const error = new Error('Validation Failed')
    error.statusCode = 402
    throw error
}
if(!req.file){
    const error = new Error('Image File Not Found!')
    error.statusCode = 402
    throw error
}
const title = req.body.title
const content = req.body.content
const imageUrl= req.file.path
const creator = req.userId
const post = new Post({
    title: title,
    content: content,
    imageUrl: imageUrl,
    creator: creator,
    })
    post.save()
    .then(post => {
        res.status(201).json({message: 'Post Created Succesfully', 
        post: post})
    }).catch(err => {
        if(!err.statusCode){
            err.statusCode = 500
        }
        next(err)
    })


}


exports.getPost =  (req, res, next) => {
const postId = req.params.postId
Post.findById(postId)
.then(post => {
    if(!post){
        const error = new Error(`No Post found with the Id ${postId}`)
        error.statusCode = 402
        throw error
    }
    res.status(200).json({message: `Post with ID ${postId} fetched successfully!`})
}).catch(err => {
    if(!err.statusCode){
        err.statusCode = 500
    }
    next(err)
})
}


exports.updatePost =  (req, res, next) => {
const postId = req.params.postId
const errors = validationResult(req)
if(!errors.isEmpty()){
    const error = new Error('Validation Failed')
    error.statusCode = 402
    throw error
}
const title = req.body.title
const content = req.body.content
let imageUrl = req.body.image
if(req.file){
    const imageUrl = req.file.path
}
if(!imageUrl){
    const error = new Error('Image Not Found!')
    error.statusCode = 402
    throw error  
}
Post.findById(postId)
.then(post => {
    if(!post){
        const error = new Error('Post not found')
        error.statusCode = 402
        throw error   
    }

post.title = title,
post.content = content
post.imageUrl = imageUrl
return post.save()
}).then(result => {
    res.status(200).json({message: 'Post Updated Sucessfully!', post: result})
}).catch(err => {
    if(!err.statusCode){
        err.statusCode = 500
    }
    next(err)
})

}


exports.deletePost =  (req, res, next) => {
const postId = req.params.postId
Post.findById(postId)
.then(post => {
    if(!post){
        const error = new Error('Post not found')
        error.statusCode = 402
        throw error  
    }
return Post.findByIdAndRemove(postId)
}).then(result => {
    res.status(200).json({message: 'Post Deleted sucessfully!', post: result})
}).catch(err => {
    if(!err.statusCode){
        err.statusCode = 500
    }
    next(err)
})

}