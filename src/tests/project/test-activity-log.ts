import axios from 'axios'

async function testActivityLog() {
  // 1. Login
  const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
    email: 'test@example.com',
    password: 'password123',
  })
  const token = loginRes.data.token

  // 2. Get projects
  const projectsRes = await axios.get('http://localhost:5000/api/projects', {
    headers: { Authorization: `Bearer ${token}` }
  })
  const projectId = projectsRes.data.projects[0]?.id

  if (!projectId) {
    console.log('No projects found')
    return
  }

  // 3. Create a task to generate activity
  await axios.post('http://localhost:5000/api/tasks', {
    title: 'Activity Test Task',
    priority: 'medium',
    projectId,
  }, {
    headers: { Authorization: `Bearer ${token}` }
  })

  // 4. Get activity log
  const logRes = await axios.get(`http://localhost:5000/api/projects/${projectId}/activity`, {
    headers: { Authorization: `Bearer ${token}` }
  })

  console.log('Activity Log:', logRes.data)
}

testActivityLog()