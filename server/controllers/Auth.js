
import passport from 'passport';

import { renderTemplate } from '../utils.js';
import User from '../models/User.js';
// import express from 'express';
// import jwt from 'passport-jwt';
// import { Error } from 'mongoose';

export const register = async (req, res, next) => {
  try {
    let data = {
      layout: 'base.liquid',
      title: 'Welcome',
    };

    res.send(renderTemplate('views/register.liquid', data));
  } catch (err) {
    let data = {
      error: { message: err },
      layout: 'base.liquid',
    };
    res.send(renderTemplate('views/register.liquid', data));
    // res.render('register.liquid', data);
    next();
  }
};

export const doRegister = async (req, res, next) => {
  const { username, email, password, name, id } = req.body;
  let data = {
    layout: 'base.liquid',
    title: 'Welcome',
    error: null,
    message: '',
    succes: '',
  };

  try {
    await User.register(
      new User({
        username: req.body.username,
        email: req.body.username,
        name: req.body.name,
        id: id,
      }),
      username,
      function (err, user) {
        if (err) {
          data.succes = false;
          data.message = err;

          // res.render('register.liquid', data);
          res.send(renderTemplate('views/register.liquid', data));
        } else {
          req.login(user, (er) => {
            if (er) {
              data.succes = false;
              data.message = er;
              // res.render('register.liquid', data);
              res.send(renderTemplate('views/register.liquid', data));
            } else {
              res.redirect('/');
            }
          });
        }
      }
    );
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  const { username, email, password, name, id } = req.body;
  let data = {
    layout: 'base.liquid',
    title: 'Welcome',
    error: null,
    message: '',
  };

  try {
    res.render('login.liquid', {
      layout: 'base.liquid',
    });
  } catch (err) {
    let data = {
      error: { message: err },
      layout: 'base.liquid',
    };
    res.render('login.liquid', data);
    next();
  } finally {
  }
};

export const doLogin = async (req, res, next) => {
  const { username, email, password, name, id } = req.body;
  console.log('req.login')
console.log(req.login)

  let data = {
    layout: 'base.liquid',
    title: 'Welcome',
    error: null,
    message: '',
    error: '',
  };
  try {
    if (req.body.username) {
      console.log(username)
      await User.findByUsername(username, username, function (err, user) {
        if (err) {
          console.log(err);
          data.succes = false;
          data.error = err;
          res.render('login.liquid', data);
        } else {
          req.login(user, (er) => {
            if (er) {
              console.log(er);
              data.succes = false;
              data.error = 'Email not found';
              res.render('login.liquid', data);
            } else {
              console.log('req.login')
              console.log(req.login)
              res.redirect('/course/start');
            }
          });
        }
      });
    } else {
      res.render('login.liquid', data);
    }
  } catch (error) {
    res.render('login.liquid', data);
    next(error);
  }
};

export const doLoginOLD = (req, res, next) => {
  const { password, username } = req.body;

  // try {
  // 	const findThisUser = User.findByUsername(username)
  // 	return User.authenticate('local', findThisUser)
  // } catch (err) {
  // 	next(err)
  // }

  if (!req.body.username) {
    res.json({ success: false, message: 'Username was not given' });
  } else if (!req.body.password) {
    res.json({ success: false, message: 'Password was not given' });
  } else {
    console.log(req.body);
    passport.authenticate('local', function (err, user, info, status) {
      console.log(user);
      if (err) {
        res.json({ success: false, message: 'unknown error' });
        next(err);
      } else {
        if (!user) {
          res.json({
            success: false,
            message: 'username or password incorrect',
          });
        } else {
          const signInUser = User.findByUsername(user.username, user.password);
          console.log(signInUser);
          req.logIn(user, (er) => {
            if (er) {
              res.json({ success: false, message: er });
            } else {
              console.log('user login');
              console.log(user);
            }
          });
          // req.login(user, (er) => {
          // 	if (er) {
          // 		res.json({ success: false, message: er });
          // 	} else {
          // 		res.json({ success: true, message: 'Your account has been saved' });
          // 	}
          // });
          console.log(user);
          res.redirect('/classes');
        }
      }
    })(req, res, next);
  }
};

export const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/login');
  });
};
