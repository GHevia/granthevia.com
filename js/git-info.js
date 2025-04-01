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

// Function to update the footer with the current time
function updateFooterWithTime() {
    const footer = document.querySelector('footer p');
    if (!footer) return;

    const currentTime = new Date();
    const formattedDate = formatDate(currentTime);
    footer.innerHTML = `&copy; Made by Grant Hevia | Last updated: ${formattedDate}`;
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', updateFooterWithTime); 