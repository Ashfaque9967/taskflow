import axios from 'axios'

async function testUsers() {
  // 1. Login
  const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
    email: 'test@example.com',
    password: 'password123',
  })
  const token = loginRes.data.token

  // 2. Get all users
  const res = await axios.get('http://localhost:5000/api/users', {
    headers: { Authorization: `Bearer ${token}` }
  })

  console.log('Users:', res.data)
}

testUsers()