document.addEventListener("DOMContentLoaded", () => {
    const toggleMenu = document.querySelector(".toggle-menu");
    const body = document.body;

    if (toggleMenu) {
        toggleMenu.addEventListener("click", () => {
            body.classList.toggle("sidebar-hidden");
        });
    }

    const welcomingBtn = document.getElementById("welcoming");
    const dashboardingBtn = document.getElementById("dashboarding");
    const favoritingBtn = document.getElementById("favoriting");

    const dashboardingPage = document.getElementById("dashboarding-page");
    const favoritingPage = document.getElementById("favoriting-page");
    const addingRecipeSection = document.querySelector(".adding-new-recipe");
    const containerRecipes = document.querySelector(".container-recipes");

    const newRecipeBtn = document.querySelector(".new-button");

    const recipes = [];
    let hasVisitedDashboard = false;

    let welcomeSection = null;
    let recipesDashboard = null;

    function hideAllPages() {
        if (dashboardingPage) dashboardingPage.classList.add("display-hidden");
        if (favoritingPage) favoritingPage.classList.add("display-hidden");
        if (addingRecipeSection) addingRecipeSection.classList.add("display-hidden");
    }

    function createWelcomeSection() {
        if (welcomeSection || !containerRecipes) return;

        welcomeSection = document.createElement("section");
        welcomeSection.className = "welcoming-section";
        welcomeSection.innerHTML = `
            <div class="img-main">
                <img src="./images/mainimage.webp" alt="Delicious food on a table">
            </div>
            <h1>Welcome to your new kitchen companion.</h1>
            <p>
                What are we cooking today? Select a recipe from the dashboard
                or start writing your next culinary masterpiece.
            </p>
        `;

        containerRecipes.prepend(welcomeSection);
    }

    function removeWelcomeSection() {
        if (!welcomeSection) return;
        welcomeSection.remove();
        welcomeSection = null;
    }

    function createRecipesDashboard() {
        if (recipesDashboard || !containerRecipes) return;

        recipesDashboard = document.createElement("section");
        recipesDashboard.className = "recipes-dashboard";
        recipesDashboard.innerHTML = `
            <div class="img-main">
                <img src="./images/mainimage.webp" alt="Delicious food on a table">
            </div>
            <h1>You don’t have any recipes yet. Add one now!</h1>
            <p>Click the “New Recipe” button to add your first recipe.</p>
        `;

        containerRecipes.prepend(recipesDashboard);
    }

    function removeRecipesDashboard() {
        if (!recipesDashboard) return;
        recipesDashboard.remove();
        recipesDashboard = null;
    }

    function removeEmptyStates() {
        removeWelcomeSection();
        removeRecipesDashboard();
    }

    function hasFormOpen() {
        return !!document.querySelector(".new-recipe");
    }

    function showEmptyStateIfNeeded() {
        if (recipes.length !== 0) {
            removeEmptyStates();
            return;
        }

        if (hasFormOpen()) {
            removeEmptyStates();
            return;
        }

        removeEmptyStates();

        if (hasVisitedDashboard) {
            createRecipesDashboard();
        } else {
            createWelcomeSection();
        }
    }

    function createNewRecipeForm() {
        if (!containerRecipes) return;

        const existingForm = document.querySelector(".new-recipe");
        if (existingForm) existingForm.remove();

        const form = document.createElement("div");
        form.className = "new-recipe";
        form.innerHTML = `
            <h2>New Recipe</h2>

            <label class="image-upload">
                <input type="file" accept="image/*" class="recipe-image">
                <span>Upload Image</span>
                <img class="image-preview" alt="">
            </label>

            <input type="text" class="recipe-title" placeholder="Recipe title">

            <div class="prep-time-container">
                <input type="text" class="prep-time" placeholder="Prep Time (e.g., 15 mins)">
                <input type="text" class="prep-time" placeholder="Servings (e.g., 4)">
            </div>

            <label class="tags-label">Tags</label>
            <input type="text" class="recipe-tags" placeholder="Add tag...(e.g., Vegan, Dessert)">

            <textarea class="recipe-description" placeholder="Recipe description..."></textarea>

            <div class="ingredients-main-container">
                <h3>Ingredients</h3>
                <div class="ingredients-container"></div>
                <button type="button" class="add-ingredient">+ Add Ingredient</button>
            </div>

            <div class="recipe-actions">
                <button type="button" class="save-recipe">Save Recipe</button>
                <button type="button" class="cancel-recipe">Cancel</button>
            </div>
        `;

        containerRecipes.prepend(form);

        const imageInput = form.querySelector(".recipe-image");
        const imagePreview = form.querySelector(".image-preview");
        const titleInput = form.querySelector(".recipe-title");
        const descriptionInput = form.querySelector(".recipe-description");

        const ingredientsContainer = form.querySelector(".ingredients-container");
        const addIngredientBtn = form.querySelector(".add-ingredient");

        const saveRecipeBtn = form.querySelector(".save-recipe");
        const cancelRecipeBtn = form.querySelector(".cancel-recipe");

        imageInput.addEventListener("change", () => {
            const file = imageInput.files && imageInput.files[0];
            if (!file) return;

            imagePreview.src = URL.createObjectURL(file);
            imagePreview.style.display = "block";
        });

        addIngredientBtn.addEventListener("click", () => {
            const ingredientRow = document.createElement("div");
            ingredientRow.className = "ingredient-input";

            ingredientRow.innerHTML = `
                <div class="ingredient-container">
                    <input type="text" class="ingredient-amount" placeholder="e.g., 1 cup">
                    <input type="text" class="ingredient-name" placeholder="Ingredient">
                    <button type="button" class="remove-ingredient">✕</button>
                </div>
            `;

            ingredientRow.querySelector(".remove-ingredient").addEventListener("click", () => {
                ingredientRow.remove();
            });

            ingredientsContainer.appendChild(ingredientRow);
        });

        function resetFormUI() {
            titleInput.value = "";
            descriptionInput.value = "";
            imageInput.value = "";
            ingredientsContainer.innerHTML = "";
            imagePreview.src = "";
            imagePreview.style.display = "none";
        }

        cancelRecipeBtn.addEventListener("click", () => {
            resetFormUI();
            form.remove();
            showEmptyStateIfNeeded();
        });

        saveRecipeBtn.addEventListener("click", () => {
            if (!titleInput.value.trim()) {
                alert("Title is required");
                return;
            }

            recipes.push({
                title: titleInput.value.trim(),
                description: descriptionInput.value.trim()
            });

            resetFormUI();
            form.remove();
            removeEmptyStates();
        });
    }

    if (dashboardingBtn) {
        dashboardingBtn.addEventListener("click", () => {
            hasVisitedDashboard = true;

            hideAllPages();
            if (dashboardingPage) dashboardingPage.classList.remove("display-hidden");
            if (addingRecipeSection) addingRecipeSection.classList.remove("display-hidden");

            showEmptyStateIfNeeded();
        });
    }

    if (favoritingBtn) {
        favoritingBtn.addEventListener("click", () => {
            hideAllPages();
            if (favoritingPage) favoritingPage.classList.remove("display-hidden");
            removeEmptyStates();
        });
    }

    if (welcomingBtn) {
        welcomingBtn.addEventListener("click", () => {
            hasVisitedDashboard = true;

            hideAllPages();
            if (dashboardingPage) dashboardingPage.classList.remove("display-hidden");
            if (addingRecipeSection) addingRecipeSection.classList.remove("display-hidden");

            showEmptyStateIfNeeded();
        });
    }

    if (newRecipeBtn) {
        newRecipeBtn.addEventListener("click", () => {
            removeEmptyStates();
            createNewRecipeForm();
        });
    }

    showEmptyStateIfNeeded();
});
