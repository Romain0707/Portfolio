const GITHUB_USERNAME = 'Romain0707';
const PROJECTS_CONFIG = [
    {
        repoName: 'Ohm-Sweet-Ohm',
        image: './assets/img/omhsweetohm.png',
        demoUrl: 'https://ohm-sweet-ohm-iota.vercel.app/'
    },

    {
        repoName: 'Mortgage-Repayment-Calculator',
        image: './assets/img/mortgage-calculator.png',
        demoUrl: 'https://front-end-mentor-mortgage-repayment.vercel.app/'
    },
    {
        repoName: 'Cerbaillance-Laboratory',
        image: './assets/img/cerbaillance.png',
        demoUrl: 'https://projet-commun-scientifique-xkp7.vercel.app/'
    },
    {
        repoName: 'Magic-The-Gathering',
        image: './assets/img/magic.png',
        demoUrl: 'https://projet-magic.vercel.app/'
    },
    {
        repoName: 'Espace-Renovation',
        image: './assets/img/renovation.png',
        demoUrl: 'https://projet-espace-renovation.vercel.app/'
    },
    {
        repoName: 'Green-Earth',
        image: './assets/img/green-earth.png',
        demoUrl: 'https://projet-green-earth.vercel.app/'
    }
];



// DOM Elements
const projectTimeline = document.getElementById('project-timeline');
const projectShowcase = document.getElementById('timeline-view');
const loadingContainer = document.getElementById('loading-container');
const emptyState = document.getElementById('empty-state');
const projectModal = document.getElementById('project-modal');
const modalClose = document.getElementById('modal-close');
const viewButtons = document.querySelectorAll('.projects-view-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const timelineIndicators = document.getElementById('timeline-indicators');

// Modal Elements
const modalImage = document.getElementById('modal-image');
const modalTitle = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description');
const modalStats = document.getElementById('modal-stats');
const modalLinks = document.getElementById('modal-links');

// State
let projects = [];
let currentProjectIndex = 0;
let scrollPosition = 0; // Store scroll position

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    fetchProjects();
    setupEventListeners();
});

// Scroll Lock Functions
function disableScroll() {
    // Store current scroll position
    scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add styles to prevent scrolling
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollPosition}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
}

function enableScroll() {
    // Remove scroll lock styles
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.style.overflow = '';
    
    // Restore scroll position
    window.scrollTo(0, scrollPosition);
}

// Event Listeners
function setupEventListeners() {
    modalClose.addEventListener('click', closeModal);
    
    // Close modal when clicking outside
    projectModal.addEventListener('click', (e) => {
        if (e.target === projectModal) {
            closeModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && projectModal.classList.contains('active')) {
            closeModal();
        }
    });

    // Timeline controls
    prevBtn.addEventListener('click', () => {
        navigateTimeline(-1);
    });

    nextBtn.addEventListener('click', () => {
        navigateTimeline(1);
    });
}

// Fetch Projects
async function fetchProjects() {
    try {
        const projectPromises = PROJECTS_CONFIG.map(config => {
            if (config.repoName) {
                const apiUrl = `https://api.github.com/repos/${GITHUB_USERNAME}/${config.repoName}`;
                return fetch(apiUrl)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`Repo '${config.repoName}' not found or API limit reached.`);
                        }
                        return response.json();
                    })
                    .then(repoData => ({
                        ...config,
                        title: repoData.name.split(/[-_]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
                        description: repoData.description || 'No description provided.',
                        stars: repoData.stargazers_count,
                        forks: repoData.forks_count,
                        repoUrl: repoData.html_url
                    }))
                    .catch(error => {
                        console.warn(`Failed to fetch ${config.repoName}:`, error.message);
                        return null;
                    });
            } else {
                return Promise.resolve({
                });
            }
        });

        const results = await Promise.all(projectPromises);
        projects = results.filter(p => p !== null);
        
        loadingContainer.style.display = 'none';
        projectShowcase.style.display = 'block';
        
        if (projects.length === 0) {
            projectShowcase.style.display = 'none';
            emptyState.style.display = 'block';
            return;
        }
        
        updateTimeline();
        
    } catch (error) {
        console.error("Error fetching projects:", error);
        showErrorState();
    }
}

// Timeline Functions
function updateTimeline() {
    if (projects.length === 0) return;

    emptyState.style.display = 'none';
    projectTimeline.innerHTML = '';
    timelineIndicators.innerHTML = '';

    // Reset index si besoin
    if (currentProjectIndex >= projects.length) {
        currentProjectIndex = 0;
    }

    projects.forEach((project, index) => {
        const projectNode = createTimelineNode(project, index);
        projectTimeline.appendChild(projectNode);

        const indicator = document.createElement('div');
        indicator.className = 'projects-timeline-indicator';
        if (index === currentProjectIndex) indicator.classList.add('active');
        indicator.addEventListener('click', () => {
            currentProjectIndex = index;
            updateTimeline();
        });
        timelineIndicators.appendChild(indicator);
    });

    updateNodePositions();
}

function updateNodePositions() {
    const nodes = projectTimeline.querySelectorAll('.project-node');
    nodes.forEach((node, index) => {
        node.classList.remove('active', 'prev', 'next', 'hidden', 'hidden-right');

        if (index === currentProjectIndex) node.classList.add('active');
        else if (index === (currentProjectIndex - 1 + projects.length) % projects.length) node.classList.add('prev');
        else if (index === (currentProjectIndex + 1) % projects.length) node.classList.add('next');
        else if (index < currentProjectIndex) node.classList.add('hidden');
        else node.classList.add('hidden-right');
    });

    const indicators = timelineIndicators.querySelectorAll('.projects-timeline-indicator');
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentProjectIndex);
    });
}

function navigateTimeline(direction) {
    if (projects.length === 0) return;

    currentProjectIndex = (currentProjectIndex + direction + projects.length) % projects.length;
    updateNodePositions();
}

function createTimelineNode(project, index) {
    const node = document.createElement('div');
    node.className = 'project-node';
    node.dataset.projectId = project.repoName || project.title;
    


    const demoLinkHTML = project.demoUrl ? 
        `<a href="${project.demoUrl}" class="project-link" target="_blank" rel="noopener noreferrer" title="Live Demo">
            <i class="fas fa-external-link-alt"></i>
        </a>` : '';

    const githubLinkHTML = project.repoUrl ? 
        `<a href="${project.repoUrl}" class="project-link" target="_blank" rel="noopener noreferrer" title="View on GitHub">
            <i class="fab fa-github"></i>
        </a>` : '';

    const statsHTML = project.stars !== undefined && project.forks !== undefined ? 
        `<div class="project-stats">
            <span><i class="fas fa-star"></i> ${project.stars}</span>
            <span><i class="fas fa-code-branch"></i> ${project.forks}</span>
        </div>` : '';

    node.innerHTML = `
        <div class="project-card">
            <img src="${project.image}" alt="${project.title}" class="project-image">
            <div class="project-content">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-footer">
                    ${statsHTML}
                    <div class="project-links">
                        ${githubLinkHTML}
                        ${demoLinkHTML}
                    </div>
                </div>
            </div>
        </div>
    `;

    node.addEventListener('click', (e) => {
        // Don't open modal if clicking on links
        if (!e.target.closest('.project-link')) {
            openModal(project);
        }
    });

    return node;
}


const icon = document.getElementById('fixed-icon');

// Modal Functions
function openModal(project) {
    // Create the modal HTML with image overlay buttons
    const modalHTML = `
        <div class="modal-content">
            <button class="modal-close" id="modal-close">
                <i class="fas fa-times"></i>
            </button>
            <div class="modal-image-container">
                <img src="${project.image}" alt="${project.title}" class="modal-image" id="modal-image">
                <div class="modal-image-overlay">
                    <div class="modal-image-buttons">
                        ${project.repoUrl ? `
                            <a href="${project.repoUrl}" class="modal-image-button secondary" target="_blank" rel="noopener noreferrer">
                                <i class="fab fa-github"></i>
                                View on GitHub
                            </a>
                        ` : ''}
                        ${project.demoUrl ? `
                            <a href="${project.demoUrl}" class="modal-image-button primary" target="_blank" rel="noopener noreferrer">
                                <i class="fas fa-external-link-alt"></i>
                                Live Demo
                            </a>
                        ` : ''}
                    </div>
                </div>
            </div>
            <div class="modal-body">
                <h2 class="modal-title" id="modal-title">${project.title}</h2>
                <p class="modal-description" id="modal-description">${project.description}</p>
                <div class="modal-stats" id="modal-stats">
                    ${project.stars !== undefined && project.forks !== undefined ? 
                        `<div class="stat-item">
                            <i class="fas fa-star"></i>
                            <span>${project.stars} Stars</span>
                        </div>
                        <div class="stat-item">
                            <i class="fas fa-code-branch"></i>
                            <span>${project.forks} Forks</span>
                        </div>` : ''}
                </div>
            </div>
        </div>
    `;
    
    // Update the modal content
    projectModal.innerHTML = modalHTML;
    
    //Hide burger Menu
    icon.style.position = 'absolute';
    
    // Re-attach event listeners for the new close button
    const newModalClose = document.getElementById('modal-close');
    newModalClose.addEventListener('click', closeModal);
    
    // Disable scrolling on background
    disableScroll();
    
    // Show modal
    projectModal.classList.add('active');
}

function closeModal() {
    // Hide modal
    projectModal.classList.remove('active');

    // Re face burger menu
    icon.style.position = 'fixed';
    
    // Re-enable scrolling on background
    enableScroll();
}

// Error State
function showErrorState() {
    loadingContainer.style.display = 'none';
    emptyState.style.display = 'block';
    emptyState.querySelector('.empty-title').textContent = 'Erreur de chargement des projets';
    emptyState.querySelector('.empty-description').textContent = 'Il y a eu un problème avec le chargement des projets, essayez plus tard, merci.';
}