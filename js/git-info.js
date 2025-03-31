// Function to format the date in a readable way
function formatDate(date) {
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
    };
    
    return date.toLocaleDateString('en-US', options);
}

// Function to get the last commit time
async function getLastCommitTime() {
    try {
        const response = await fetch('/get-git-info.php');
        if (!response.ok) {
            throw new Error('Failed to fetch git info');
        }
        
        const data = await response.json();
        if (!data.success) {
            throw new Error(data.error || 'Failed to get git info');
        }
        
        return new Date(data.timestamp * 1000); // Convert Unix timestamp to Date
    } catch (error) {
        console.error('Error getting git info:', error);
        return null;
    }
}

// Function to update the footer with the last commit time
async function updateFooterWithGitInfo() {
    const footer = document.querySelector('footer p');
    if (!footer) return;

    const lastCommitTime = await getLastCommitTime();
    if (lastCommitTime) {
        const formattedDate = formatDate(lastCommitTime);
        footer.innerHTML = `&copy; Made by Grant Hevia | Last updated: ${formattedDate}`;
    }
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', updateFooterWithGitInfo); 