import passport from 'passport'
import jwt from 'jsonwebtoken';

import { renderTemplate } from '../utils.js'
import User from '../models/User.js'
// import express from 'express';
// import jwt from 'passport-jwt';
// import { Error } from 'mongoose';

const maxAge = 24 * 60 * 60;

const createJWT = (id) => {
  return jwt.sign({ id }, 'chatroom secret', {
    expiresIn: maxAge, // in token expiration, calculate by second
  });
};

const alertError = (err) => {
  let errors = { name: '', email: '', password: '' };
  console.log('err message', err.message);
  console.log('err code', err.code);

  if (err.message === 'Incorrect email') {
    errors.email = 'This email not found!';
  }
  if (err.message === 'Incorrect password') {
    errors.password = 'The password is incorrect!';
  }
  if (err.code === 11000) {
    errors.email = 'This email already registered';
    return errors;
  }
  if (err.message.includes('User validation failed')) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

export const signinup = async (req,res,next) => {
  let { username, password } = req.body;
  try {
    let userExists = await User.findByUsername(username)

    if (userExists) {
      let user = userExists
      let token = createJWT(user._id);
      console.log(token);
      res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    } else {
      
    }


    console.log(userExists)


  } catch (error) {
    console.log(error)
    let errors = alertError(error);
    console.log(errors)
  }
  

}



export const register = async (req, res, next) => {
  try {
    let data = {
      layout: 'base.liquid',
      title: 'Welcome'
    }

    res.render('register', data)
  } catch (err) {
    let data = {
      error: { message: err },
      layout: 'base.liquid'
    }
    res.render('register', data)
    // res.render('register.liquid', data);
    next()
  }
}

export const doRegister = async (req, res, next) => {
  const { username, email, password, name, id } = req.body
  let data = {
    layout: 'base.liquid',
    title: 'Welcome',
    error: null,
    message: '',
    succes: ''
  }

  try {
    await User.register(
      new User({
        username: req.body.username,
        email: req.body.username,
        name: req.body.name,
        id: id
      }),
      username,
      function (err, user) {
        if (err) {
          data.succes = false
          data.message = err

          // res.render('register.liquid', data);
          res.render('register', data)
        } else {
          req.login(user, (er) => {
            if (er) {
              data.succes = false
              data.message = er
              // res.render('register.liquid', data);
              res.render('register', data)
            } else {
              res.redirect('/')
            }
          })
        }
      }
    )
  } catch (error) {
    next(error)
  }
}

export const login = async (req, res, next) => {
  const { username, email, password, name, id } = req.body
  let data = {
    layout: 'base.liquid',
    title: 'Welcome',
    error: null,
    message: ''
  }
  try {
     res.render('login', data)
  } catch (err) {
    let data = {
      error: { message: err },
      layout: 'base.liquid'
    }
    // res.render('login', data)
    next(err)
  } 
}

export const doLogin = async (req, res, next) => {
  const { username, email, password, name, id } = req.body
  console.log('req.login')
  console.log(req.login)

  let data = {
    layout: 'base.liquid',
    title: 'Welcome',
    error: null,
    message: '',
  }
  try {
    if (req.body.username) {
      console.log(username)
      await User.findByUsername(username, username, function (err, user) {
        if (err) {
          console.log(err)
          data.succes = false
          data.error = err
          res.render('login', data)
        } else {
          req.login(user, (er) => {
            if (er) {
              console.log(er)
              data.succes = false
              data.error = 'Email not found'
              res.render('login', data)
            } else {
              console.log('req.login')
              console.log(req.login)
              res.redirect('/')
            }
          })
        }
      })
    } else {
      res.render('login', data)
    }
  } catch (error) {
    res.render('login', data)
    next(error)
  }
}

export const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err)
    }
    res.redirect('/login')
  })
}
