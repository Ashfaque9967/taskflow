import axios from 'axios'

async function testLogin() {
  try {
    const res = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'test@example.com',
      password: 'password123',
    })
    console.log('Success:', res.data)
  } catch (err: any) {
    console.log('Error:', err.response?.data || err.message)
  }
}

testLogin()