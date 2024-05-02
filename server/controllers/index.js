import { renderTemplate } from '../utils.js'

export const homeController = async (req, res, next) => {
  const { username, email, password, name, id } = req.body

  let user = false

  try {
    if (req.user) {
      user = req.user
    }

    const data = { title: 'Movies', movieData: 'data', user: user }
    // const render = renderTemplate('index.liquid', data);

    console.log(data)

    return res.render('index', data)
  } catch (err) {
    let data = {
      error: { message: err }
    }

    res.render('index', data)
  }
}


