import passport from 'passport'
import jwt from 'jsonwebtoken'

import { renderTemplate } from '../utils.js'
import User from '../models/User.js'
// import express from 'express';
// import jwt from 'passport-jwt';
// import { Error } from 'mongoose';

const maxAge = 24 * 60 * 60

const createJWT = (id) => {
  return jwt.sign({ id }, 'chatroom secret', {
    expiresIn: maxAge // in token expiration, calculate by second
  })
}

const alertError = (err) => {
  let errors = { name: '', email: '', password: '' }
  console.log('err message', err.message)
  console.log('err code', err.code)

  if (err.message === 'Incorrect email') {
    errors.email = 'This email not found!'
  }
  if (err.message === 'Incorrect password') {
    errors.password = 'The password is incorrect!'
  }
  if (err.code === 11000) {
    errors.email = 'This email already registered'
    return errors
  }
  if (err.message.includes('User validation failed')) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message
    })
  }
  return errors
}

export const signinup = async (req, res, next) => {
  let { username, password } = req.body
  try {
    let userExists = await User.findByUsername(username)

    if (userExists) {
      let user = userExists
      let token = createJWT(user._id)
      console.log(token)
      res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
    } else {
    }

    console.log(userExists)
  } catch (error) {
    console.log(error)
    let errors = alertError(error)
    console.log(errors)
  }
}

export const newRegister = async (req, res) => {
  console.log('reqbody 1')
  console.log(req.body)
  let { username, name, password } = req.body
  try {
    let newUser = {
      username: username,
      name: name,
      password: password
    }
    console.log('newUser')
    console.log(newUser)

    let user = await User.create({ username, name, password })
    console.log('user')
    console.log(user)

    let token = createJWT(user._id)
    console.log('token')
    console.log(token)
    // create a cookie name as jwt and contain token and expire after 1 day
    // in cookies, expiration date calculate by milisecond
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
    res.status(201).json({ user })
  } catch (error) {
    let errors = alertError(error)
    res.status(400).json({ errors })
  }
}

export const register = async (req, res, next) => {
  try {
    let data = {
      layout: 'base.liquid',
      title: 'Welcome',
      error: null
    }

    res.render('register', data)
  } catch (err) {
    let data = {
      error: { message: err },
      layout: 'base.liquid'
    }
    res.render('register', data)
    // res.render('register.liquid', data);
    next(err)
  }
}

export const doRegister = async (req, res, next) => {
  const { username, email, password, name, id } = req.body

  console.log(req.body)

  let data = {
    layout: 'base.liquid',
    title: 'Welcome',
    error: null,
    message: '',
    succes: ''
  }

  try {
    console.log(req.body)
    await User.register(
      new User({
        username: req.body.username,
        email: req.body.username,
        password: req.body.password,
        name: req.body.name
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

export const newLogin = async (req, res) => {
  let { username, password } = req.body
  try {
    let user = await User.login(username, password)
    let token = createJWT(user._id)
    console.log('token')
    console.log(token)
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
    res.status(201).json({ user })
  } catch (error) {
    let errors = alertError(error)
    res.status(400).json({ errors })
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

    if (req.user) {
    res.redirect('/')
    } else {
      res.render('login', data)
    }

    
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
    message: ''
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

export const verifyuser = async (req, res, next) => {
  const token = req.cookies.jwt
  if (token) {
    console.log('token')
    console.log(token)
    jwt.verify(token, 'chatroom secret', async (err, decodedToken) => {
      if (err) {
        console.log('error.msg')
        console.log(err.message)
      } else {
        console.log('decodedToken.id')
        console.log(decodedToken.id)
        let user = await User.findById(decodedToken.id)
        res.json(user)
        next()
      }
    })
  } else {
    next()
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
