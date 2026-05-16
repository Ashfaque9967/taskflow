import axios from "axios";

const API_BASE = "http://localhost:5000/api";

async function testGetProjectById() {
  try {
    // 1. Login to get token
    const loginRes = await axios.post(`${API_BASE}/auth/login`, {
      email: "test@example.com",
      password: "password123",
    });
    const token = loginRes.data.token;
    console.log("✅ Login successful");

    // 2. Get all projects to find an ID
    const projectsRes = await axios.get(`${API_BASE}/projects`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const projectId = projectsRes.data.projects[0]?.id;

    if (!projectId) {
      console.log("❌ No projects found. Create one first.");
      return;
    }
    console.log(`✅ Found project ID: ${projectId}`);

    // 3. Get single project by ID
    const projectRes = await axios.get(`${API_BASE}/projects/${projectId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("✅ Project fetched successfully!");
    console.log("📦 Project Data:");
    console.log(JSON.stringify(projectRes.data, null, 2));

    // 4. Verify structure
    const project = projectRes.data.project;
    console.log("🔍 Structure Check:");
    console.log(`  ID: ${project.id ? "✅" : "❌"}`);
    console.log(`  Name: ${project.name ? "✅" : "❌"}`);
    console.log(
      `  Description: ${project.description !== undefined ? "✅" : "❌"}`,
    );
    console.log(`  Status: ${project.status ? "✅" : "❌"}`);
    console.log(`  CreatedAt: ${project.createdAt ? "✅" : "❌"}`);
    console.log(`  Owner: ${project.owner ? "✅" : "❌"}`);
    console.log(`    Owner ID: ${project.owner?.id ? "✅" : "❌"}`);
    console.log(`    Owner Name: ${project.owner?.name ? "✅" : "❌"}`);
    console.log(`    Owner Email: ${project.owner?.email ? "✅" : "❌"}`);
    console.log(
      `  Tasks: ${Array.isArray(project.tasks) ? "✅" : "❌"} (${project.tasks?.length} tasks)`,
    );
    console.log(
      `  Members: ${Array.isArray(project.members) ? "✅" : "❌"} (${project.members?.length} members)`,
    );
  } catch (err: any) {
    console.error("❌ Error:", err.response?.data || err.message);
  }
}

testGetProjectById();
