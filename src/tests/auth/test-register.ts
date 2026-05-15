import axios from 'axios'

async function testRegister() {
  try {
    const res = await axios.post('http://localhost:5000/api/auth/register', {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
    })
    console.log('Success:', res.data)
  } catch (err: any) {
    console.log('Error:', err.response?.data || err.message)
  }
}

testRegister()