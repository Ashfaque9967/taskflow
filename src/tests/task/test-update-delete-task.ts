import axios from 'axios'

async function testUpdateDeleteTask() {
  // 1. Login
  const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
    email: 'test@example.com',
    password: 'password123',
  })
  const token = loginRes.data.token

  // 2. Get tasks to find an ID
  const tasksRes = await axios.get('http://localhost:5000/api/tasks', {
    headers: { Authorization: `Bearer ${token}` }
  })
  const taskId = tasksRes.data.tasks[0]?.id

  if (!taskId) {
    console.log('No tasks found')
    return
  }

  // 3. Update task — change status to in-progress
  const updateRes = await axios.patch(`http://localhost:5000/api/tasks/${taskId}`, {
    status: 'in-progress',
  }, {
    headers: { Authorization: `Bearer ${token}` }
  })
  console.log('Updated:', updateRes.data)

  // 4. Delete task
  const deleteRes = await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  console.log('Deleted:', deleteRes.data)
}

testUpdateDeleteTask()