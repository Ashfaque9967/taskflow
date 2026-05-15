import axios from 'axios'

async function testProject() {
  // 1. Login to get token
  const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
    email: 'test@example.com',
    password: 'password123',
  })
  
  const token = loginRes.data.token

  // 2. Create project with token
  const res = await axios.post('http://localhost:5000/api/projects', {
    name: 'Website Redesign',
    description: 'Redesigning the company website with new branding',
  }, {
    headers: { Authorization: `Bearer ${token}` }
  })

  console.log('Success:', res.data)
}

testProject()