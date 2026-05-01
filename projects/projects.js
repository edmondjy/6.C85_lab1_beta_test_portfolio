import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');
const projectsTitle = document.querySelector('.projects-title');

let query = '';
let selectedYear = null; 

let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
let colors = d3.scaleOrdinal(d3.schemeTableau10);


function filterAndRenderProjects() {
  let filteredProjects = projects.filter((project) => {
    let matchesQuery = query === '' || Object.values(project).join('\n').toLowerCase().includes(query.toLowerCase());
    let matchesYear = selectedYear === null || project.year === selectedYear;
    return matchesQuery && matchesYear;
  });

  renderProjects(filteredProjects, projectsContainer, 'h2');
  
  if (projectsTitle) {
    projectsTitle.textContent = `Projects (${filteredProjects.length})`;
  }
}

function renderPieChart(projectsGiven) {
  let newSVG = d3.select('#projects-pie-plot');
  newSVG.selectAll('path').remove();
  let legend = d3.select('.legend');
  legend.selectAll('*').remove();

  let newRolledData = d3.rollups(
    projectsGiven,
    (v) => v.length,
    (d) => d.year
  );

  let newData = newRolledData.map(([year, count]) => {
    return { value: count, label: year };
  });

  let newSliceGenerator = d3.pie().value((d) => d.value);
  let newArcData = newSliceGenerator(newData);
  let newArcs = newArcData.map((d) => arcGenerator(d));

  let selectedIndex = newData.findIndex((d) => d.label === selectedYear);

  newArcs.forEach((arc, i) => {
    newSVG
      .append('path')
      .attr('d', arc)
      .attr('fill', colors(i))
      .attr('class', i === selectedIndex ? 'selected' : '')
      .on('click', () => {
        selectedIndex = selectedIndex === i ? -1 : i;
        
        selectedYear = selectedIndex === -1 ? null : newData[selectedIndex].label;

        newSVG
          .selectAll('path')
          .attr('class', (_, idx) => (idx === selectedIndex ? 'selected' : ''));
        legend
          .selectAll('li')
          .attr('class', (_, idx) => (idx === selectedIndex ? 'legend-item selected' : 'legend-item'));

        filterAndRenderProjects();
      });
  });

  newData.forEach((d, idx) => {
    legend
      .append('li')
      .attr('class', idx === selectedIndex ? 'legend-item selected' : 'legend-item')
      .attr('style', `--color:${colors(idx)}`)
      .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
  });
}

filterAndRenderProjects();
renderPieChart(projects);

let searchInput = document.querySelector('.searchBar');
searchInput.addEventListener('input', (event) => {
  query = event.target.value;
  

  let filteredByQuery = projects.filter((project) => {
    return query === '' || Object.values(project).join('\n').toLowerCase().includes(query.toLowerCase());
  });

  renderPieChart(filteredByQuery);
  filterAndRenderProjects(); // Updates the text list using BOTH filters
});