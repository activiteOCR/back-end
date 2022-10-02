import express from 'express'
import bodyParser from 'body-parser'
import logging from './config/logging'
import config from './config/config'
import sampleRoutes from './source/routers/giveaway.route'
import helmet from 'helmet'
import mongoose from 'mongoose'
import cors from 'cors'

const corsOptions = {
    origin: 'https://hyenagangstaclub.com',
    optionsSuccessStatus: 200,
    methods: "GET, PUT"
}

/** Open mongodb connection */
mongoose.connect(`mongodb+srv://hyena:${process.env.MONGODB_PWD}@cluster0.ddgjs.mongodb.net/HgcDB?retryWrites=true&w=majority`)
    .then(() => console.log("mongoDb : connected")
    )
    .catch((err) => {
        console.error('mongodb error : ', err);
    })
const NAMESPACE = 'Server';
const app = express();

/** Logging the request : middlewares */
app.use((req, res, next) => {
    logging.info(NAMESPACE, `METHOD - [${req.method}], URL - [${req.url}], IP - [${req.socket.remoteAddress}]`)
    res.on('finish', () => {
        logging.info(NAMESPACE, `METHOD - [${req.method}], URL - [${req.url}], IP - [${req.socket.remoteAddress}], STATUS - [${res.statusCode}]`)
    })
    next()
})
/** Parse the request */
app.use(bodyParser.urlencoded({ extended: false })); //allow json as data 
app.use(bodyParser.json());  //take care of .stringify and .json 

/**Rules of API */
app.use(helmet());
app.use(cors(corsOptions))
/**Routes */
app.use('/api', sampleRoutes)
/**Erros handeling */
app.use((req, res, nex) => {
    const error = new Error('not found')
    return res.status(404).json({ message: error.message })
})

/** Create server  */
app.listen(config.server.port, () => {
    logging.info(NAMESPACE, `server running on ${config.server.hostname}:${config.server.port}`)
})

