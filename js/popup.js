// Global variables
let githubUsername = 'rumi097'; // Default username
let followerNames = [];
let followingNames = [];
let followersNotFollowing = [];
let followingNotFollowers = [];
let followersFollowing = [];

// Initialize extension - Fast render first
document.addEventListener('DOMContentLoaded', function() {
    // Set default username immediately
    document.getElementById('github-username').value = githubUsername;
    
    // Load saved data asynchronously (non-blocking)
    setTimeout(() => loadSavedData(), 0);
    
    // Form submission
    document.getElementById('github-form').addEventListener('submit', function(e) {
        e.preventDefault();
        githubUsername = document.getElementById('github-username').value.trim();
        const accessToken = document.getElementById('github-access-token').value.trim();
        
        if (githubUsername) {
            analyzeGitHub(githubUsername, accessToken);
        }
    });
    
    // Back button
    document.getElementById('btn-back').addEventListener('click', function() {
        showFormSection();
    });
    
    // Sort buttons
    document.getElementById('btn-sort-asc').addEventListener('click', function() {
        sortData('asc');
    });
    
    document.getElementById('btn-sort-desc').addEventListener('click', function() {
        sortData('desc');
    });
    
    // Download button
    document.getElementById('btn-download').addEventListener('click', function() {
        downloadJSON();
    });
    
    // Tab switching
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', function() {
            const tab = this.getAttribute('data-tab');
            switchTab(tab);
        });
    });
});

// Show/Hide sections
function showFormSection() {
    document.getElementById('form-section').style.display = 'block';
    document.getElementById('results-section').style.display = 'none';
    document.getElementById('loading-container').style.display = 'none';
}

function showResultsSection() {
    document.getElementById('form-section').style.display = 'none';
    document.getElementById('results-section').style.display = 'block';
    document.getElementById('loading-container').style.display = 'none';
}

function showLoading() {
    document.getElementById('loading-container').style.display = 'flex';
    document.getElementById('form-section').style.display = 'none';
    document.getElementById('results-section').style.display = 'none';
}

// Main analysis function
async function analyzeGitHub(username, accessToken) {
    showLoading();
    
    try {
        // Fetch user data
        const userResponse = await fetchWithAuth(`https://api.github.com/users/${username}`, accessToken);
        const user = await userResponse.json();
        
        if (!userResponse.ok) {
            throw new Error(user.message || 'Failed to fetch user data');
        }
        
        // Fetch followers and following
        const followers = await fetchAllPaginated(`https://api.github.com/users/${username}/followers`, accessToken);
        const following = await fetchAllPaginated(`https://api.github.com/users/${username}/following`, accessToken);
        
        // Process data
        followerNames = followers.map(f => ({ login: f.login, id: f.id, avatar: f.avatar_url }));
        followingNames = following.map(f => ({ login: f.login, id: f.id, avatar: f.avatar_url }));
        
        const followerLogins = followerNames.map(f => f.login);
        const followingLogins = followingNames.map(f => f.login);
        
        followersNotFollowing = followerNames.filter(f => !followingLogins.includes(f.login));
        followingNotFollowers = followingNames.filter(f => !followerLogins.includes(f.login));
        followersFollowing = followerNames.filter(f => followingLogins.includes(f.login));
        
        // Display results
        displayUserProfile(user);
        displayStats();
        displayLists();
        
        // Save data
        saveData();
        
        showResultsSection();
    } catch (error) {
        console.error('Error:', error);
        let errorMsg = 'Error: ' + error.message;
        if (error.name === 'AbortError') {
            errorMsg = 'Request timed out. Please check your internet connection and try again.';
        }
        alert(errorMsg + '\n\nPlease check the username and try again.');
        showFormSection();
    }
}

// Fetch with authentication and timeout
function fetchWithAuth(url, accessToken, timeout = 10000) {
    const headers = {
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28'
    };
    
    if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
    }
    
    // Add timeout to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    return fetch(url, { 
        headers,
        signal: controller.signal 
    }).finally(() => clearTimeout(timeoutId));
}

// Fetch all paginated data
async function fetchAllPaginated(url, accessToken) {
    let allData = [];
    let page = 1;
    
    while (true) {
        const pageUrl = `${url}?page=${page}&per_page=100`;
        const response = await fetchWithAuth(pageUrl, accessToken);
        
        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.length === 0) break;
        
        allData = allData.concat(data);
        
        // Check if there's a next page
        const linkHeader = response.headers.get('Link');
        if (!linkHeader || !linkHeader.includes('rel="next"')) {
            break;
        }
        
        page++;
    }
    
    return allData;
}

// Display user profile
function displayUserProfile(user) {
    document.getElementById('user-image').src = user.avatar_url;
    document.getElementById('user-name').textContent = user.login;
    document.getElementById('followers-count').textContent = followerNames.length;
    document.getElementById('following-count').textContent = followingNames.length;
}

// Display statistics
function displayStats() {
    document.getElementById('mutual-count').textContent = followersFollowing.length;
    document.getElementById('not-following-back-count').textContent = followersNotFollowing.length;
    document.getElementById('not-followed-back-count').textContent = followingNotFollowers.length;
    
    // Update tab counts
    document.getElementById('tab-mutual-count').textContent = followersFollowing.length;
    document.getElementById('tab-not-following-count').textContent = followersNotFollowing.length;
    document.getElementById('tab-not-followers-count').textContent = followingNotFollowers.length;
}

// Display user lists
function displayLists() {
    displayUserList('mutual-list', followersFollowing);
    displayUserList('not-following-list', followersNotFollowing);
    displayUserList('not-followers-list', followingNotFollowers);
}

// Display individual user list
function displayUserList(elementId, users) {
    const container = document.getElementById(elementId);
    
    if (users.length === 0) {
        container.innerHTML = '<div class="empty-state">No users found</div>';
        return;
    }
    
    container.innerHTML = users.map(user => `
        <div class="user-item">
            <img src="${user.avatar || `https://github.com/${user.login}.png`}" alt="${user.login}">
            <a href="https://github.com/${user.login}" target="_blank">${user.login}</a>
        </div>
    `).join('');
}

// Sort data
function sortData(order) {
    const sortFn = (a, b) => {
        const comparison = a.login.toLowerCase().localeCompare(b.login.toLowerCase());
        return order === 'asc' ? comparison : -comparison;
    };
    
    followerNames.sort(sortFn);
    followingNames.sort(sortFn);
    followersNotFollowing.sort(sortFn);
    followingNotFollowers.sort(sortFn);
    followersFollowing.sort(sortFn);
    
    displayLists();
}

// Switch tabs
function switchTab(tabName) {
    // Update buttons
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Update panels
    document.querySelectorAll('.tab-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    document.getElementById(`tab-${tabName}-content`).classList.add('active');
}

// Download JSON
function downloadJSON() {
    const data = {
        user: githubUsername,
        timestamp: new Date().toISOString(),
        followers: followerNames,
        following: followingNames,
        mutual: followersFollowing,
        followersNotFollowingBack: followersNotFollowing,
        followingNotFollowers: followingNotFollowers
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${githubUsername}_followers_${new Date().toLocaleDateString().replace(/\//g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

// Save data to storage
function saveData() {
    const data = {
        username: githubUsername,
        followerNames,
        followingNames,
        followersNotFollowing,
        followingNotFollowers,
        followersFollowing,
        timestamp: Date.now()
    };
    
    chrome.storage.local.set({ lastAnalysis: data });
}

// Load saved data (optimized with timeout and error handling)
function loadSavedData() {
    try {
        // Add timeout to prevent hanging
        const timeoutId = setTimeout(() => {
            console.log('Storage load timeout - showing fresh form');
        }, 1000);
        
        chrome.storage.local.get(['lastAnalysis'], function(result) {
            clearTimeout(timeoutId);
            
            if (chrome.runtime.lastError) {
                console.error('Storage error:', chrome.runtime.lastError);
                return;
            }
            
            if (result.lastAnalysis && result.lastAnalysis.username) {
                const data = result.lastAnalysis;
                
                // Check if data is less than 24 hours old
                const hoursSinceAnalysis = (Date.now() - data.timestamp) / (1000 * 60 * 60);
                
                if (hoursSinceAnalysis < 24 && data.followerNames && data.followerNames.length > 0) {
                    githubUsername = data.username;
                    followerNames = data.followerNames || [];
                    followingNames = data.followingNames || [];
                    followersNotFollowing = data.followersNotFollowing || [];
                    followingNotFollowers = data.followingNotFollowers || [];
                    followersFollowing = data.followersFollowing || [];
                    
                    // Create user object for display
                    const user = {
                        login: data.username,
                        avatar_url: `https://github.com/${data.username}.png`
                    };
                    
                    displayUserProfile(user);
                    displayStats();
                    displayLists();
                    showResultsSection();
                }
            }
        });
    } catch (error) {
        console.error('Error loading saved data:', error);
    }
}
