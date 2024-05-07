import session from 'express-session'
import cookieParser from 'cookie-parser'
import passport from 'passport'

// import LocalStrategy from 'passport-local-mongoose';

import User from '../models/User.js'
import mongoose from 'mongoose'

// const newMongoStore = MongoStore(session)

export const mongooseMiddleware = () => {
  mongoose.Promise = global.Promise
  return mongoose.connect(process.env.MONGO_DB, {
    dbName: process.env.DB_NAME,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
}

export const config = function (app, io) {
  const wrap = (middleware) => (socket, next) => middleware(socket.request, {}, next)
  const cookieMiddleware = cookieParser(process.env.SESSION_SECRET)

  app.use(cookieMiddleware)
  // app.use(cookieSession({
  // 	keys: [process.env.SESSION_SECRET, 'key2']
  // }))

  const sessionMiddleware = session({
    // this should be changed to something cryptographically secure for production
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    // automatically extends the session age on each request. useful if you want
    // the user's activity to extend their session. If you want an absolute session
    // expiration, set to false
    rolling: true,
    name: process.env.HOST,
    // set your options for the session cookie
    cookie: {
      httpOnly: false,
      sameSite: false,
      // the duration in milliseconds that the cookie is valid
      maxAge: 60 * 60 * 1000, // 20 minutes
      // recommended you use this setting in production if you have a well-known domain you want to restrict the cookies to.
      // domain: 'party-finderr.herokuapp.com',
      // recommended you use this setting in production if your site is published using HTTPS
      // secure: true,
    },
  })

  app.use(sessionMiddleware)
  io.use(wrap(sessionMiddleware))
  io.use(wrap(cookieMiddleware))

  passport.use(User.createStrategy())

  passport.serializeUser(User.serializeUser())
  passport.deserializeUser(User.deserializeUser())

  // initialize passport. this is required, after you set up passport but BEFORE you use passport.session (if using)
  app.use(passport.initialize())
  // only required if using sessions. this will add middleware from passport
  // that will serialize/deserialize the user from the session cookie and add
  // them to req.user
  app.use(passport.session())

  io.use(wrap(passport.initialize()))
  io.use(wrap(passport.session()))
}
