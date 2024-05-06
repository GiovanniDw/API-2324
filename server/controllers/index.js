import { renderTemplate } from '../utils.js'

export const homeController = async (req, res, next) => {
  const { username, email, password, name, id } = req.body

  try {
    if (req.user) {
      console.log(req.user)
    }

    const data = { title: 'Movies', movieData: 'data', user: req.user, username: req.user.username }
    // const render = renderTemplate('index.liquid', data);

    console.log(data)

    // res.render('index', data)
    // res.send(renderTemplate('views/index.liquid', data));
    res.render('index.njk', data)
  } catch (err) {
    let data = {
      error: { message: err },
    }

    // res.send(renderTemplate('views/index.liquid', data));
    res.render('index.njk', data)
  }
}
