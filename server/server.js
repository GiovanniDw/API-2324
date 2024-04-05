import 'dotenv/config';
import { App } from '@tinyhttp/app'
import { logger } from '@tinyhttp/logger'
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import { Liquid } from 'liquidjs';
import sirv from 'sirv';

const PORT = process.env.PORT || 3000;

const engine = new Liquid({
  extname: '.liquid'
});

const app = new App()

app
  .use(logger())
  .use('/', sirv('src/'))
  .listen(PORT)



  app.get('/', async (req, res) => {
    // const movieData = await getMovies();
    const data = { title: 'Movies', movieData: 'data' };
    // const render = renderTemplate('index.liquid', data);
    
console.log(data)
    
    return res.send(renderTemplate('index.liquid', data));
    // return res.send(renderTemplate('views/index.liquid', { title: 'Home' }));
  });



const renderTemplate = (template, data) => {
  const templateData = {
    NODE_ENV: process.env.NODE_ENV || 'production',
    ...data
  };

  return engine.renderFileSync(`views/${template}`, templateData);
};