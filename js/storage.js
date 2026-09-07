const STORAGE_KEY = "hacktrack_data"

function loadAll() {
    const raw= localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {
        hackathons:[],
        projects:[],
        tasks:[],
        sessions:[],
        xpEvents:[],
    }
}

function saveAll(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getProjects() {
    return loadAll().projects;
}
export function saveProjects(project) {
    const data = loadAll();
    const index = data.projects.findIndex(p => p.id === project.id);
    if (index >= 0) {
        data.projects[index] = project;
    }else{
        data.projects.push(project);
    }
    saveAll(data);
}
export function getHackathons() {
  return loadAll().hackathons;
}

export function saveHackathons(hackathon) {
  const data = loadAll();
  const index = data.hackathons.findIndex(h => h.id === hackathon.id);
  if (index >= 0) {
    data.hackathons[index] = hackathon;
  } else {
    data.hackathons.push(hackathon);
  }
  saveAll(data);
}

export function getTasks(projectId) {
    return loadAll().tasks.filter(t => t.projectId === projectId);
}
export function addTasks(task) {
    const data = loadAll();
    data.tasks.push(task);
    saveAll(data);
}

export function getSessions(projectId) {
    return loadAll().sessions.filter(s => s.projectId === projectId);
}
export function addSessions(session) {
    const data = loadAll();
    data.sessions.push(session);
    saveAll(data);
}

export function getXpEvents() {
    return loadAll().xpEvents;
}
export function addXpEvents(xpEvent) {
    const data = loadAll();
    data.xpEvents.push(xpEvent);
    saveAll(data);
} 