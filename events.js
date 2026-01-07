// events.js
import { appState } from './data.js';
import { hideAllPages, showEmptyStateIfNeeded, renderFavorites, createNewRecipeForm, updateSidebarTags } from './render.js';

export function initGlobalEvents() {
    
    // Toggle Menu
    $(".toggle-menu").on("click", () => $("body").toggleClass("sidebar-hidden"));

    // Navegación Sidebar
    $("#dashboarding").on("click", () => {
        appState.hasVisitedDashboard = true;
        hideAllPages();
        $("#dashboarding-page").removeClass("display-hidden");
        $(".adding-new-recipe").removeClass("display-hidden");
        showEmptyStateIfNeeded();
    });

    $("#welcoming").on("click", () => {
        appState.hasVisitedDashboard = false;
        hideAllPages();
        $(".adding-new-recipe").removeClass("display-hidden");
        $(".new-recipe").remove();
        showEmptyStateIfNeeded();
    });

    $("#favoriting").on("click", () => {
        hideAllPages();
        $("#favoriting-page").removeClass("display-hidden");
        $(".welcoming-section, .recipes-dashboard").remove();
        renderFavorites();
    });

    $(".new-button").on("click", () => {
        $(".welcoming-section, .recipes-dashboard").remove();
        createNewRecipeForm();
    });

    // Buscador Global
    $(".search-bar input").on("input", function() {
        appState.searchQuery = $(this).val().trim();
        
        // Si estoy buscando, ir al dashboard
        if (appState.searchQuery && $("#favoriting-page").hasClass("display-hidden")) {
            appState.hasVisitedDashboard = true;
            hideAllPages();
            $("#dashboarding-page").removeClass("display-hidden");
            $(".adding-new-recipe").removeClass("display-hidden");
            $(".welcoming-section").remove();
        }

        // Si estoy en favoritos, renderizar favoritos, si no dashboard
        if (!$("#favoriting-page").hasClass("display-hidden")) {
            renderFavorites();
        } else {
            showEmptyStateIfNeeded();
        }
    });
}