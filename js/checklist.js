import { getTasks, saveTasks, deleteTask } from "./storage.js";

export function addTask(projectId, text) {
    const task = {
        id: Date.now(),
        projectId,
        text,
        done: false
    };
    saveTasks(task);
    return task;
}

export function toggleTask(taskId, projectId) {
    const task = getTasks(projectId).find(t => t.id === taskId);
    if (!task) return;

    task.done = !task.done;
    saveTasks(task);
}
export function getProgress(projectId) {
    const tasks = getTasks(projectId);
    if (tasks.length === 0) return 0;

    const completed = tasks.filter(t => t.done).length;
    return Math.round((completed / tasks.length) * 100);
}
export function renderChecklist(projectId, containerEl, onChange) {
    const tasks = getTasks(projectId);
    containerEl.innerHTML = "";

    tasks.forEach(task => {
        const item = document.createElement("div");
        item.className = "task-item";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.done;
        checkbox.addEventListener("change", () => {
            toggleTask(task.id, projectId);
            renderChecklist(projectId, containerEl, onChange);
            if (onChange) onChange();
        });

        const label = document.createElement("span");
        label.textContent = task.text;
        if (task.done) label.style.textDecoration = "line-through";

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "×";
        deleteBtn.className = "task-delete";
        deleteBtn.addEventListener("click", () => {
            deleteTask(task.id);
            renderChecklist(projectId, containerEl, onChange);
            if (onChange) onChange();
        });

        item.appendChild(checkbox);
        item.appendChild(label);
        item.appendChild(deleteBtn);
        containerEl.appendChild(item);
    });

}