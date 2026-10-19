// --- PRODUCT MODULE: Component & Product Logic ---

import { COMPONENTS, TECHNOLOGIES } from './data.js';

/**
 * Calculates the full set of specifications, cost, quality, and performance 
 * based on chosen components. (Simplified simulation)
 * @param {object} specs - Key-value pair of component IDs selected by the player.
 * @returns {object} The calculated product statistics.
 */
function calculateProductStats(specs) {
    let totalCost = 0;
    let qualityScore = 10;
    let performanceIndex = 10;
    let powerEfficiency = 1.0;

    const componentTypes = ['cpu', 'screen', 'camera', 'battery', 'storage']; // Mapping to required components

    // Simplified mapping: We assume the input `specs` object uses keys matching our structure.
    for (const type of componentTypes) {
        const selectedId = specs[type]; 
        if (!selectedId) continue;

        let compData = null;
        if (type === 'cpu') compData = COMPONENTS.processors.find(c => c.id === selectedId);
        else if (type === 'screen') compData = COMPONENTS.screens.find(c => c.id === selectedId);
        else if (type === 'camera') compData = COMPONENTS.cameras.find(c => c.id === selectedId);
        else if (type === 'battery') compData = COMPONENTS.batteries.find(c => c.id === selectedId);
        else if (type === 'storage') compData = COMPONENTS.storage.find(c => c.id === selectedId);

        if (compData) {
            totalCost += compData.cost;
            // Quality calculation: Average of component quality and a slight bonus for advanced tech
            qualityScore += Math.floor((compData.quality || 1) * (0.5 + (TECHNOLOGIES[compData.required_tech]?.unlocked ? 0.3 : 0)));
            
            // Performance calculation: Weighted average
            if (type === 'cpu') performanceIndex += compData.performance;
            if (type === 'storage') performanceIndex += compData.speed / 10;

            // Power efficiency check
            powerEfficiency *= (compData.efficiency / 100);
        }
    }

    // Finalize scores and ensure they are capped/rounded
    const finalQuality = Math.min(99, qualityScore + Math.floor(Math.random() * 5)); // Add random variance
    const finalPerformance = Math.max(10, performanceIndex);


    return {
        total_cost: totalCost,
        quality_score: finalQuality,
        performance_index: finalPerformance,
        power_efficiency: powerEfficiency,
        components_used: specs
    };
}

/** 
 * Helper function to simulate loading the component data into the product designer state.
 * (This would be called by JavaScript logic in game.js)
 */
function getComponentDataForDesigner(type) {
     // This mock returns an empty object structure for UI display purposes.
    return {};
}

window.calculateProductStats = calculateProductStats;
