// data.js
const STORAGE_KEY = "recipes_v1";

export const recipes = loadRecipes();
export const recipesById = new Map();

export let appState = {
    searchQuery: "",
    hasVisitedDashboard: false
};

recipes.forEach(r => recipesById.set(r.id, r));

function loadRecipes() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

export function saveRecipesToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
}

export function addRecipe(newRecipe) {
    recipes.unshift(newRecipe);
    recipesById.set(newRecipe.id, newRecipe);
    saveRecipesToStorage();
}

export function updateRecipeInStore(updatedRecipe) {
    const index = recipes.findIndex(r => r.id === updatedRecipe.id);
    if (index !== -1) {
        recipes[index] = updatedRecipe;
        recipesById.set(updatedRecipe.id, updatedRecipe);
        saveRecipesToStorage();
    }
}

export function deleteRecipeFromStore(id) {
    const index = recipes.findIndex(r => r.id === id);
    if (index !== -1) {
        recipes.splice(index, 1);
        recipesById.delete(id);
        saveRecipesToStorage();
    }
}

export function toggleFavoriteStatus(id) {
    const recipe = recipesById.get(id);
    if (recipe) {
        recipe.isFavorite = !recipe.isFavorite;
        saveRecipesToStorage();
    }
}

export function getUniqueTags() {
    const uniqueTags = new Set();
    recipes.forEach(recipe => {
        if (recipe.tags) {
            recipe.tags.split(',').forEach(t => {
                const clean = t.trim();
                if (clean) uniqueTags.add(clean);
            });
        }
    });
    return Array.from(uniqueTags).sort();
}

export function getFilteredRecipes() {
    let filtered = recipes;
    if (appState.searchQuery) {
        const lowerQ = appState.searchQuery.toLowerCase();
        filtered = recipes.filter(r => {
            const inTitle = r.title && r.title.toLowerCase().includes(lowerQ);
            const inTags = r.tags && r.tags.toLowerCase().includes(lowerQ);
            return inTitle || inTags;
        });
    }
    return filtered;
}