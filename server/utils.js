import { Liquid } from 'liquidjs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const engine = new Liquid({
  root: __dirname, // for layouts and partials
  extname: '.liquid'
})

export const renderTemplate = (template, data) => {
  const templateData = {
    NODE_ENV: process.env.NODE_ENV || 'production',
    ...data
  }

  return engine.renderFileSync(`${template}`, templateData)
}
