document.addEventListener('DOMContentLoaded', function() {
    const menuItems = document.querySelectorAll('.sidebar-menu .menu-item');
    const viewSections = document.querySelectorAll('.view-section');
    const viewTitle = document.getElementById('current-view-title');

    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            const targetView = this.getAttribute('data-target');
            
            // Remove active classes
            menuItems.forEach(mi => mi.classList.remove('active'));
            viewSections.forEach(vs => vs.classList.remove('active'));
            
            // Add active class to clicked menu
            this.classList.add('active');
            
            // Activate target view section
            const activeSection = document.getElementById(targetView);
            if(activeSection) {
                activeSection.classList.add('active');
            }
            
            // Dynamically update Topbar Header text matching the mock view names
            if(this.querySelector('span')) {
                viewTitle.textContent = this.querySelector('span').textContent;
            }
        });
    });
});

// Helper functions for programmatic navigation inside cards
function switchView(viewId) {
    const targetMenu = document.querySelector(`[data-target="${viewId}"]`);
    if(targetMenu) {
        targetMenu.click();
    }
}
