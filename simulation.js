// --- SIMULATION MODULE: Time Progression & Economic Engine ---

import { gameState } from './data.js';

/**
 * Advances the simulation by one "Turn" (1 month).
 */
function runSimulationStep() {
    console.log("--- Running Simulation Step ---");
    gameState.cashFlow = { revenue: 0, expenses: 0, profit: 0 };
    let totalRevenue = 0;
    let totalExpenses = 0;

    // 1. Advance Time and Market Trends
    advanceDate();
    updateMarketTrends();

    // 2. Run Core Business Operations
    
    // A. Employee Costs (Overhead)
    const salaryExpense = gameState.employees.reduce((sum, e) => sum + e.salary, 0);
    gameState.cashFlow.expenses += salaryExpense;
    totalExpenses += salaryExpense;

    // B. Research Progress
    processResearch();

    // C. Competitor Actions (AI)
    runCompetitionStep();

    // D. Sales and Revenue Calculation (Primary Source of Income)
    const salesRevenue = processSales(gameState.products['new_device']); // Focus on the main product for simplicity
    totalRevenue += salesRevenue;
    gameState.cashFlow.revenue += salesRevenue;
    
    // E. Manufacturing & Overheads (Taxes, etc.)
    const fixedOverhead = 5000; 
    gameState.cashFlow.expenses += fixedOverhead;
    totalExpenses += fixedOverhead;

    // 3. Finalize and Update State
    gameState.cashFlow.profit = totalRevenue - totalExpenses;
    gameState.currency += gameState.cashFlow.profit;

    console.log(`Simulation Complete for ${formatDate(gameState.date)}. Profit: ${calculateProfitClass() ? calculateProfitClass() : ''}${formatCurrency(gameState.cashFlow.profit)}.`);

    // Rerender the UI to reflect changes
    loadView('dashboard'); 
}


/** Increments the date and advances time-dependent variables. */
function advanceDate() {
    const current = gameState.date;
    // Simple month incrementation logic (assuming monthly ticks)
    current.setMonth(current.getMonth() + 1);
    gameState.date = current;

    // Simulate small random market volatility
    if (Math.random() > 0.95) {
        console.log("📰 Global Event Triggered!");
        alert("GLOBAL EVENT: Supply chain issues caused a temporary 10% spike in component costs!");
        // In real life, this would modify COMPONENTS cost arrays dynamically.
    }
}


/** Updates global market multipliers and economic factors. */
function updateMarketTrends() {
    const randomFactor = Math.random();

    // Global Economy (Recessions/Booms)
    if (randomFactor > 0.8 && gameState.companyInfo.reputation < 60) {
        gameState.marketTrends.global_economy *= 1.05; // Slow growth during downturns
    } else if (Math.random() < 0.1) {
        // Simulate minor recession event every few turns
         gameState.marketTrends.global_economy = Math.max(0.8, gameState.marketTrends.global_economy - 0.05);
    } else {
        gameState.marketTrends.global_economy = Math.min(1.2, gameState.marketTrends.global_economy + 0.01); // Slight natural growth
    }

    // Product Specific Demand (Smartphones)
    const phoneDemandFluctuation = Math.sin(gameState.date.getMonth() / 3 * Math.PI) * 0.1 + 1; // Seasonal sine wave
    gameState.marketTrends.smartphones = Math.max(0.7, Math.min(1.5, gameState.marketTrends.smartphones * (phoneDemandFluctuation));
}


/** Processes progress on active research projects. */
function processResearch() {
    let finishedTechs = [];
    gameState.research.active = gameState.research.active.filter(project => {
        const tech = TECHNOLOGIES[project.techId];
        if (!tech) return true;

        // Calculate progress increase based on employee productivity and random chance
        const boost = gameState.employees.reduce((sum, e) => sum + (e.role === 'Researcher' ? e.productivity * 0.5 : 0), 0);
        project.progress += Math.max(1, Math.floor(boost) + Math.random() * 5);

        if (project.progress >= project.duration) {
            finishedTechs.push(project.techId);
            return false; // Remove from active list
        }
        return true; // Keep in active list
    });

    // Mark technologies as unlocked and update the data store
    finishedTechs.forEach(id => {
        TECHNOLOGIES[id].unlocked = true;
        gameState.research.completed.push(id);
        console.log(`✅ TECHNOLOGY UNLOCKED: ${TECHNOLOGIES[id].name}`);
    });
}


/** Calculates sales, revenue, and updates inventory/reputation based on market demand. */
function processSales(product) {
    if (!product || !product.is_active) return 0;

    // Base Demand Calculation: Influenced by Market Trends, Reputation, and Competitors' presence
    let baseDemand = 1500 * gameState.marketTrends.global_economy;
    const demandAdjustment = (gameState.companyInfo.reputation / 100) * 50 + Math.random() * 200;

    // Total expected sales potential
    let potentialSales = Math.floor((baseDemand + demandAdjustment) * gameState.marketTrends.smartphones);
    
    const availableStock = gameState.inventory['new_stock'] ? gameState.inventory['new_stock'].count : 0;
    
    // Actual sales cannot exceed stock or market capacity
    let actualSales = Math.min(potentialSales, availableStock);

    if (actualSales <= 0) {
        console.log("No sales this period. Inventory depleted or demand too low.");
        return 0;
    }

    // Calculate Revenue and Expenses from Sales
    const revenue = actualSales * product.price;
    gameState.currency += revenue; // Direct cash injection for simplicity
    
    // Update inventory (This should decrement the stock count in gameState.inventory)
    if (!gameState.inventory['new_stock']) {
         gameState.inventory['new_stock'] = { name: product.name, count: 0 };
    }
    gameState.inventory['new_stock'].count -= actualSales;

    // Update Reputation and Market Share based on sales success
    const marketShareGain = Math.min(1, (actualSales / (potentialSales * 2)) * 0.1); // Small gain factor
    gameState.companyInfo.marketShare += marketShareGain;
    gameState.companyInfo.reputation = Math.min(100, gameState.companyInfo.reputation + (marketShareGain * 5));

    console.log(`💰 Sold ${actualSales} units of ${product.name}. Revenue: ${formatCurrency(revenue)}.`);
    return revenue;
}


/** Simulates the actions of competing AI companies. */
function runCompetitionStep() {
    gameState.competitors.forEach(comp => {
        // 1. Determine AI's current focus (e.g., Laptops, Smartphones)
        const trendMultiplier = gameState.marketTrends[comp.focus] || 1;

        // 2. Decision: Should they launch a new product?
        if (Math.random() > Math.random() * 0.8 && comp.reputation > 35) {
            console.log(`${comp.name} is launching a competitive product!`);
            const rivalPrice = Math.max(400, gameState.products['new_device'].price * (1 + ((Math.random() - 0.5) * 0.2))); // +/- 10% variance
            // This action would trigger a complex update to the global market model, lowering player share.
        }

        // 3. Market Share Erosion: Competitors always take a small cut of market share if they are active.
        const loss = Math.min(gameState.companyInfo.marketShare * 0.015, 0.5); // Max 0.5% loss per turn
        gameState.companyInfo.marketShare -= loss;

        // Update their internal state (e.g., research progress) based on efficiency calculations...
    });
}


/* --- EXPOSED API FOR GAME CONTROLLING --- */
window.runSimulationStep = runSimulationStep; // Make it accessible from buttons/event listeners
