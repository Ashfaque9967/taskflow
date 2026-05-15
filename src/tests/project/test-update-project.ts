import axios from 'axios'

async function testUpdateProject() {
  // 1. Login to get token
  const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
    email: 'test@example.com',
    password: 'password123',
  })
  
  const token = loginRes.data.token

  // 2. Get projects to find an ID
  const projectsRes = await axios.get('http://localhost:5000/api/projects', {
    headers: { Authorization: `Bearer ${token}` }
  })
  
  const projectId = projectsRes.data.projects[0].id

  // 3. Update the project
  const res = await axios.patch(`http://localhost:5000/api/projects/${projectId}`, {
    name: 'Website Redesign v2',
    status: 'archived',
  }, {
    headers: { Authorization: `Bearer ${token}` }
  })

  console.log('Updated:', res.data)
}

testUpdateProject()