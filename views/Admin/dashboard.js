// --- THE "UNBREAKABLE" SIDEBAR ENGINE ---
function showPage(pageId) {
    console.log("Switching to page: " + pageId); // This helps you see if it's working in F12 console

    // 1. Find all sections with the class 'page-section'
    const sections = document.querySelectorAll('.page-section');
    
    // 2. Hide every single one of them
    sections.forEach(section => {
        section.style.display = 'none';
    });

    // 3. Find the one page the user clicked
    const activePage = document.getElementById(pageId);
    
    // 4. Force it to show
    if (activePage) {
        activePage.style.display = 'block';
    } else {
        console.error("Error: Could not find a page with ID: " + pageId);
    }

    // 5. Refresh the data inside the tables
    if (typeof loadData === "function") {
        loadData();
    }
}

// Ensure the first page (prayers) is visible when the page loads
window.onload = function() {
    showPage('prayers');
};