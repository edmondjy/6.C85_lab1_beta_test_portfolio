// Import the required functions from global.js
import { fetchJSON, renderProjects } from '../global.js';

// Fetch project data from the JSON file
const projects = await fetchJSON('../lib/projects.json');

// Select the container where we want to render the project articles
const projectsContainer = document.querySelector('.projects');

// Render the projects with h3 heading level
renderProjects(projects, projectsContainer, 'h3');

// Count the projects and display in the projects-title element
const projectsTitle = document.querySelector('.projects-title');
if (projectsTitle) {
  projectsTitle.textContent = `Projects (${projects.length})`;
}