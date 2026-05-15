import axios from 'axios'

async function testDeleteProject() {
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

  // 3. Delete the project
  const res = await axios.delete(`http://localhost:5000/api/projects/${projectId}`, {
    headers: { Authorization: `Bearer ${token}` }
  })

  console.log('Deleted:', res.data)
}

testDeleteProject()