import { getProjects, saveProjects } from "./storage.js";
const projectForm = document.getElementById("project-form");
const projectsGrid = document.getElementById("projects");
const projectDetails = document.getElementById("project-detail");
const backBtn = document.getElementById("back-button");


projectForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("project-name").value;
    const description = document.getElementById("project-description").value;
    const repoUrl = document.getElementById("project-repo").value;
    const hackathonLink = document.getElementById("project-hackathon").value;
    const project = {
        id: Date.now(),
        name,
        description,
        repoUrl,
        hackathonLink,
        createdAt: new Date().toISOString()

    };
    saveProjects(project)
    projectForm.reset();
    renderProjects();
});

export function renderProjects() {
    const  projects = getProjects();
    projectsGrid.innerHTML = '';
    projects.forEach(project => {
        const card = document.createElement("div");
        card.className = "project-card";
        card.innerHTML = `<h4>${project.name}<h4>
         <h5>${project.description}<h4>
         ${project.hackathonLink ? `<p> ${project.hackathonLink}</p>` : ''}
         ${project.repoUrl ? `<p> ${project.repoUrl}</p>` : ''} 
        `;
        card.addEventListener('click', () => openDetail(project.id));
        projectsGrid.appendChild(card);
    });
}

function openDetail(projectId) {
    const project = getProjects().find(p => p.id === projectId);
    if (!project) return;
    document.getElementById("detail-name").textContent = project.name
    document.getElementById("detail-description").textContent = project.description
    document.getElementById("detail-repo").textContent = project.repoUrl
    document.getElementById("detail-hackathon").textContent = project.hackathonLink
    projectsGrid.style.display = "grid";
    projectDetails.style.display = "block";
}

backBtn.addEventListener("click", () => {
    projectDetails.style.display ="none";
    projectsGrid.style.display ="gri";
})

export function getCountdown(deadlineString) {
    const now = new Date();
    const deadline = new Date(deadlineString);
    const diff = deadline - now;
    if (diff <= 0) return "Deadline passed!";
    const days = Math.floor(diff /(1000 * 60 * 60 * 24));
    const hours = Math.floor((diff /(1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff /(1000 * 60 )) % 60);
    return `${days}d ${hours}h ${minutes}m remaining`;
}

renderProjects()