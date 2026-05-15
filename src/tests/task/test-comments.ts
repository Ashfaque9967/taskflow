import axios from 'axios'

async function testComments() {
  // 1. Login
  const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
    email: 'test@example.com',
    password: 'password123',
  })
  const token = loginRes.data.token

  // 2. Get projects to create a task in
  const projectsRes = await axios.get('http://localhost:5000/api/projects', {
    headers: { Authorization: `Bearer ${token}` }
  })
  const projectId = projectsRes.data.projects[0]?.id

  if (!projectId) {
    console.log('No projects found')
    return
  }

  // 3. Create a new task
  const taskRes = await axios.post('http://localhost:5000/api/tasks', {
    title: 'Design new landing page',
    description: 'Create mockups for the homepage redesign',
    priority: 'medium',
    projectId: projectId,
  }, {
    headers: { Authorization: `Bearer ${token}` }
  })
  const taskId = taskRes.data.task.id
  console.log('Task created:', taskRes.data.task.title)

  // 4. Add a comment
  const addRes = await axios.post(`http://localhost:5000/api/tasks/${taskId}/comments`, {
    content: 'This is taking longer than expected. Need help with the design system.',
  }, {
    headers: { Authorization: `Bearer ${token}` }
  })
  console.log('Added:', addRes.data)

  // 5. List comments
  const listRes = await axios.get(`http://localhost:5000/api/tasks/${taskId}/comments`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  console.log('Comments:', listRes.data)
}

testComments()