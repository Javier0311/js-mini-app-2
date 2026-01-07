// main.js
import { initGlobalEvents } from './events.js';
import { hideAllPages, updateSidebarTags, showEmptyStateIfNeeded } from './render.js';

$(function() {
    console.log("App Initialized with Modular JS & jQuery");

    initGlobalEvents();

    hideAllPages();
    $(".adding-new-recipe").removeClass("display-hidden");
    
    updateSidebarTags();

    showEmptyStateIfNeeded();
});