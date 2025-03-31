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
        const response = await fetch('/.git/HEAD');
        if (!response.ok) {
            throw new Error('Git info not available');
        }
        
        const head = await response.text();
        const ref = head.trim().split(' ')[1];
        
        const refResponse = await fetch(`/.git/${ref}`);
        if (!refResponse.ok) {
            throw new Error('Git ref not available');
        }
        
        const commitHash = await refResponse.text();
        const commitResponse = await fetch(`/.git/objects/${commitHash.substring(0, 2)}/${commitHash.substring(2)}`);
        
        if (!commitResponse.ok) {
            throw new Error('Commit object not available');
        }
        
        const commitData = await commitResponse.text();
        const timestamp = parseInt(commitData.split(' ')[2]);
        return new Date(timestamp * 1000); // Convert Unix timestamp to Date
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