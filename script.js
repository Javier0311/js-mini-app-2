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

  //  Storage
  const STORAGE_KEY = "recipes_v1";
  const recipes = loadRecipes();

  let hasVisitedDashboard = false;

  let welcomeSection = null;
  let recipesDashboard = null;

  function loadRecipes() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function saveRecipesToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
  }

  // Navigation 
  function hideAllPages() {
    if (dashboardingPage) dashboardingPage.classList.add("display-hidden");
    if (favoritingPage) favoritingPage.classList.add("display-hidden");
    if (addingRecipeSection) addingRecipeSection.classList.add("display-hidden");
  }

  //Empty states
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

  //Cards render
  function ensureRecipesList() {
    if (!containerRecipes) return null;

    let list = containerRecipes.querySelector(".recipes-list");
    if (!list) {
      list = document.createElement("div");
      list.className = "recipes-list";
      containerRecipes.appendChild(list);
    }
    return list;
  }

  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function renderRecipes(shouldRender = true) {
    const list = ensureRecipesList();
    if (!list) return;

    list.innerHTML = "";
    if (!shouldRender) return;

    recipes.forEach((r) => {
      const card = document.createElement("article");
      card.className = "recipe-card";

      const imgSrc =
        r.imageDataUrl && r.imageDataUrl.trim()
          ? r.imageDataUrl
          : "./images/mainimage.webp";

      card.innerHTML = `
        <div class="recipe-card-img">
          <img src="${imgSrc}" alt="${escapeHtml(r.title || "Recipe")}">
        </div>
        <div class="recipe-card-body">
          <h3 class="recipe-card-title">${escapeHtml(r.title || "")}</h3>
          <p class="recipe-card-desc">${escapeHtml(r.description || "")}</p>
        </div>
      `;

      list.appendChild(card);
    });
  }

  function showEmptyStateIfNeeded() {

    if (hasFormOpen()) {
      removeEmptyStates();
      renderRecipes(false);
      return;
    }

    if (!hasVisitedDashboard) {
      removeRecipesDashboard();
      renderRecipes(false);
      createWelcomeSection();
      return;
    }

    // Dashboard
    removeWelcomeSection();

    if (recipes.length > 0) {
      removeRecipesDashboard();
      renderRecipes(true);
      return;
    }

    renderRecipes(false);
    createRecipesDashboard();
  }

  //  Form 
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
        <input type="text" class="servings" placeholder="Servings (e.g., 4)">
      </div>

      <label class="tags-label">Tags</label>
      <input type="text" class="recipe-tags" placeholder="Add tag...(e.g., Vegan, Dessert)">

      <textarea class="recipe-description" placeholder="Recipe description..."></textarea>

      <div class="recipe-main-container">
        <div class="ingredients-main-container">
          <h3>Ingredients</h3>
          <div class="ingredients-container"></div>
          <button type="button" class="add-ingredient">+ Add Ingredient</button>
        </div>

        <div class="instructions-main-container">
          <h3>Instructions</h3>
          <div class="instructions-container"></div>
          <button type="button" class="add-instruction">+ Add Instruction</button>
        </div>
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

    const instructionsContainer = form.querySelector(".instructions-container");
    const addInstructionBtn = form.querySelector(".add-instruction");

    const saveRecipeBtn = form.querySelector(".save-recipe");
    const cancelRecipeBtn = form.querySelector(".cancel-recipe");

    let imageDataUrl = "";

    imageInput.addEventListener("change", () => {
      const file = imageInput.files && imageInput.files[0];
      if (!file) return;

      imagePreview.src = URL.createObjectURL(file);
      imagePreview.style.display = "block";

      const reader = new FileReader();
      reader.onload = () => {
        imageDataUrl = String(reader.result || "");
      };
      reader.readAsDataURL(file);
    });

    addIngredientBtn.addEventListener("click", (e) => {
      e.preventDefault();

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

    addInstructionBtn.addEventListener("click", (e) => {
      e.preventDefault();

      const instructionRow = document.createElement("div");
      instructionRow.className = "instruction-input";

      instructionRow.innerHTML = `
        <input type="text" class="instruction-text" placeholder="e.g., Preheat the oven to 350°F">
        <button type="button" class="remove-instruction">✕</button>
      `;

      instructionRow.querySelector(".remove-instruction").addEventListener("click", () => {
        instructionRow.remove();
      });

      instructionsContainer.appendChild(instructionRow);
    });

    function resetFormUI() {
      titleInput.value = "";
      descriptionInput.value = "";
      imageInput.value = "";

      ingredientsContainer.innerHTML = "";
      instructionsContainer.innerHTML = "";

      imagePreview.src = "";
      imagePreview.style.display = "none";

      imageDataUrl = "";
    }

    cancelRecipeBtn.addEventListener("click", () => {
      resetFormUI();
      form.remove();
      showEmptyStateIfNeeded();
    });

    saveRecipeBtn.addEventListener("click", () => {
      const title = titleInput.value.trim();
      const description = descriptionInput.value.trim();

      if (!title) {
        alert("Title is required");
        return;
      }

      recipes.unshift({
        id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
        title,
        description,
        imageDataUrl,
        createdAt: Date.now(),
      });

      saveRecipesToStorage();

      resetFormUI();
      form.remove();

      removeEmptyStates();
      showEmptyStateIfNeeded();
    });
  }

  // Sidebar buttons 
  if (dashboardingBtn) {
    dashboardingBtn.addEventListener("click", () => {
      hasVisitedDashboard = true;

      hideAllPages();
      if (dashboardingPage) dashboardingPage.classList.remove("display-hidden");
      if (addingRecipeSection) addingRecipeSection.classList.remove("display-hidden");

      showEmptyStateIfNeeded();
    });
  }

  if (welcomingBtn) {
    welcomingBtn.addEventListener("click", () => {
      hasVisitedDashboard = false; 

      hideAllPages();

      if (dashboardingPage) dashboardingPage.classList.remove("display-hidden");
      if (addingRecipeSection) addingRecipeSection.classList.remove("display-hidden");

      const existingForm = document.querySelector(".new-recipe");
      if (existingForm) existingForm.remove();

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

  if (newRecipeBtn) {
    newRecipeBtn.addEventListener("click", () => {
      removeEmptyStates();
      createNewRecipeForm();
    });
  }

  //Initial view (important) 
  hideAllPages();
  if (addingRecipeSection) addingRecipeSection.classList.remove("display-hidden");

  showEmptyStateIfNeeded();
});
