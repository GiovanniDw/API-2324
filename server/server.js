import 'dotenv/config'

import express from 'express'
import session from 'express-session'
import ViteExpress from 'vite-express'
import bodyParser from 'body-parser'
import cors from 'cors'
import http from 'http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { Liquid } from 'liquidjs'
import logger from 'morgan'
import { Server } from 'socket.io'

import { renderTemplate } from './utils.js'
import routes from './router/index.js'
import passport from './config/passport.js'
// import mongoose from "./config/middleware/mongoose.js";
import mongoose from 'mongoose'
import { socketController } from './controllers/Socket.js'
const PORT = process.env.PORT || 3000
const HOST = process.env.HOST || 'localhost'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

const CorsOptions = {
  origin: 'http://localhost:5173/',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: '*',
  exposedHeaders: '*',
  credentials: true
  // optionsSuccessStatus: 204 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

const engine = new Liquid({
  root: __dirname, // for layouts and partials
  extname: '.liquid'
})

// const server = http.createServer(app).listen(PORT,"0.0.0.0", () => {
//   console.log(`Server is listeningon ${PORT}!`);
// });

app.use(ViteExpress.static())
app.use(logger('dev'))
app.set('trust proxy', ['loopback', 'linklocal', 'uniquelocal'])
app.use(cors(CorsOptions))
// app.use(sessionMiddleware);
// app.use(cookieParser())
app.options('*', cors(CorsOptions))

app.engine('liquid', engine.express())
app.set('views', path.join(__dirname, './views')) // specify the views directory
app.set('view engine', 'liquid') // set liquid to default

app.use(express.json())

app.use('/', express.static(path.join(__dirname, '../public')))
app.use('/', express.static(path.join(__dirname, '../src')))
app.use(bodyParser.json())

app.use(
  bodyParser.urlencoded({
    extended: true,
    credentials: true
  })
)

mongoose
  .connect(process.env.MONGO_DB, {
    dbName: process.env.DB_NAME
  })
  .then(() => console.log(`Mongoose connected to ${process.env.MONGO_DB} `))
  .catch((err) => console.log(err))

passport(app)
app.use(routes)

// app.get('/', async (req, res, next) => {
//   // const movieData = await getMovies();
//   const data = { title: 'Movies', movieData: 'data' }
//   // const render = renderTemplate('index.liquid', data);

//   console.log(data)

//   return res.send(renderTemplate('views/index.liquid', data));
//   // return res.send(renderTemplate('views/index.liquid', { title: 'Home' }));
// })

// app.get("*", (req, res, next) => {

//   let err = new Error(`${req.ip} tried to reach ${req.originalUrl}`); // Tells us which IP tried to reach a particular URL
//   err.statusCode = 404;
//   err.shouldRedirect = true;
//   console.log(err) //New property on err so that our middleware will redirect
//   next();
// });

app.use((req, res, next) => {
  // Make `user` and `authenticated` available in templates
  res.locals.user = req.user
  res.locals.authenticated = !req.user.anonymous
  next()
})

app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.render('error', {
    layout: 'base.liquid',
    message: err.message,
    error: err.status
  })
})

const server = http.createServer(app).listen(PORT, '0.0.0.0', () => {
  console.log(`Server is listening on host: ${HOST} @ ${PORT}!`)
})

const io = new Server(server, {
  cors: {
    origin: `${HOST}:${PORT}`,
    methods: ['GET', 'POST']
  }
})

io.on('connection', (socket) => {
  socketController(io, socket)
})

// ViteExpress.config({ viteConfigFile: path.join(__dirname, '../vite.config.js')});

console.log(path.join(__dirname, '../vite.config.js'))

ViteExpress.bind(app, io, async () => {
  const { root, base } = await ViteExpress.getViteConfig()
  console.log(`Serving app from root ${root}`)
  console.log(`Server is listening at http://${HOST}:${PORT}${base}`)
})

// ViteExpress.listen(app, PORT, () => {
//   console.log(`Server is listening on port ${PORT}...`)
// })
