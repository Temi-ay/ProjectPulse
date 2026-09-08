import { addSessions } from "./storage.js";

let activeTimer = null; 

export function startTimer(projectId) {
    if (activeTimer) {
        throw new Error("A timer is already running for another project");
    }
    activeTimer = { projectId, startTime: Date.now() };
}

export function stopTimer() {
    if (!activeTimer) return;

    const endTime = Date.now();
    const durationSeconds = Math.round((endTime - activeTimer.startTime) / 1000);

    addSessions({
        id: Date.now(),
        projectId: activeTimer.projectId,
        startTime: activeTimer.startTime,
        endTime,
        durationSeconds
    });

    activeTimer = null;
}

export function isTimerRunning(projectId) {
    return activeTimer !== null && activeTimer.projectId === projectId;
}

export function getElapsedSeconds() {
    if (!activeTimer) return 0;
    return Math.round((Date.now() - activeTimer.startTime) / 1000);
}

export function formatElapsed(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const pad = (n) => String(n).padStart(2, "0");
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

export function getCountdown(deadlineString) {
    if (!deadlineString) return "No deadline set";

    const now = new Date();
    const deadline = new Date(deadlineString);
    const diff = deadline - now;

    if (diff <= 0) return "Deadline passed!";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);

    return `${days}d ${hours}h ${minutes}m remaining`;
}