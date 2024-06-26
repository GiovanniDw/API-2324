import session from 'express-session'
import cookieParser from 'cookie-parser'
// import cookieSession from "cookie-session";
import passport from 'passport'
// import flash from "connect-flash";
// import { Strategy as LocalStrategy } from "passport-local";
// import LocalStrategy from 'passport-local-mongoose';

import User from '../models/User.js'
import mongoose from 'mongoose'
import { connect } from 'mongoose'

// const newLocalStrategy = LocalStrategy.Strategy;
// const newMongoStore = MongoStore(session)

export default function (app) {
  app.use(cookieParser(process.env.SESSION_SECRET))
  // app.use(cookieSession({
  // 	keys: [process.env.SESSION_SECRET, 'key2']
  // }))
  app.use(
    session({
      // this should be changed to something cryptographically secure for production
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
      // automatically extends the session age on each request. useful if you want
      // the user's activity to extend their session. If you want an absolute session
      // expiration, set to false
      rolling: true,
      name: 'localhost',
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
  )

  // passport.serializeUser((user, done) => {
  // 	done(null, user);
  // });
  // passport.deserializeUser(async (userId, done) => {
  // 	await User.findById(userId.id)
  // 		.then(function (user) {
  // 			done(null, user);
  // 		})
  // 		.catch(function (err) {
  // 			done(err);
  // 		});
  // });

  // passport.use(User.createStrategy());

  // passport.use(new LocalStrategy.Strategy(User.authenticate()));

  // const authUser = (user, password, done) => {
  //   //Search the user, password in the DB to authenticate the user
  //   //Let's assume that a search within your DB returned the username and password match for "Kyle".
  //   return done(null, authenticated_user);
  // };

  const createStrat = () => {
    return User.createStrategy()
  }

  passport.use(createStrat())

  // passport.use(new LocalStrategy(
  // 	function(user, password, done) {
  // 		console.log(user)
  // 		User.findByUsername({ username: user, selectHashSaltFields: true }, function(err, user) {
  // 			if (err) { return done(err); }
  // 			if (!user) { return done(null, false); }
  // 			if (!user.validPassword(password)) { return done(null, false); }
  // 			return done(null, {user});
  // 		});
  // 	}
  // ));

  // passport.serializeUser(function(user, done) {
  // 	done(null, user);
  //  });

  //  passport.deserializeUser(function(user, done) {
  // 	done(null, user);
  //  });
  //  passport.serializeUser(function(user, done) {
  // 	done(null, user.id);
  // });

  // passport.deserializeUser(function(id, done) {
  // 	User.findById(_id, function (err, user) {
  // 		if(err){
  //       done(null, false, {error:err});
  //   } else {
  //       done(null, user);
  //   }
  // 	});
  // });
  passport.serializeUser(User.serializeUser())
  passport.deserializeUser(User.deserializeUser())
  // passport.use(new LocalStrategy((usernameField, passwordField, done) => {
  // 	const errorMsg = 'Invalid username or password';
  // 	User.findOne({
  // 		username: usernameField,
  // 		password: usernameField,
  // 		passReqToCallback : true
  // 	})
  // 		.then(user => {
  // 			// if no matching user was found...
  // 			if (!user) {
  // 				return done(null, false, {
  // 					message: errorMsg
  // 				});
  // 			}
  // 			// call our validate method, which will call done with the user if the
  // 			// passwords match, or false if they don't
  // 			return user.validatePassword(password)
  // 				.then(isMatch => done(null, isMatch ? user : false, isMatch ? null : {
  // 					message: errorMsg
  // 				}));
  // 		})
  // 		.catch(done);
  // }));
  // initialize passport. this is required, after you set up passport but BEFORE you use passport.session (if using)
  app.use(passport.initialize())
  // only required if using sessions. this will add middleware from passport
  // that will serialize/deserialize the user from the session cookie and add
  // them to req.user
  app.use(passport.session())
}

// export default passportMiddleware;

// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://admin:<password>@browsertech.amdujfn.mongodb.net/?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });

// 'mongodb+srv://admin:<password>@browsertech.amdujfn.mongodb.net/?retryWrites=true&w=majority'
