import axios from 'axios'

async function testMe() {
  try {
    const res = await axios.get('http://localhost:5000/api/user/me', {
      headers: {
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJlNTA5ZTZiYy0wOGNjLTQzOTAtOGE1Ny1jNDA1YjAzZTIyZWQiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJpYXQiOjE3Nzg4NjMyNDAsImV4cCI6MTc3OTQ2ODA0MH0.v6Ig40PZER6llAlar1y84RXDiDbI2_e0AWPwi1qh_eg'
      }
    })
    console.log('Success:', res.data)
  } catch (err: any) {
    console.log('Error:', err.response?.data || err.message)
  }
}

testMe()