import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import session from 'express-session'
import ViteExpress from 'vite-express'

import { createServer } from 'node:http'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

import bodyParser from 'body-parser'
import cors from 'cors'
import http from 'http'
import path from 'node:path'
import { Liquid } from 'liquidjs'
import logger from 'morgan'
import { Server } from 'socket.io'

import nunjucks from 'nunjucks'

import { renderTemplate } from './utils.js'
import routes from './router/index.js'
import passport from './config/passport.js'
import { config } from './config/index.js'
// import mongoose from "./config/middleware/mongoose.js";
import mongoose from 'mongoose'
import { socketController } from './controllers/Socket.js'
const PORT = process.env.PORT || 3000
const HOST = process.env.HOST || 'localhost'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const paths = {
  views: path.join(__dirname, 'views'),
  public: path.join(__dirname, '../public'),
  src: path.join(__dirname, '../src'),
  assets: path.join(__dirname, '../src/assets'),
}

const devPaths = {
  views: path.join(__dirname, 'views'),
  public: path.join(__dirname, '/public'),
  src: path.join(__dirname, '../src'),
  assets: path.join(__dirname, 'assets'),
}



const serverOptions = {
  cors: {
    origin: `${HOST}:${PORT}`,
    methods: ['GET', 'POST'],
  },
}

const app = express()

// const server = http.createServer(app)

const server = http.createServer(app).listen(PORT, '0.0.0.0', () => {
  console.log(`Server.Listen`)
  console.log(`Server is listening on host: ${HOST} @ ${PORT}!`)
})

const io = new Server(server)

const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: '*',
  exposedHeaders: '*',
  credentials: true,
  // optionsSuccessStatus: 204 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

const engine = new Liquid({
  root: __dirname, // for layouts and partials
  extname: '.liquid',
  globals: { data: 'global' },
})

const env = nunjucks.configure(paths.views, {
  autoescape: true,
  express: app,
  watch: true,
});

env.express(app)
// const server = http.createServer(app).listen(PORT,"0.0.0.0", () => {
//   console.log(`Server is listeningon ${PORT}!`);
// });

app.use(logger('dev'))
app.set('trust proxy', ['loopback', 'linklocal', 'uniquelocal'])
app.use(cors(corsOptions))
// app.use(sessionMiddleware);
// app.use(cookieParser())
app.options('*', cors(corsOptions))



// app.engine('liquid', engine.express())
// app.set('views', [path.join(__dirname, './views'), path.join(__dirname, './views/partials')]) // specify the views directory
// app.set('view engine', 'liquid') // set liquid to default






app.set('view engine', 'njk')
app.set('views', paths.views)

// const njk = expressNunjucks(app, {
//   loader: nunjucks.FileSystemLoader,
// })

app.use(express.json())



if (process.env.NODE_ENV === 'development') {
  app.use('/', express.static(paths.public))
  app.use('/', express.static(paths.src))
  app.use('/assets', express.static(paths.assets))
}

if (process.env.NODE_ENV === 'production') {
  app.use('/', express.static(devPaths.public))
  app.use('/assets', express.static(devPaths.assets))
}


app.use(bodyParser.json())

app.use(
  bodyParser.urlencoded({
    extended: true,
    credentials: true,
  })
)

mongoose
  .connect(process.env.MONGO_DB, {
    dbName: process.env.DB_NAME,
  })
  .then(() => console.log(`Mongoose connected to ${process.env.MONGO_DB} `))
  .catch((err) => console.log(err))

// passport(app)
// config(app, io)
config(app, io)

app.use((req, res, next) => {
  res.locals.env = process.env.NODE_ENV || 'development'
  next()
})

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
  res.render('error.njk', {
    message: err.message,
    error: err.status,
  })
})

// app.use(ViteExpress.static())

// config(app, io)

io.on('connection', async (socket) => {
  socketController(io, socket)
})

// ViteExpress.config({ viteConfigFile: path.join(__dirname, '../vite.config.js')});

// server.listen(PORT, '0.0.0.0', () => {
//   console.log(`Server.Listen`)
//   console.log(`Server is listening on host: ${HOST} @ ${PORT}!`)
// })
if (process.env.NODE_ENV === 'development') {
ViteExpress.bind(app, io, async () => {
  console.log(`Vite Express Bind`)
  const { root, base } = await ViteExpress.getViteConfig()
  console.log(`Vite Express Bind`)
  console.log(`Serving app from root ${root}`)
  console.log(`Server is listening at http://${HOST}:${PORT}${base}`)
})
}
// ViteExpress.listen(app, PORT, () => {
//   console.log(`Server is listening on port ${PORT}...`)
// })

// if (process.env.NODE_ENV === 'development') {
//   ViteExpress.listen(app, PORT, () => {
//   console.log(__dirname)
//   console.log(`Server is listening on port ${PORT}...`)
// 	});
// }
// if (process.env.NODE_ENV === 'production') {
// 	app.listen(PORT, () => {
// 		console.log(__dirname);
// 		console.log(`Server is listening on port ${PORT}...`);
// 	});
// }
