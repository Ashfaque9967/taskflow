import axios from 'axios'

async function testTask() {
  // 1. Login
  const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
    email: 'test@example.com',
    password: 'password123',
  })
  const token = loginRes.data.token

  // 2. Create a project first (we need one for the task)
  const projectRes = await axios.post('http://localhost:5000/api/projects', {
    name: 'Mobile App',
    description: 'Building the iOS and Android companion app',
  }, {
    headers: { Authorization: `Bearer ${token}` }
  })
  const projectId = projectRes.data.project.id

  // 3. Create a task in that project
  const taskRes = await axios.post('http://localhost:5000/api/tasks', {
    title: 'Setup API authentication',
    description: 'Implement JWT auth for mobile API endpoints',
    priority: 'high',
    dueDate: '2026-05-22T10:00:00Z',
    projectId: projectId,
  }, {
    headers: { Authorization: `Bearer ${token}` }
  })

  console.log('Task created:', taskRes.data)
}

testTask()