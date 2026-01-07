// render.js
import { recipes, recipesById, appState, getUniqueTags, getFilteredRecipes, saveRecipesToStorage, addRecipe, updateRecipeInStore, deleteRecipeFromStore, toggleFavoriteStatus } from './data.js';

function escapeHtml(str) {
    return String(str)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function ensureRecipesList($container, className = "recipes-list") {
    let $list = $container.find(`.${className}`);
    if ($list.length === 0) {
        $list = $(`<div class="${className}"></div>`);
        $container.append($list);
    }
    return $list;
}
export function hideAllPages() {
    $("#dashboarding-page").addClass("display-hidden");
    $("#favoriting-page").addClass("display-hidden");
    $(".adding-new-recipe").addClass("display-hidden");
}

export function showEmptyStateIfNeeded(isFavoritesView = false) {
    if (isFavoritesView && $("#favoriting-page").hasClass("display-hidden")) return;
    
    if ($(".new-recipe").length > 0) {
        $(".welcoming-section, .recipes-dashboard").remove();
        renderRecipes(false); 
        return;
    }

    if (!appState.hasVisitedDashboard && !isFavoritesView) {
        $(".recipes-dashboard").remove();
        renderRecipes(false);
        createWelcomeSection();
        return;
    }

    $(".welcoming-section").remove();

    if (recipes.length > 0 || appState.searchQuery) {
        $(".recipes-dashboard").remove();
        renderRecipes(true); 
        return;
    }

    renderRecipes(false);
    if(!isFavoritesView) createRecipesDashboard();
}

export function createWelcomeSection() {
    if ($(".welcoming-section").length > 0) return;
    const html = `
      <section class="welcoming-section">
        <div class="img-main"><img src="./images/mainimage.webp" alt="Food"></div>
        <h1>Welcome to your new kitchen companion.</h1>
        <p>What are we cooking today? Select a recipe from the dashboard.</p>
      </section>`;
    $(html).hide().prependTo(".container-recipes").fadeIn(300);
}

export function createRecipesDashboard() {
    if ($(".recipes-dashboard").length > 0) return;
    const html = `
      <section class="recipes-dashboard">
        <div class="img-main"><img src="./images/mainimage.webp" alt="Food"></div>
        <h1>You don’t have any recipes yet. Add one now!</h1>
        <p>Click the “New Recipe” button to add your first recipe.</p>
      </section>`;
    $(html).hide().prependTo(".container-recipes").fadeIn(300);
}

export function updateSidebarTags() {
    const tags = getUniqueTags();
    const $list = $("#filter-tags-list");
    $list.empty();

    if (tags.length === 0) {
        $list.html('<li style="font-size:12px; color:#555; padding-left:5px;">No tags yet...</li>');
        return;
    }

    $.each(tags, function(i, tag) {
        const $li = $(`<li class="filter-tag-item">${escapeHtml(tag)}</li>`);
        $li.on("click", () => {
            $(".search-bar input").val(tag).trigger("input");
        });
        $list.append($li);
    });
}

function renderGrid(data, $container, isFavoritesView = false) {
    $container.empty();

    if (data.length === 0) {
        let msg = '<div class="no-favorites-msg">';
        if (isFavoritesView && !appState.searchQuery) {
            msg += "<h3>No favorites yet!</h3><p>Click the heart icon on any recipe.</p>";
        } else if (appState.searchQuery) {
            msg += `<h3>No recipes found for "${escapeHtml(appState.searchQuery)}"</h3>`;
        }
        msg += '</div>';
        $container.append(msg);
        return;
    }

    $.each(data, function(i, r) {
        const imgSrc = r.imageDataUrl || "./images/mainimage.webp";
        const heartClass = r.isFavorite ? "fav-btn active" : "fav-btn";
        const heartIcon = r.isFavorite ? "♥" : "♡";

        const $card = $(`
            <article class="recipe-card">
              <div class="recipe-card-img" style="position: relative;">
                <img src="${imgSrc}" alt="${escapeHtml(r.title)}">
                <button class="${heartClass}">${heartIcon}</button>
              </div>
              <div class="recipe-card-body">
                <h3 class="recipe-card-title">${escapeHtml(r.title)}</h3>
                <p class="recipe-card-desc">${escapeHtml(r.description)}</p>
              </div>
            </article>
        `);

        $card.on("click", () => openRecipeDetails(r));
        $card.find(".fav-btn").on("click", (e) => {
            e.stopPropagation();
            toggleFavoriteStatus(r.id);
            if(isFavoritesView) renderFavorites(); 
            else renderRecipes(true);
        });

        $container.append($card);
    });
}

export function renderRecipes(shouldRender = true) {
    const $list = ensureRecipesList($(".container-recipes"), "recipes-list");
    if (!$list.length) return;
    $list.css("display", "grid").empty();
    
    if (!shouldRender) return;
    renderGrid(getFilteredRecipes(), $list, false);
}

export function renderFavorites() {
    const $list = ensureRecipesList($("#favoriting-page"), "favorites-list");
    if (!$list.length) return;
    $list.css("display", "grid");

    let data = getFilteredRecipes().filter(r => r.isFavorite);
    renderGrid(data, $list, true);
}

export function openRecipeDetails(recipe) {
    $(".welcoming-section, .recipes-dashboard").remove();
    
    const isFavoritesView = !$("#favoriting-page").hasClass("display-hidden");
    const $targetContainer = isFavoritesView ? $("#favoriting-page") : $(".container-recipes");
    const $listToHide = isFavoritesView ? $targetContainer.find(".favorites-list") : $targetContainer.find(".recipes-list");
    
    $listToHide.hide();
    $(".recipe-detail-view").remove();

    const imgSrc = recipe.imageDataUrl || "./images/mainimage.webp";
    const heartText = recipe.isFavorite ? "♥ Unfavorite" : "♡ Favorite";
    const heartClass = recipe.isFavorite ? "fav-action-btn active" : "fav-action-btn";
    
    // Generar listas
    const ingredientsHTML = (recipe.ingredients || []).map(ing => `<li><strong>${escapeHtml(ing.amount)}</strong> ${escapeHtml(ing.name)}</li>`).join("");
    const instructionsHTML = (recipe.instructions || []).map(step => `<div class="step-item"><p>${escapeHtml(step)}</p></div>`).join("");
    let tagsHTML = (recipe.tags) ? recipe.tags.split(',').map(tag => `<span class="tag-pill">🏷 ${escapeHtml(tag.trim())}</span>`).join("") : "";

    const html = `
      <div class="recipe-detail-view">
        <div class="detail-top-bar">
          <button class="back-btn">← Back</button>
          <div style="display:flex; gap:10px;">
              <button class="edit-btn">✏️ Edit</button>
              <button class="delete-btn">🗑 Delete</button>
          </div>
        </div>
        <div class="detail-header">
          <img src="${imgSrc}" alt="${escapeHtml(recipe.title)}">
          <div class="detail-title-block">
              <div style="display:flex; justify-content:space-between;">
                  <h1>${escapeHtml(recipe.title)}</h1>
                  <button class="${heartClass}">${heartText}</button>
              </div>
              <div class="detail-meta-info">${tagsHTML}</div>
              <p>${escapeHtml(recipe.description)}</p>
          </div>
        </div>
        <div class="detail-content">
            <div class="detail-ingredients"><h3>Ingredients</h3><ul>${ingredientsHTML}</ul></div>
            <div class="detail-instructions"><h3>Instructions</h3>${instructionsHTML}</div>
        </div>
      </div>
    `;

    const $detail = $(html).hide();
    $targetContainer.append($detail);
    $detail.fadeIn(200);

    $detail.find(".back-btn").on("click", () => {
        $detail.remove();
        $listToHide.css("display", "grid");
        if(!isFavoritesView) showEmptyStateIfNeeded();
    });

    $detail.find(".fav-action-btn").on("click", function() {
        toggleFavoriteStatus(recipe.id);
        const isFav = recipe.isFavorite;
        $(this).text(isFav ? "♥ Unfavorite" : "♡ Favorite").toggleClass("active", isFav);

        $(this).css({ "color": isFav ? "#e91e63" : "inherit", "border-color": isFav ? "#e91e63" : "#ccc" });
    });

    $detail.find(".delete-btn").on("click", () => {
        if(confirm("Delete recipe?")) {
            deleteRecipeFromStore(recipe.id);
            updateSidebarTags();
            $detail.remove();
            if(isFavoritesView) renderFavorites();
            else { renderRecipes(true); showEmptyStateIfNeeded(); }
        }
    });

    $detail.find(".edit-btn").on("click", () => {
        $detail.remove();
        createNewRecipeForm(recipe);
    });
}

export function createNewRecipeForm(recipeToEdit = null) {
    if (!$("#favoriting-page").hasClass("display-hidden")) {
        hideAllPages();
        $("#dashboarding-page").removeClass("display-hidden");
        $(".adding-new-recipe").removeClass("display-hidden");
    }

    $(".new-recipe").remove();
    const formTitle = recipeToEdit ? "Edit Recipe" : "New Recipe";
    const existingTags = getUniqueTags();
    const datalistOptions = existingTags.map(tag => `<option value="${tag}">`).join("");

    const html = `
      <div class="new-recipe">
        <h2>${formTitle}</h2>
        <label class="image-upload"><input type="file" accept="image/*" class="recipe-image"><span>Upload Image</span><img class="image-preview" alt=""></label>
        <input type="text" class="recipe-title" placeholder="Recipe title">
        <div class="prep-time-container"><input type="text" class="prep-time" placeholder="Prep Time"><input type="text" class="servings" placeholder="Servings"></div>
        <label class="tags-label">Tags</label>
        <div class="tag-input-group"><input type="text" class="tag-entry-input" list="tag-suggestions" placeholder="Add tag"><button type="button" class="add-tag-btn">+ Add</button></div>
        <datalist id="tag-suggestions">${datalistOptions}</datalist>
        <div class="tags-container"></div>
        <textarea class="recipe-description" placeholder="Description..."></textarea>
        <div class="recipe-main-container">
          <div class="ingredients-main-container"><h3>Ingredients</h3><div class="ingredients-container"></div><button type="button" class="add-ingredient">+ Add</button></div>
          <div class="instructions-main-container"><h3>Instructions</h3><div class="instructions-container"></div><button type="button" class="add-instruction">+ Add</button></div>
        </div>
        <div class="recipe-actions"><button type="button" class="save-recipe">Save</button><button type="button" class="cancel-recipe">Cancel</button></div>
      </div>
    `;

    const $form = $(html).hide().prependTo(".container-recipes").fadeIn(300);

    // Helpers del form
    const $tagsContainer = $form.find(".tags-container");
    const $ingContainer = $form.find(".ingredients-container");
    const $instContainer = $form.find(".instructions-container");
    const $imgPreview = $form.find(".image-preview");
    let imageDataUrl = recipeToEdit ? (recipeToEdit.imageDataUrl || "") : "";

    const addTag = (txt) => {
        if(!txt.trim()) return;
        const exists = $tagsContainer.find(".tag-text").filter((i, el) => $(el).text().toLowerCase() === txt.trim().toLowerCase()).length > 0;
        if(exists) { alert("Tag exists!"); return; }
        const $chip = $(`<div class="tag-chip"><span class="tag-text">${escapeHtml(txt.trim())}</span><button type="button" class="remove-tag">×</button></div>`);
        $chip.find(".remove-tag").on("click", () => $chip.remove());
        $tagsContainer.append($chip);
    };

    const addIng = (amt="", name="") => {
        const $row = $(`<div class="ingredient-input"><div class="ingredient-container"><input type="text" class="ingredient-amount" value="${escapeHtml(amt)}" placeholder="Qty"><input type="text" class="ingredient-name" value="${escapeHtml(name)}" placeholder="Item"><button type="button" class="remove-ingredient">✕</button></div></div>`);
        $row.find(".remove-ingredient").on("click", () => $row.remove());
        $ingContainer.append($row);
    };

    const addInst = (txt="") => {
        const $row = $(`<div class="instruction-input"><input type="text" class="instruction-text" value="${escapeHtml(txt)}" placeholder="Step..."><button type="button" class="remove-instruction">✕</button></div>`);
        $row.find(".remove-instruction").on("click", () => $row.remove());
        $instContainer.append($row);
    };
    if(recipeToEdit) {
        $form.find(".recipe-title").val(recipeToEdit.title);
        $form.find(".recipe-description").val(recipeToEdit.description);
        $form.find(".prep-time").val(recipeToEdit.prepTime);
        $form.find(".servings").val(recipeToEdit.servings);
        if(recipeToEdit.tags) recipeToEdit.tags.split(',').forEach(addTag);
        if(imageDataUrl) $imgPreview.attr("src", imageDataUrl).show();
        if(recipeToEdit.ingredients) recipeToEdit.ingredients.forEach(i => addIng(i.amount, i.name));
        if(recipeToEdit.instructions) recipeToEdit.instructions.forEach(i => addInst(i));
    }
    $form.find(".add-tag-btn").on("click", (e) => { e.preventDefault(); addTag($form.find(".tag-entry-input").val()); $form.find(".tag-entry-input").val("").focus(); });
    $form.find(".tag-entry-input").on("keydown", (e) => { if(e.key==="Enter"){ e.preventDefault(); addTag($(e.target).val()); $(e.target).val(""); } });
    $form.find(".add-ingredient").on("click", (e) => { e.preventDefault(); addIng(); });
    $form.find(".add-instruction").on("click", (e) => { e.preventDefault(); addInst(); });
    $form.find(".cancel-recipe").on("click", () => { $form.remove(); showEmptyStateIfNeeded(); });
    $form.find(".recipe-image").on("change", function() {
        const file = this.files[0]; if(!file) return;
        $imgPreview.attr("src", URL.createObjectURL(file)).show();
        const reader = new FileReader(); reader.onload=()=>{imageDataUrl=String(reader.result||"");}; reader.readAsDataURL(file);
    });

    // Guardar
    $form.find(".save-recipe").on("click", () => {
        const title = $form.find(".recipe-title").val().trim();
        if(!title) { alert("Title is required"); return; }

        try {
            const tags = []; $tagsContainer.find(".tag-text").each((i, el) => tags.push($(el).text()));
            const ingredients = []; $ingContainer.find(".ingredient-input").each((i, el) => {
                const amount = $(el).find(".ingredient-amount").val().trim();
                const name = $(el).find(".ingredient-name").val().trim();
                if(amount||name) ingredients.push({amount, name});
            });
            const instructions = []; $instContainer.find(".instruction-text").each((i, el) => { if($(el).val().trim()) instructions.push($(el).val().trim()); });

            const newRecipe = {
                title,
                description: $form.find(".recipe-description").val().trim(),
                prepTime: $form.find(".prep-time").val().trim(),
                servings: $form.find(".servings").val().trim(),
                tags: tags.join(", "),
                ingredients,
                instructions,
                imageDataUrl,
                createdAt: recipeToEdit ? recipeToEdit.createdAt : Date.now(),
                id: recipeToEdit ? recipeToEdit.id : crypto.randomUUID(),
                isFavorite: recipeToEdit ? (recipeToEdit.isFavorite || false) : false
            };

            if(recipeToEdit) updateRecipeInStore(newRecipe);
            else addRecipe(newRecipe);

            updateSidebarTags();
        } catch(e) { console.error(e); } finally {
            $form.remove();
            showEmptyStateIfNeeded();
        }
    });
}