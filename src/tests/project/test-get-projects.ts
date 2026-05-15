import axios from 'axios'

async function testGetProjects() {
  // 1. Login to get token
  const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
    email: 'test@example.com',
    password: 'password123',
  })
  
  const token = loginRes.data.token

  // 2. Get all projects
  const res = await axios.get('http://localhost:5000/api/projects', {
    headers: { Authorization: `Bearer ${token}` }
  })

  console.log('Projects:', res.data)
}

testGetProjects()