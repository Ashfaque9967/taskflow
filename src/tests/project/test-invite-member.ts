import axios from 'axios'

async function testInviteMember() {
  // 1. Login as project owner
  const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
    email: 'test@example.com',
    password: 'password123',
  })
  const token = loginRes.data.token

  // 2. Get projects to find an ID
  const projectsRes = await axios.get('http://localhost:5000/api/projects', {
    headers: { Authorization: `Bearer ${token}` }
  })
  const projectId = projectsRes.data.projects[0]?.id

  if (!projectId) {
    console.log('No projects found')
    return
  }

  // 3. Invite a member (we need another user first, so let's register one)
  const registerRes = await axios.post('http://localhost:5000/api/auth/register', {
    email: 'member@example.com',
    password: 'password123',
    name: 'Team Member',
  })

  // 4. Invite the new user to the project
  const inviteRes = await axios.post(`http://localhost:5000/api/projects/${projectId}/members`, {
    email: 'member@example.com',
    role: 'member',
  }, {
    headers: { Authorization: `Bearer ${token}` }
  })

  console.log('Invited:', inviteRes.data)
}

testInviteMember()