import { renderTemplate } from '../utils.js';


export const homeController = async (req, res, next) => {
  const { username, email, password, name, id } = req.body;

  try {
    const data = { title: 'Movies', movieData: 'data', user: req.user }
  // const render = renderTemplate('index.liquid', data);

  console.log(data)

  res.render('index', data);
  } catch (err) {
    let data = {
      error: { message: err }
    };
    
    res.render('index', data);
  }
};