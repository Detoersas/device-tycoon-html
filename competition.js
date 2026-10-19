// --- COMPETITION MODULE: AI Opponent Logic ---

import { gameState, INITIAL_COMPETITORS } from './data.js';

/** Initializes or updates competitor data in the global state. */
function initializeCompetitors() {
    gameState.competitors = INITIAL_COMPETITORS.map(compData => ({ ...compData }));
}


/** 
 * The main function called by simulation.js to run all AI decisions for a turn.
 */
function runCompetitionStep() {
    console.log("--- Running Competitor AI Decisions ---");

    gameState.competitors.forEach((comp, index) => {
        // Use the current global market state to inform the AI's actions
        const trend = gameState.marketTrends[comp.focus]; 

        // 1. Economic Viability Check: Can they afford anything?
        if (Math.random() < 0.1 && comp.cash < 5000) {
            console.log(`${comp.name} is struggling financially this turn.`);
            return; // Too poor to act
        }

        // 2. Research Priority: Should they invest in R&D?
        if (Math.random() > Math.random() * 0.5 && comp.cash > 10000) {
            console.log(`${comp.name} is funding research.`);
            // AI simulates increasing its internal technology level
        }

        // 3. Product Cycle: Should they release a new product or adjust pricing?
        if (Math.random() < 0.6 && Math.random() > 0.1) { // 60% chance to act
            const action = Math.floor(Math.random() * 3);

            if (action === 0) {
                // ACTION: Price adjustment (Reactive)
                const currentPriceFactor = 1 + ((gameState.companyInfo.marketShare - comp.marketShare) / 500);
                comp.price = Math.round(1000 * currentPriceFactor * Math.random() * 0.9 + 100); // Price changes slightly
                console.log(`${comp.name} adjusted pricing for better market fit.`);

            } else if (action === 1) {
                 // ACTION: Launch a product (Competitive move)
                 const newProductSpecs = Math.floor(Math.random() * 5) + 2; // Medium complexity
                 console.warn(`🚨 COMPETITOR ALERT! ${comp.name} launched a new device! Price: ${formatCurrency(newProductSpecs)}`);

            } else {
                // ACTION: Increase Marketing (Brand Building)
                comp.marketingSpend = Math.min(5000, comp.marketingSpend + 1000);
                 console.log(`${comp.name} invested heavily in marketing this quarter.`);
            }
        }

    });
}


window.initializeCompetitors = initializeCompetitors;
