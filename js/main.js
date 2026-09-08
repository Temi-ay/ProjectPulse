import { getProjects, saveProjects, deleteProject } from "./storage.js";
import { getCountdown, startTimer, stopTimer, isTimerRunning, getElapsedSeconds, formatElapsed } from "./timer.js";
import { addTask, renderChecklist } from "./checklist.js";
import { getTasks } from "./storage.js";
 
const projectForm = document.getElementById("project-form");
const projectFormSubmitBtn = projectForm.querySelector("button[type='submit']");
const projectsGrid = document.getElementById("projects");
const projectDetail = document.getElementById("project-detail");
const backBtn = document.getElementById("back-button");
const editBtn = document.getElementById("edit-project");
const deleteBtn = document.getElementById("delete-project");
 
const timerDisplay = document.getElementById("timer-display");
const timerStartBtn = document.getElementById("start-timer");
const timerStopBtn = document.getElementById("stop-timer");
 
const checklistForm = document.getElementById("checklist-form");
const checklistInput = document.getElementById("checklist-input");
const checklistItems = document.getElementById("checklist-items");
const checklistCount = document.getElementById("checklist-count");
 
let currentProjectId = null;
let editingProjectId = null; 
let timerInterval = null;
 
projectForm.addEventListener("submit", (e) => {
    e.preventDefault();
 
    const name = document.getElementById("project-name").value;
    const description = document.getElementById("project-description").value;
    const repoUrl = document.getElementById("project-repo").value;
    const hackathonLink = document.getElementById("project-hackathon").value;
    const deadline = document.getElementById("project-deadline").value;
 
    if (editingProjectId) {
        const existing = getProjects().find(p => p.id === editingProjectId);
        const project = {
            ...existing,
            name,
            description,
            repoUrl,
            hackathonLink,
            deadline
        };
        saveProjects(project);
        editingProjectId = null;
        projectFormSubmitBtn.textContent = "Save Project";
    } else {
        const project = {
            id: Date.now(),
            name,
            description,
            repoUrl,
            hackathonLink,
            deadline,
            createdAt: new Date().toISOString()
        };
        saveProjects(project);
    }
 
    projectForm.reset();
    renderProjects();
});
 
function linkOrText(url) {
    if (!url) return "";
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation()">${url}</a>`;
}
 
export function renderProjects() {
    const projects = getProjects();
    projectsGrid.innerHTML = "";
 
    if (projects.length === 0) {
        projectsGrid.innerHTML = `<p class="empty-state">No projects yet — create one above to get started.</p>`;
        return;
    }
 
    projects.forEach(project => {
        const card = document.createElement("div");
        card.className = "project-card";
        card.innerHTML = `
            <h4>${project.name}</h4>
            <p>${project.description}</p>
            ${project.hackathonLink ? `<p>${linkOrText(project.hackathonLink)}</p>` : ""}
            ${project.repoUrl ? `<p>${linkOrText(project.repoUrl)}</p>` : ""}
            <p class="countdown">${getCountdown(project.deadline)}</p>
        `;
        card.addEventListener("click", () => openDetail(project.id));
        projectsGrid.appendChild(card);
    });
}
 
function openDetail(projectId) {
    const project = getProjects().find(p => p.id === projectId);
    if (!project) return;
 
    currentProjectId = projectId;
 
    document.getElementById("detail-name").textContent = project.name;
    document.getElementById("detail-description").textContent = project.description;
    document.getElementById("detail-repo").innerHTML = linkOrText(project.repoUrl);
    document.getElementById("detail-hackathon").innerHTML = linkOrText(project.hackathonLink);
    document.getElementById("detail-deadline").textContent = getCountdown(project.deadline);
 
    updateTimerDisplay();
    updateChecklist();
 
    projectsGrid.style.display = "none";
    projectDetail.style.display = "block";
}
 
function goBackToGrid() {
    stopTimerLoop();
    projectDetail.style.display = "none";
    projectsGrid.style.display = "grid";
    renderProjects();
}
 
backBtn.addEventListener("click", () => {
    if (isTimerRunning(currentProjectId)) {
        const confirmed = confirm("A timer is still running. Leaving without stopping it will lose this time. Leave anyway?");
        if (!confirmed) return;
    }
    goBackToGrid();
});
 
editBtn.addEventListener("click", () => {
    const project = getProjects().find(p => p.id === currentProjectId);
    if (!project) return;
 
    editingProjectId = project.id;
    document.getElementById("project-name").value = project.name || "";
    document.getElementById("project-description").value = project.description || "";
    document.getElementById("project-repo").value = project.repoUrl || "";
    document.getElementById("project-hackathon").value = project.hackathonLink || "";
    document.getElementById("project-deadline").value = project.deadline || "";
    projectFormSubmitBtn.textContent = "Update Project";
 
    goBackToGrid();
    window.scrollTo({ top: 0, behavior: "smooth" });
});
 
deleteBtn.addEventListener("click", () => {
    const project = getProjects().find(p => p.id === currentProjectId);
    if (!project) return;
 
    const confirmed = confirm(`Delete "${project.name}"? This also deletes its tasks and logged time. This can't be undone.`);
    if (!confirmed) return;
 
    deleteProject(currentProjectId);
    currentProjectId = null;
    goBackToGrid();
});
 
timerStartBtn.addEventListener("click", () => {
    if (!currentProjectId) return;
    startTimer(currentProjectId);
    startTimerLoop();
});
 
timerStopBtn.addEventListener("click", () => {
    stopTimer();
    stopTimerLoop();
    updateTimerDisplay();
});
 
function startTimerLoop() {
    stopTimerLoop();
    timerInterval = setInterval(updateTimerDisplay, 1000);
}
 
function stopTimerLoop() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}
 
function updateTimerDisplay() {
    if (isTimerRunning(currentProjectId)) {
        timerDisplay.textContent = formatElapsed(getElapsedSeconds());
    } else {
        timerDisplay.textContent = "00:00:00";
    }
}
 
checklistForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!currentProjectId) return;
 
    const text = checklistInput.value;
    if (!text) return;
 
    addTask(currentProjectId, text);
    checklistForm.reset();
    updateChecklist();
});
 
function updateChecklist() {
    if (!currentProjectId) return;
    renderChecklist(currentProjectId, checklistItems, updateChecklistCount);
    updateChecklistCount();
}
 
function updateChecklistCount() {
    const tasks = getTasks(currentProjectId);
    const completed = tasks.filter(t => t.done).length;
    checklistCount.textContent = `${completed}/${tasks.length}`;
}
setInterval(() => {
    if (projectsGrid.style.display !== "none") {
        renderProjects();
    }
}, 60000);
 
renderProjects();