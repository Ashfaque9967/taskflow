import axios from 'axios'

async function testGetTasks() {
  // 1. Login
  const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
    email: 'test@example.com',
    password: 'password123',
  })
  const token = loginRes.data.token

  // 2. Get all tasks (no filter)
  const allRes = await axios.get('http://localhost:5000/api/tasks', {
    headers: { Authorization: `Bearer ${token}` }
  })
  console.log('All tasks:', allRes.data)

  // 3. Get tasks by project (need a project ID first)
  const projectsRes = await axios.get('http://localhost:5000/api/projects', {
    headers: { Authorization: `Bearer ${token}` }
  })
  const projectId = projectsRes.data.projects[0]?.id

  if (projectId) {
    const filteredRes = await axios.get(`http://localhost:5000/api/tasks?projectId=${projectId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    console.log('Filtered by project:', filteredRes.data)
  }
}

testGetTasks()