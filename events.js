import { appState } from './data.js';
import { hideAllPages, showEmptyStateIfNeeded, renderFavorites, createNewRecipeForm, updateSidebarTags } from './render.js';

export function initGlobalEvents() {
    
    $(".toggle-menu").on("click", () => $("body").toggleClass("sidebar-hidden"));

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
    $(".search-bar input").on("input", function() {
        appState.searchQuery = $(this).val().trim();
        
        if (appState.searchQuery && $("#favoriting-page").hasClass("display-hidden")) {
            appState.hasVisitedDashboard = true;
            hideAllPages();
            $("#dashboarding-page").removeClass("display-hidden");
            $(".adding-new-recipe").removeClass("display-hidden");
            $(".welcoming-section").remove();
        }


        if (!$("#favoriting-page").hasClass("display-hidden")) {
            renderFavorites();
        } else {
            showEmptyStateIfNeeded();
        }
    });
}