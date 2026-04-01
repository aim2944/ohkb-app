/**
 * Local dev server for /api/translate
 * Run: node dev-server.js
 * (in a separate terminal while vite runs)
 */
import express from 'express'
import { config } from 'dotenv'
import { createRequire } from 'module'

config({ path: '.env.local' })

const require = createRequire(import.meta.url)
const app = express()
app.use(express.json())

app.post('/api/translate', async (req, res) => {
  const handler = (await import('./api/translate.js')).default
  return handler(req, res)
})

app.listen(3001, () => console.log('API dev server running on http://localhost:3001'))
