const influencers = [
    {
        name: "Elena Rodriguez",
        region: "Madrid, Spain",
        category: "Lifestyle & Fashion",
        followers: "124K",
        engagement: "4.8%",
        matchScore: 98,
        image: "assets/influencer_1.png",
        verified: true
    },
    {
        name: "Marcus Chen",
        region: "Vancouver, Canada",
        category: "Tech & Innovation",
        followers: "89K",
        engagement: "6.2%",
        matchScore: 94,
        image: "assets/influencer_3.png",
        verified: true
    },
    {
        name: "Sofia Rossi",
        region: "Milan, Italy",
        category: "Beauty & Wellness",
        followers: "210K",
        engagement: "3.5%",
        matchScore: 89,
        image: "assets/influencer_4.png",
        verified: true
    },
    {
        name: "Alex Thompson",
        region: "Austin, TX",
        category: "Fitness & Health",
        followers: "45K",
        engagement: "12.4%",
        matchScore: 92,
        image: "assets/influencer_2.png",
        verified: true
    }
];

function renderInfluencers() {
    const grid = document.getElementById('influencer-grid');
    grid.innerHTML = influencers.map((inf, index) => `
        <div class="influencer-card" style="animation-delay: ${index * 0.1}s">
            <div class="card-image">
                <img src="${inf.image}" alt="${inf.name}">
                <div class="ai-match-badge">
                    <i data-lucide="sparkles" style="width: 12px; height: 12px;"></i>
                    ${inf.matchScore}% Match
                </div>
            </div>
            <div class="card-content">
                <div class="card-title">
                    <h3>${inf.name}</h3>
                    ${inf.verified ? '<i data-lucide="check-circle-2" class="verified-tick"></i>' : ''}
                </div>
                <p class="card-region">${inf.region} • ${inf.category}</p>
                
                <div class="card-stats">
                    <div class="stat-item">
                        <span class="stat-label">Followers</span>
                        <span class="stat-value">${inf.followers}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Engagement</span>
                        <span class="stat-value">${inf.engagement}</span>
                    </div>
                </div>

                <div class="engagement-container">
                    <div class="engagement-label">
                        <span>Campaign Match</span>
                        <span>${inf.matchScore}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${inf.matchScore}%"></div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    // Re-initialize icons for dynamic content
    lucide.createIcons();
}

// Theme Switching
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);

// Navigation interaction
const navItems = document.querySelectorAll('.sidebar-nav li');
navItems.forEach(item => {
    item.addEventListener('click', () => {
        navItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
    });
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderInfluencers();
});
