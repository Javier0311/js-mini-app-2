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

const welcomingPage = document.getElementById("welcoming-page");
const dashboardingPage = document.getElementById("dashboarding-page");
const favoritingPage = document.getElementById("favoriting-page");

dashboardingSection.addEventListener('click', () => {
    welcomingPage.classList.add("display-hidden");
    welcomingPage.classList.remove("welcoming-section")
    favoritingPage.classList.add("display-hidden");
    favoritingPage.classList.remove("favorites-section");
    dashboardingPage.classList.add("dashboard-section");
    dashboardingPage.classList.remove("display-hidden");
})

favoritingSection.addEventListener('click', () => {
    welcomingPage.classList.add("display-hidden");
    welcomingPage.classList.remove("welcoming-section")
    dashboardingPage.classList.remove("dashboard-section");
    dashboardingPage.classList.add("display-hidden");
    favoritingPage.classList.remove("display-hidden");
    favoritingPage.classList.add("favorites-section");
})

welcoming.addEventListener('click', () => {
    dashboardingPage.classList.remove("dashboard-section");
    dashboardingPage.classList.add("display-hidden");
    favoritingPage.classList.add("display-hidden");
    favoritingPage.classList.remove("favorites-section");
    welcomingPage.classList.remove("display-hidden");
    welcomingPage.classList.add("welcoming-section")
})

// Tags using Sets

let tags = new Set(["Spicy", "Dessert", "Quick", "Breakfast"]);

const listContainer = document.getElementById('list-container');


function showtags() {
    listContainer.innerHTML = '';

    tags.forEach(tag => {
        const itemHTML = `
        <li class="ingrediente-item">
            ${tag} 
        </li>
        `;

        listContainer.innerHTML += itemHTML;
    });
}

showtags();

const testTag = document.getElementById("test-tag");
const newTag = document.getElementById("newTag")

testTag.addEventListener('click', () => {
    const getText = newTag.value;

    if (getText !== ''){
        tags.add(getText);

        showtags();
    } else{
        alert('Fill the field')
    }

    if (tags.has(getText)){
        alert("This tag already exist");
    }
    
});
