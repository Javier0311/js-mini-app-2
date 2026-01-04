// Toggle Sidebar Menu //
const toggleMenu = document.querySelector('.toggle-menu');
const body = document.body;

toggleMenu.addEventListener('click', () => {
    body.classList.toggle('sidebar-hidden');
});

// Welcome Dashboard and Presets pages navigation //

const hiddenSection = document.querySelector(".display-hidden");
const welcomingSection = document.getElementById("welcoming");
const dashboardingSection = document.getElementById("dashboarding");
const favoritingSection = document.getElementById("favoriting");


