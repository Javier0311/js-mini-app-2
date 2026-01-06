/* =========================
   Sidebar Toggle
========================= */
const toggleMenu = document.querySelector('.toggle-menu');
const body = document.body;

toggleMenu.addEventListener('click', () => {
    body.classList.toggle('sidebar-hidden');
});

/* =========================
   Navigation Sections
========================= */
const welcomingBtn = document.getElementById("welcoming");
const dashboardingBtn = document.getElementById("dashboarding");
const favoritingBtn = document.getElementById("favoriting");

const welcomingPage = document.getElementById("welcoming-page");
const dashboardingPage = document.getElementById("dashboarding-page");
const favoritingPage = document.getElementById("favoriting-page");

function hideAllPages(){
    welcomingPage.classList.add("display-hidden");
    dashboardingPage.classList.add("display-hidden");
    favoritingPage.classList.add("display-hidden");
}

dashboardingBtn.addEventListener("click", () => {
    hideAllPages();
    dashboardingPage.classList.remove("display-hidden");
});

favoritingBtn.addEventListener("click", () => {
    hideAllPages();
    favoritingPage.classList.remove("display-hidden");
});

welcomingBtn.addEventListener("click", () => {
    hideAllPages();
    welcomingPage.classList.remove("display-hidden");
});

/* =========================
   New Recipe Elements
========================= */
const newRecipeBtn = document.querySelector(".new-button");
const newRecipeForm = document.getElementById("new-recipe-form");
const cancelRecipeBtn = document.querySelector(".cancel-recipe");
const saveRecipeBtn = document.querySelector(".save-recipe");

const imageInput = document.getElementById("recipe-image");
const imagePreview = document.getElementById("image-preview");

const titleInput = document.getElementById("recipe-title");
const descriptionInput = document.getElementById("recipe-description");

const addStepBtn = document.querySelector(".add-step");
const stepsContainer = document.getElementById("steps-container");

/* =========================
   Open / Close New Recipe
========================= */
newRecipeBtn.addEventListener("click", () => {
    newRecipeForm.classList.remove("display-hidden");
});

cancelRecipeBtn.addEventListener("click", () => {
    resetRecipeForm();
    newRecipeForm.classList.add("display-hidden");
});

/* =========================
   Image Preview
========================= */
imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];
    if (!file) return;

    imagePreview.src = URL.createObjectURL(file);
    imagePreview.style.display = "block";
});

/* =========================
   Steps Logic
========================= */
addStepBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const stepDiv = document.createElement("div");
    stepDiv.classList.add("step-input");

    stepDiv.innerHTML = `
        <input type="text" placeholder="Step description">
        <button class="remove-step">✕</button>
    `;

    stepDiv.querySelector(".remove-step").addEventListener("click", () => {
        stepDiv.remove();
    });

    stepsContainer.appendChild(stepDiv);
});

/* =========================
   Save Recipe (Base)
========================= */
saveRecipeBtn.addEventListener("click", () => {
    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();
    const steps = [...stepsContainer.querySelectorAll("input")]
        .map(input => input.value.trim())
        .filter(step => step !== "");

    if (!title || !description || steps.length === 0) {
        alert("Please complete all fields");
        return;
    }

    const recipe = {
        title,
        description,
        steps
    };

    console.log("Recipe saved:", recipe);

    resetRecipeForm();
    newRecipeForm.classList.add("display-hidden");
});

/* =========================
   Reset Form
========================= */
function resetRecipeForm(){
    titleInput.value = "";
    descriptionInput.value = "";
    imageInput.value = "";
    stepsContainer.innerHTML = "";
    imagePreview.src = "";
    imagePreview.style.display = "none";
}
