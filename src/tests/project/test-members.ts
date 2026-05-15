import axios from 'axios'

async function testMembers() {
  // 1. Login as owner
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

  // 3. List members
  const listRes = await axios.get(`http://localhost:5000/api/projects/${projectId}/members`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  console.log('Members:', listRes.data)

  // 4. Remove member (get member userId from list)
  const memberToRemove = listRes.data.members[0]?.userId
  if (memberToRemove) {
    const removeRes = await axios.delete(`http://localhost:5000/api/projects/${projectId}/members/${memberToRemove}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    console.log('Removed:', removeRes.data)
  }
}

testMembers()