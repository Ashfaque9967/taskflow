import axios from 'axios'

async function testFullFlow() {
  // 1. Register
  await axios.post('http://localhost:5000/api/auth/register', {
    email: 'fullflow@example.com',
    password: 'password123',
    name: 'Full Flow User',
  })

  // 2. Login
  const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
    email: 'fullflow@example.com',
    password: 'password123',
  })
  const token = loginRes.data.token

  // 3. Create project
  const projectRes = await axios.post('http://localhost:5000/api/projects', {
    name: 'Full Flow Project',
    description: 'Testing everything',
  }, { headers: { Authorization: `Bearer ${token}` } })
  const projectId = projectRes.data.project.id

  // 4. Create task
  const taskRes = await axios.post('http://localhost:5000/api/tasks', {
    title: 'Full Flow Task',
    priority: 'high',
    projectId,
  }, { headers: { Authorization: `Bearer ${token}` } })
  const taskId = taskRes.data.task.id

  // 5. Add comment
  const commentRes = await axios.post(`http://localhost:5000/api/tasks/${taskId}/comments`, {
    content: 'Everything works!',
  }, { headers: { Authorization: `Bearer ${token}` } })

  console.log('Full flow complete!')
  console.log('Project:', projectRes.data.project.name)
  console.log('Task:', taskRes.data.task.title)
  console.log('Comment:', commentRes.data.comment.content)
}

testFullFlow()