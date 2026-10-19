// --- SAVE/LOAD MODULE: Persistence Layer ---

import { gameState } from './data.js';

/**
 * Saves the entire game state object to localStorage.
 */
function saveGameToLocalStorage() {
    try {
        const data = JSON.stringify(gameState);
        localStorage.setItem('tech_empire_save', data);
        return true;
    } catch (e) {
        console.error("Error saving game:", e);
        return false;
    }
}

/**
 * Loads the gameState from localStorage, replacing the current state.
 */
function loadGameFromLocalStorage() {
    const storedState = localStorage.getItem('tech_empire_save');
    if (!storedState) return null;

    try {
        const loadedData = JSON.parse(storedState);
        // Version Check (Crucial for future updates)
        if (!loadedData.version || loadedData.version !== '1.0') {
            throw new Error("Save file version mismatch or missing.");
        }

        return loadedData;

    } catch (e) {
        console.error("Loading error:", e);
        alert("Failed to load game state. The save file may be corrupted. Try using the import feature.");
        return null;
    }
}

/** 
 * Exports the current game state into a downloadable JSON file. 
 * This is the primary backup method.
 */
function exportGameSave() {
    try {
        // Create a temporary structure including versioning
        const saveObject = {
            version: '1.0', // MUST update this when changing major game mechanics
            timestamp: new Date().toISOString(),
            data: JSON.parse(JSON.stringify(gameState)) 
        };

        const jsonString = JSON.stringify(saveObject, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `TechEmpireTycoon_Export_${formatDate(gameState.date)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

    } catch (e) {
        alert("Error exporting save file.");
    }
}


// --- Shared Utility Function needed by save.js/game.js ---
function formatDisplayDate(date) {
     const options = { month: 'long', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

window.formatDisplayDate = formatDisplayDate; // Expose for use in other files/scripts
