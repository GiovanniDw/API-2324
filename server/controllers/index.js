import { renderTemplate } from '../utils.js';


export const homeController = async (req, res, next) => {
  const { username, email, password, name, id } = req.body;

  try {
    const data = { title: 'Movies', movieData: 'data' }
  // const render = renderTemplate('index.liquid', data);

  console.log(data)

  res.render('index', data);
  } catch (err) {
    let data = {
      error: { message: err }
    };
    
    return res.send(renderTemplate('views/index.liquid', data));
  } finally {
    next();
  }
};