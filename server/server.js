import 'dotenv/config'

import express from 'express'
import session from 'express-session'
import ViteExpress from 'vite-express'
import cors from 'cors'
import http from 'http'
import path from 'node:path'
import { fileURLToPath } from "node:url";
import { Liquid } from 'liquidjs'

// import routes from '@/router/index.js'

const PORT = process.env.PORT || 3000

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

const CorsOptions = {
  origin: 'localhost:5173',
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

app.engine('liquid', engine.express())
app.set('views', ['./views']) // specify the views directory
app.set('view engine', 'liquid') // set liquid to default

app.use(cors(CorsOptions))
// app.use(sessionMiddleware);
// app.use(cookieParser())
app.options('*', cors(CorsOptions))
app.use(express.json())

app.use('/', express.static(path.join(__dirname, '../public')))
app.use('/', express.static(path.join(__dirname, '../src')))

// app.use(routes)

app.get('/', async (req, res) => {
  // const movieData = await getMovies();
  const data = { title: 'Movies', movieData: 'data' }
  // const render = renderTemplate('index.liquid', data);

  console.log(data)

  return res.send(renderTemplate('views/index.liquid', data));
  // return res.send(renderTemplate('views/index.liquid', { title: 'Home' }));
})

const renderTemplate = (template, data) => {
  const templateData = {
    NODE_ENV: process.env.NODE_ENV || 'production',
    ...data
  }

  return engine.renderFileSync(`${template}`, templateData)
}

ViteExpress.listen(app, PORT, () => {
  console.log(`Server is listening on port ${PORT}...`)
})
