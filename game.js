// --- GAME MODULE: UI Controller & Event Handler ---

import { gameState } from './data.js';

const elements = {
    mainContent: document.getElementById('main-content'),
    sidebar: document.querySelector('#sidebar nav ul'),
    statCash: document.getElementById('stat-cash'),
    statReputation: document.getElementById('stat-reputation'),
    statMarketShare: document.getElementById('stat-market-share'),
    statDate: document.getElementById('stat-date'),
    statProfit: document.getElementById('stat-profit')
};

let currentView = 'dashboard';

/**
 * Initializes the entire game setup on load.
 */
function initGame() {
    console.log("Tech Empire Tycoon Initialized.");
    // Set up event listeners for sidebar navigation
    document.querySelectorAll('.nav-item button').forEach(button => {
        button.addEventListener('click', (e) => {
            const view = e.target.dataset.view;
            if (view) {
                loadView(view);
            }
        });
    });

    // Set the initial view and update dashboard stats
    loadView('dashboard'); 
    setInterval(() => {
        // Simulate a tick every second for testing purposes, though simulation runs on button press normally.
        updateDashboardStats();
    }, 1000); 
}


/**
 * Renders the main content area based on the requested view state.
 * @param {string} viewName - The section to display ('dashboard', 'products', etc.)
 */
function loadView(viewName) {
    if (currentView === viewName) return;

    // Update active class in sidebar
    document.querySelectorAll('.nav-item button').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.querySelector(`.nav-item button[data-view="${viewName}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }

    // Clear content and load the appropriate view function
    elements.mainContent.innerHTML = ''; 
    currentView = viewName;

    switch (viewName) {
        case 'dashboard':
            renderDashboard();
            break;
        case 'products':
            renderProductOverview();
            break;
        case 'create_product':
            renderProductDesigner();
            break;
        case 'research':
            renderResearchView();
            break;
        case 'employees':
            renderEmployeeDashboard();
            break;
        case 'manufacturing':
            renderManufacturingView();
            break;
        case 'finances':
            renderFinancialReport();
            break;
        // Add cases for other views (Marketing, Stores, etc.) as they are implemented.
        default:
            elements.mainContent.innerHTML = `<h1>${viewName.replace('_', ' ').toUpperCase()}</h1><p>This section is under construction.</p>`;
    }

    updateDashboardStats(); // Always update stats after changing view
}

// --- RENDERING FUNCTIONS (Mapping View Names to HTML Output) ---

/** Renders the main dashboard overview. */
function renderDashboard() {
    let html = `
        <h2>🏢 Company Dashboard</h2>
        <div id="stats-grid">
            <div class="stat-box"><h3>💰 Cash Balance</h3><p>${formatCurrency(gameState.currency)}</p></div>
            <div class="stat-box"><h3>📈 Current Profit (Sim)</h3><p class="${calculateProfitClass() ? calculateProfitClass() : ''}">${formatCurrency(gameState.cashFlow.profit)}</p></div>
            <div class="stat-box"><h3>⭐ Reputation</h3><p>${Math.round(gameState.companyInfo.reputation)}/100</p></div>
            <div class="stat-box"><h3>🌎 Market Share</h3><p>${gameState.companyInfo.marketShare.toFixed(2)}%</p></div>
        </div>

        <div class="card">
            <h2>🗓️ Simulation Report (${formatDate(gameState.date)})</h2>
            <p>The market is currently experiencing a ${getMarketStatus()} economic climate. Global demand for electronics remains high, but competition from AI rivals is increasing.</p>
            <p><strong>Action Required:</strong> Review your product lineup and research priorities. Your flagship model needs an update!</p>
        </div>

        <h3>💡 Quick Actions</h3>
        <div style="display: flex; gap: 15px;">
            <button class="primary" onclick="handleManufacture()">🏭 Manufacture Products</button>
            <button class="secondary" onclick="handleResearchStart()">🔬 Start Research</button>
            <button class="secondary" onclick="showSaveLoadModal()">💾 Save Game</button>
        </div>
    `;
    elements.mainContent.innerHTML = html;
}

/** Renders the product catalog overview. */
function renderProductOverview() {
    let productsHtml = '';
    for (const id in gameState.products) {
        const product = gameState.products[id];
        if (product.is_active) {
            productsHtml += `
                <div class="card" style="margin-bottom: 15px;">
                    <h3>${product.name} (${product.category})</h3>
                    <p><strong>Price:</strong> ${formatCurrency(product.price)} | <strong>Quality:</strong> ${product.qualityScore}/100</p>
                    <p class="profit-${calculateProfitClass() ? calculateProfitClass() : ''}">Est. Margin: ${formatCurrency(product.price - product.cost)}</p>
                    <div style="display: flex; gap: 10px;">
                        <button class="primary" onclick="loadView('create_product'); selectProduct('${id}')">✏️ Improve Product</button>
                        <button class="secondary" onclick="handleDiscontinueProduct('${id}')">❌ Discontinue</button>
                    </div>
                </div>
            `;
        }
    }

    let html = `
        <h2>📱 Product Portfolio</h2>
        <p>View your currently released and designed products. Click 'Improve' to update components or adjust pricing.</p>
        ${productsHtml || '<div class="card">You have no active products. Use the Designer to create your first masterpiece!</div>'}
    `;
    elements.main-content.innerHTML = html;
}

/** Renders the detailed product designer interface. */
function renderProductDesigner() {
    // Initial setup for design state (This would typically use a complex form/state machine)
    let componentsHtml = '';
    for (const type in COMPONENTS) {
        componentsHtml += `
            <div class="component-selector">
                <h4>${type.replace('_', ' ').toUpperCase()} Selection</h4>
                <p>Select core component for this category.</p>
                <!-- Simplified dropdown structure -->
                <select id="${type}_select" onchange="updateDesignPreview()">
                    <option value="" disabled selected>-- Select Component --</option>
                    ${COMPONENTS[type].map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
                </select>
            </div>
        `;
    }

    let html = `
        <h2>⚙️ Product Designer: New Device</h2>
        <div id="product-designer">
            <!-- Left Column: Component Selection -->
            <div>
                ${componentsHtml}
            </div>
            <!-- Right Column: Preview, Stats, Actions -->
            <div class="card">
                <h3>📊 Product Specification & Preview</h3>
                <p><strong>Model Name:</strong> <input type="text" id="model-name" value="TechCorp Alpha X"></p>
                <p><strong>Category:</strong> Smartphone</p>
                
                <h4>Calculated Metrics</h4>
                <p><b>Estimated Manufacturing Cost (CoGS):</b> $<span id="cost-preview">0.00</span></p>
                <p><b>Overall Quality Score:</b> <span id="quality-preview">0</span>/100</p>
                <p><b>Performance Index:</b> <span id="performance-preview">0</span></p>

                <hr style="margin: 20px 0; border-color: #343a40;">

                <h4>Pricing and Launch</h4>
                <label for="selling-price">Selling Price:</label>
                <input type="number" id="selling-price" value="699.99" onchange="updateDesignPreview()">

                <button class="primary" onclick="handleSaveProduct()">💾 Save Design Draft</button>
            </div>
        </div>
    `;
    elements.mainContent.innerHTML = html;
}

/** Renders the research and technology tree view. */
function renderResearchView() {
    let techGridHtml = '';
    for (const id in TECHNOLOGIES) {
        const tech = TECHNOLOGIES[id];
        const status = gameState.research.completed.includes(id) ? 'UNLOCKED' : 
                        gameState.research.active.some(r => r.techId === id) ? 'IN PROGRESS' : 
                        tech.unlocked && !gameState.research.completed.includes(id) ? 'AVAILABLE' : 'LOCKED';

        let buttonAction = '';
        if (status === 'LOCKED') {
            buttonAction = `disabled`;
        } else if (status === 'IN PROGRESS') {
             buttonAction = 'disabled';
        } else {
            buttonAction = `onclick="handleResearchStart('${id}')"`;
        }

        techGridHtml += `
            <div class="card" style="flex: 1; margin-right: 15px;">
                <h3>${tech.name}</h3>
                <p><strong>Cost:</strong> ${formatCurrency(tech.cost)} | <strong>Duration:</strong> ${tech.duration} turns</p>
                <p><strong>Status:</strong> <span style="color: var(--color-success);">${status}</span></p>
                <button class="primary" ${buttonAction}>${status === 'LOCKED' ? 'Locked' : (status === 'IN PROGRESS' ? 'Active' : 'Research Technology')}
                </button>
            </div>
        `;
    }

    let html = `
        <h2>🔬 Research & Development</h2>
        <div class="card">
            <h3>Active Research</h3>
            ${gameState.research.active.length > 0 
                ? gameState.research.active.map(r => `<p>Tech: ${TECHNOLOGIES[r.techId].name} | Progress: ${r.progress}%</p>`).join('')
                : '<p style="color: var(--color-text-muted);">No active research projects.</p>'
            }
        </div>

        <h3>Technology Tree</h3>
        <div id="tech-research-grid" style="display: flex; gap: 20px;">
            ${techGridHtml}
        </div>
    `;
    elements.mainContent.innerHTML = html;
}


/** Renders the employee management view. */
function renderEmployeeDashboard() {
    let employeesHtml = `
        <h2>🧑‍💻 Human Resources</h2>
        <div class="card">
            <h3>Team Management</h3>
            <p>Current total staff count: ${gameState.employees.length}. Salaries and morale affect productivity.</p>

            <h4>Hiring Panel</h4>
            <button class="primary" onclick="hireEmployee('engineer')">Hire Engineer (Cost: $10,000)</button>
            <button class="secondary" onclick="hireEmployee('designer')">Hire Designer (Cost: $10,000)</button>

            <h4>Staff Roster</h4>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Skill</th>
                        <th>Salary/Turn</th>
                        <th>Morale</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    ${gameState.employees.map(e => `
                        <tr>
                            <td>${e.id}</td>
                            <td>${e.role}</td>
                            <td>${e.skill}/10</td>
                            <td>${formatCurrency(e.salary)}</td>
                            <td style="color: ${e.morale > 70 ? var(--color-success) : (e.morale < 30 ? var(--color-danger) : 'yellow')}">${e.morale}%</td>
                            <td><button class="secondary" onclick="fireEmployee('${e.id}')">Fire</button></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
    elements.mainContent.innerHTML = employeesHtml;
}

/** Renders the manufacturing management view. */
function renderManufacturingView() {
    let html = `
        <h2>🏭 Manufacturing & Inventory</h2>
        <div class="card">
            <h3>Production Planning</h3>
            <label for="product-select">Select Product:</label>
            <select id="product-select">
                ${Object.keys(gameState.products).map(id => 
                    `<option value="${id}">${gameState.products[id].name}</option>`
                ).join('')}
            </select>

            <div style="margin-top: 20px;">
                <label for="quantity">Quantity to Produce:</label>
                <input type="number" id="quantity" value="100" min="1">
                <button class="primary" onclick="handleManufacture()">⚙️ Initiate Manufacturing</button>
            </div>

            <h3>Current Inventory</h3>
            <table>
                <thead>
                    <tr><th>Product</th><th>Model ID</th><th>Count</th><th>Avg. Cost</th></tr>
                </thead>
                <tbody>
                    ${Object.keys(gameState.inventory).map(id => {
                        const inv = gameState.inventory[id];
                        return `<tr><td>${inv.name}</td><td>${id}</td><td>${inv.count}</td><td>${formatCurrency(parseFloat(id.includes('smartphone') ? 200 : ''))}</td></tr>`;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
    elements.mainContent.innerHTML = html;
}

/** Renders the financial report and loan management view. */
function renderFinancialReport() {
     let html = `
        <h2>💰 Financial & Corporate Report</h2>
        <div class="card">
            <h3>Profit Summary</h3>
            <p>Total Revenue YTD: ${formatCurrency(100000)}</p>
            <p>Total Expenses YTD: ${formatCurrency(50000)}</p>
            <h4 style="margin-top: 20px;">Net Profit (This Period): <span class="${calculateProfitClass() ? calculateProfitClass() : ''}">${formatCurrency(gameState.cashFlow.profit)}</span></h4>

            <h3>Loans & Debt</h3>
            ${gameState.loans.active ? `
                <p><strong>Active Loan:</strong> ${gameState.loans.active.name}</p>
                <p>Remaining Principal: ${formatCurrency(gameState.loans.active.remaining)}</p>
                <button class="secondary" onclick="handleLoanRepayment()">Make Payment (Due: ${formatCurrency(gameState.loans.interestPaymentDue)})</button>
            ` : '<p style="color: var(--color-success);">No active loans.</p>'}

            <h3>Expansion & Loans</h3>
            <label for="loan-amount">Apply for Loan:</label>
            <input type="number" id="loan-amount" placeholder="Amount (Min $50,000)">
            <button class="primary" onclick="handleLoanApplication()">💰 Apply for Funding</button>
        </div>
    `;
    elements.mainContent.innerHTML = html;
}


// --- UTILITY/SIMULATION HANDLERS ---

/** Updates the visible status indicators on the dashboard. */
function updateDashboardStats() {
    const profitClass = calculateProfitClass();
    document.getElementById('stat-cash').textContent = formatCurrency(gameState.currency);
    document.getElementById('stat-reputation').textContent = Math.round(gameState.companyInfo.reputation) + "/100";
    document.getElementById('stat-market-share').textContent = gameState.companyInfo.marketShare.toFixed(2) + "%";
    document.getElementById('stat-date').textContent = formatDate(gameState.date);
    const statProfitEl = document.getElementById('stat-profit');
    if (statProfitEl) {
        statProfitEl.textContent = formatCurrency(gameState.cashFlow.profit);
        statProfitEl.className = ''; // Clear existing class
        statProfitEl.classList.add(calculateProfitClass ? calculateProfitClass() : '');
    }

     // Force re-render if critical data changed (e.g., when loading a view)
    if (currentView === 'dashboard') {
         elements.mainContent.querySelector('.status-indicator').innerHTML = `Cash: ${formatCurrency(gameState.currency)} | Rep: ${Math.round(gameState.companyInfo.reputation)}`;
    }
}

/** Formats number to currency string ($X,XXX.XX) */
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

/** Calculates the CSS class for profit display (green/red). */
function calculateProfitClass() {
    if (gameState.cashFlow.profit > 0) return 'profit-positive';
    if (gameState.cashFlow.profit < 0) return 'profit-negative';
    return '';
}

/** Calculates the class for market status messages. */
function getMarketStatus() {
    const factor = gameState.marketTrends.global_economy;
    if (factor > 1.1) return "Booming (High Demand)";
    if (factor < 0.9) return "Recessionary (Consumer Caution)";
    return "Stable";
}

/** Formats date object to a readable string (Month Year - Quarter). */
function formatDate(date) {
    const options = { month: 'long', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}


// --- CORE GAME FLOW HANDLERS ---

/** Dummy function to simulate advanced product creation logic. */
function selectProduct(id) {
    console.log(`Loading Product Designer for ID: ${id}`);
    // In a full implementation, this would pre-fill the designer form state
    loadView('create_product'); 
}

/** Handles starting the research process. */
function handleResearchStart(techId = null) {
    if (!techId) {
        // For dashboard quick action button click
        const techToResearchId = Object.keys(TECHNOLOGIES).find(id => !TECHNOLOGIES[id].unlocked && TECHNOLOGIES[id].cost <= gameState.currency);
        if (techToResearchId) {
            handleResearchStart(techToResearchId); // Select first affordable research option
        } else {
            alert("Not enough capital or no available technologies to research!");
            return;
        }
    }

    const tech = TECHNOLOGIES[techId];
    if (gameState.research.active.some(r => r.techId === techId)) {
        alert("This technology is already under active development!");
        return;
    }

    if (gameState.currency < tech.cost) {
        alert(`Insufficient funds. Requires ${formatCurrency(tech.cost)}.`);
        return;
    }
    
    // Deduct cost and start project
    gameState.currency -= tech.cost;
    const activeProject = { 
        techId: techId, 
        name: tech.name, 
        progress: 0, 
        duration: tech.duration 
    };
    gameState.research.active.push(activeProject);

    alert(`Research started! ${tech.name} will take several turns.`);
    loadView('research'); // Refresh the view to show active project
}

/** Dummy function for simulating product improvements and saving designs. */
function updateDesignPreview() {
    // Simplified calculation: Quality based on selected components (Assume current selection)
    let quality = 0;
    let cost = 0;
    const specs = ['cpu_select', 'screen_select', 'camera_select', 'battery_select', 'storage_select'];

    specs.forEach(id => {
        const selectEl = document.getElementById(id);
        if (selectEl && selectEl.value) {
            // In a real game, we would look up the component data by ID and add its stats/cost.
            // For this mock, we just calculate dummy costs.
            const costValue = Math.random() * 100; // Dummy cost calculation
            cost += costValue;
        }
    });

    document.getElementById('cost-preview').textContent = cost.toFixed(2);
    document.getElementById('quality-preview').textContent = (Math.floor((cost / 5) + Math.random() * 10)).toString();
    document.getElementById('performance-preview').textContent = (Math.floor(cost / 20) + 5).toString();
}

function handleSaveProduct() {
    // Simulate saving a product design based on current inputs/selections
    const modelName = document.getElementById('model-name').value;
    const price = parseFloat(document.getElementById('selling-price').value);

    if (!modelName || isNaN(price)) {
        alert("Please fill in all required fields.");
        return;
    }

    // Create a new product structure
    gameState.products['new_device'] = {
        id: 'new_device', // Simplified ID generation
        name: modelName,
        category: "Smartphone",
        release_date: gameState.date,
        specs: {}, 
        price: price,
        cost: parseFloat(document.getElementById('cost-preview').textContent),
        qualityScore: parseInt(document.getElementById('quality-preview').textContent),
        marketing_spend: 0,
        is_active: true
    };

    alert(`Successfully designed and saved "${modelName}"! It is now ready for manufacturing.`);
    loadView('products');
}

/** Handles simulating the bulk manufacturing process. */
function handleManufacture() {
    const productId = document.getElementById('product-select').value;
    const quantity = parseInt(document.getElementById('quantity').value);

    if (!productId || !quantity || quantity <= 0) {
        alert("Please select a product and enter a valid quantity.");
        return;
    }

    const product = gameState.products[productId];
    const totalCost = product.cost * quantity;

    if (gameState.currency < totalCost) {
        alert(`Insufficient funds! Production costs ${formatCurrency(totalCost)}.`);
        return;
    }

    // Update inventory and finances
    gameState.inventory['new_stock'] = { 
        name: product.name, 
        count: (gameState.inventory['new_stock'] ? gameState.inventory['new_stock'].count : 0) + quantity, 
        last_sale_price: product.price 
    };
    gameState.currency -= totalCost;

    alert(`✅ Successfully manufactured ${quantity} units of ${product.name}. Cost: ${formatCurrency(totalCost)}. Inventory updated!`);
    updateDashboardStats();
}


// --- SAVE/LOAD MODAL AND FUNCTIONS ---

function showSaveLoadModal() {
    const modal = document.getElementById('save-load-modal');
    if (modal) modal.style.display = 'flex';
}

/** Saves the current gameState to localStorage and triggers a download. */
function handleManualSave() {
    try {
        // 1. Save State Locally
        localStorage.setItem('tech_empire_save', JSON.stringify(gameState));
        alert("Game state saved successfully! You can now refresh or close the browser.");

        // 2. Export for User Backup (Downloadable JSON)
        const jsonString = JSON.stringify(gameState, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `TechEmpireTycoon_Save_${formatDate(gameState.date)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

    } catch (e) {
        alert("Error saving game: Local storage might be unavailable or quota reached.");
        console.error(e);
    }
}

/** Loads the gameState from localStorage, replacing the current state. */
function handleLoadGame() {
     const storedState = localStorage.getItem('tech_empire_save');
    if (!storedState) {
        alert("No saved game found.");
        return;
    }
    try {
        const loadedData = JSON.parse(storedState);
        // Simple version validation
        if (loadedData.version !== '1.0') {
            throw new Error("Save file version mismatch.");
        }

        // Overwrite the global state safely
        Object.assign(gameState, loadedData); 
        alert(`Game successfully loaded! Welcome back to ${formatDate(gameState.date)}.`);
        
        // Trigger UI update
        loadView('dashboard');

    } catch (e) {
        console.error("Loading error:", e);
        alert("Failed to load game state. The save file may be corrupted.");
    }
}


/* --- Initialization Call --- */
document.addEventListener('DOMContentLoaded', () => {
    initGame();
});

// Expose functions globally for inline HTML handlers (e.g., onclick)
window.handleManualSave = handleManualSave;
window.handleLoadGame = handleLoadGame;
window.showSaveLoadModal = showSaveLoadModal;
