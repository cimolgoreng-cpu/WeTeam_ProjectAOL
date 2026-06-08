const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let projects = [
  {
    id: "proj-1",
    name: "Sistem Manajemen Data Akademik",
    description: "Mata Kuliah: Rekayasa Perangkat Lunak II (RPL-02)",
    objective: "Membangun platform manajemen proyek riset terintegrasi.",
    progress: 84,
    members: [
      { id: "m1", name: "Muhammad Alif", role: "Lead Developer", contributionsCount: 42, score: null },
      { id: "m2", name: "Siti Pertiwi", role: "System Analyst", contributionsCount: 28, score: null },
      { id: "m3", name: "Budi Kusuma", role: "UI Designer", contributionsCount: 22, score: null },
      { id: "m4", name: "Anton Wijaya", role: "Backend Dev", contributionsCount: 0, score: null }
    ],
    contributions: [
      { id: "c1", memberId: "m1", memberName: "Muhammad Alif", title: "Optimasi Database Indexing", date: "2026-06-05" },
      { id: "c2", memberId: "m2", memberName: "Siti Pertiwi", title: "Testing Integrasi API Payment", date: "2026-06-06" }
    ]
  }
];

app.get('/api/projects', (req, res) => {
  res.json(projects);
});

app.post('/api/projects', (req, res) => {
  const { name, description, objective } = req.body;
  const newProject = {
    id: `proj-${Date.now()}`,
    name,
    description,
    objective,
    progress: 0,
    members: [
      { id: "m1", name: "Muhammad Alif", role: "Project Creator", contributionsCount: 0, score: null }
    ],
    contributions: []
  };
  projects.push(newProject);
  res.status(201).json(newProject);
});

app.post('/api/projects/:id/contributions', (req, res) => {
  const projectId = req.params.id;
  const { memberId, memberName, title } = req.body;
  const project = projects.find(p => p.id === projectId);
  
  if (!project) return res.status(404).json({ error: "Project not found" });

  const newContribution = {
    id: `contrib-${Date.now()}`,
    memberId,
    memberName,
    title,
    date: new Date().toISOString().split('T')[0]
  };

  project.contributions.push(newContribution);

  const member = project.members.find(m => m.id === memberId);
  if (member) {
    member.contributionsCount += 1;
  }

  const totalMembers = project.members.length;
  const activeMembers = project.members.filter(m => m.contributionsCount > 0).length;
  project.progress = Math.round((activeMembers / totalMembers) * 100);

  res.status(201).json(project);
});

app.post('/api/projects/:projectId/grade', (req, res) => {
  const { projectId } = req.params;
  const { memberId, score } = req.body;
  const project = projects.find(p => p.id === projectId);
  
  if (!project) return res.status(404).json({ error: "Project not found" });

  project.members.forEach(m => {
    if (m.contributionsCount === 0) {
      m.score = 0;
    }
  });

  const member = project.members.find(m => m.id === memberId);
  if (member) {
    member.score = score;
    return res.json({ success: true, project });
  }

  res.status(404).json({ error: "Member not found" });
});

app.post('/api/projects/:id/join', (req, res) => {
  const project = projects.find(p => p.id === req.params.id);
  if (!project) return res.status(404).json({ error: "Project not found" });

  const { name, role } = req.body;
  const newMember = {
    id: `m-${Date.now()}`,
    name,
    role: role || "Contributor",
    contributionsCount: 0,
    score: null
  };

  project.members.push(newMember);
  
  const totalMembers = project.members.length;
  const activeMembers = project.members.filter(m => m.contributionsCount > 0).length;
  project.progress = Math.round((activeMembers / totalMembers) * 100);

  res.json(project);
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});