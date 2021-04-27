const express = require('express')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const morgan = require('morgan')
const multer = require('multer')
const path = require('path')
const connectDB = require('./sever/database/connection')

const {graphqlHTTP} = require('express-graphql')
const graphqlResolver = require('./sever/graphql/resolvers')
const graphqlSchema = require('./sever/graphql/schema')
const auth = require('./sever/middleware/auth')
const {clearImage} = require('./sever/util/file')



const app = express() 

//Load Images
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'image')
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + "_" + file.originalname)
    }
    
})
const fileFilter = (req, file, cb) => {
    if(file.mimeType === '/image/jpeg' ||
    file.mimeType === '/image/png ' ||
    file.mimeType === '/image/jpg'){
        cb(null, true)
    }else{
        cb(null, false)
    }
}




//Load CORS Headers
app.use((req, res, next) => {
    res.setHeader('Allow-Access-Control-Origin', '*')
    res.setHeader('Allow-Access-Control-Method', 'OPTION, PUT, POST, GET, DELETE')
    res.setHeader('Allow-Acces-Control-Headers', 'Content-Type, Authorization')
    next()
})

//Load Body Parser
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

//Load Static Files
app.use('/image', express.static(path.resolve(__dirname, 'image')))
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'))

app.use(morgan('tiny'))

dotenv.config({path: 'config.env'})
const PORT = process.env.PORT || 8080

connectDB()


app.use(auth)

app.put('/post-image', (req, res, next) => {
    if (!req.isAuth) {
      throw new Error('Not authenticated!');
    }
    if (!req.file) {
      return res.status(200).json({ message: 'No file provided!' });
    }
    if (req.body.oldPath) {
      clearImage(req.body.oldPath);
    }
    return res
      .status(201)
      .json({ message: 'File stored.', filePath: req.file.path });
  });

app.use('/graphql', graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true,
    formatError(err){
        if(!err.originalError){
            return err
        }
        const data = err.originalError.data
        const code = err.originalError.code || 500
        const message = err.message || "An Error Occured!"
        return{data: data, code: code, message: message}
    }
}))


//Load Error Handling 
app.use((error, req, res, next) => {
    const status = error.statusCode || 500
    const message = error.message
    const data  = error.data
    res.status(status).json({message: message, data: data})
})

app.listen(PORT, (req, res, next) => {
console.log(`App is Running On Port ${PORT}`)
})


