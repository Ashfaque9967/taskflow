import dotenv from 'dotenv'
dotenv.config()
console.log('DATABASE_URL:', process.env.DATABASE_URL)

import express from 'express'
import authRoutes from './routes/auth'
import userRoutes from './routes/user'
import projectRoutes from './routes/project'
import taskRoutes from './routes/task'

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json())
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/users', userRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/tasks', taskRoutes)

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'TaskFlow API is running' })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})