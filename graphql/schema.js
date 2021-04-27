const {buildSchema} = require('graphql')

module.exports = buildSchema(`

type Post {

    _id: ID!
    title: String!
    content: String!
    imageUrl: String
    creator: User!
    createdAt: String!
    updatedAt: String!
    
}


type User {

    _id: ID!
    name: String!
    email: String!
    password: String!
    posts: [Post!]!
}

type AuthData {

    token: String!
    userId: String!
}

input userInputData {

    name: String!
    email: String!
    password: String!
}

type PostData {

    totalPosts: Int!
    posts: [Post!]!

}

input postInputData {

    title: String!
    content: String!
    imageUrl: String
}

type RootQuery {
    login(email: String! , password: String!): AuthData!
    posts(page: Int): PostData!
    post( id: ID!): Post!
    user: User!
}

type RootMutation {

    createUser(userInput: userInputData): User!
    createPost(postInput: postInputData): Post!
    updatePost(id: ID!, postInput: postInputData): Post!
    deletePost(id: ID!): Boolean
    updateStatus(status: String!): User!
}


schema {
    
    query: RootQuery
    mutation: RootMutation
}

`)