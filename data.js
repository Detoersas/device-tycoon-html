// --- DATA MODULE: Global Game Constants and State Management ---

const STARTING_CAPITAL = {
    easy: 100000,
    medium: 500000,
    hard: 1000000,
    sandbox: Infinity
};

// Define component data (Performance, Cost, Weight, etc.)
const COMPONENTS = {
    processors: [
        { id: 'cpu_low', name: "Low-End Core i3 Equivalent", performance: 5, cost: 15, power: 0.8, required_tech: 'BASIC_CPU' },
        { id: 'cpu_medium', name: "Mid-Range Ryzen 5 Equivalent", performance: 12, cost: 40, power: 1.5, required_tech: 'ADVANCED_CPU' },
        { id: 'cpu_high', name: "High-End Core i9 Equivalent", performance: 30, cost: 120, power: 3.0, required_tech: 'ULTRA_CPU' }
    ],
    screens: [
        { id: 'screen_basic', name: "LCD Panel (720p)", resolution: 'HD', quality: 5, weight: 1, cost: 80, tech: 'SCREEN_BASIC' },
        { id: 'screen_advanced', name: "AMOLED Display (FHD+)", resolution: 'FHD+', quality: 15, weight: 2, cost: 300, tech: 'ADVANCED_DISPLAY' }
    ],
    cameras: [
        { id: 'cam_basic', name: "5MP Basic Camera", megapixels: 5, quality: 8, weight: 0.5, cost: 30, required_tech: 'BASIC_CAM' },
        { id: 'cam_pro', name: "48MP Professional Sensor", megapixels: 48, quality: 20, weight: 1.0, cost: 150, required_tech: 'PRO_CAM' }
    ],
    batteries: [
        { id: 'batt_basic', name: "Standard Polymer Battery", capacity: 3000, efficiency: 70, weight: 0.5, cost: 50, tech: 'BASIC_POWER' },
        { id: 'batt_advanced', name: "Lithium-Ion Energy Cell", capacity: 6000, efficiency: 85, weight: 1.2, cost: 200, tech: 'ADVANCED_BATTERY' }
    ],
    storage: [
        { id: 'storage_low', name: "32GB eMMC", capacity: 32, speed: 5, cost: 40, tech: 'BASIC_STORAGE' },
        { id: 'storage_high', name: "1TB UFS 3.1 SSD", capacity: 1000, speed: 80, cost: 350, tech: 'ADVANCED_STORAGE' }
    ],
};

// Define available technologies (Research Tree)
const TECHNOLOGIES = {
    BASIC_CPU: { name: "Basic CPU Architecture", cost: 1000, duration: 20, unlocked: false },
    ADVANCED_CPU: { name: "Multi-Core Processor Design", cost: 5000, duration: 40, unlocked: false },
    ULTRA_CPU: { name: "Neural Engine Optimization", cost: 15000, duration: 80, unlocked: false },

    SCREEN_BASIC: { name: "Standard LCD Screen", cost: 500, duration: 20, unlocked: true },
    ADVANCED_DISPLAY: { name: "High Refresh AMOLED Display", cost: 4000, duration: 60, unlocked: false },

    PRO_CAM: { name: "Advanced Imaging Sensors", cost: 8000, duration: 50, unlocked: false },
    BASIC_CAM: { name: "Basic Camera Module", cost: 100, duration: 10, unlocked: true },

    ADVANCED_BATTERY: { name: "High Density Lithium-Ion Batteries", cost: 3000, duration: 40, unlocked: false },
    BASIC_POWER: { name: "Basic Power Management", cost: 50, duration: 5, unlocked: true },

    ADVANCED_STORAGE: { name: "High Speed Flash Storage (SSD)", cost: 7000, duration: 60, unlocked: false },
};


// Initialize the global state object
let gameState = {
    date: new Date('2024-Q1-20'), // Current game date
    timeScale: 1,                // Time progression speed (1x, 2x, 4x)
    currency: STARTING_CAPITAL.medium,
    cashFlow: {
        revenue: 0,
        expenses: 0,
        profit: 0
    },
    companyInfo: {
        name: "TechCorp Inc.",
        founder: "Alex Builder",
        specialization: "Smartphones", // Initial focus market
        reputation: 50,             // 1-100
        marketShare: 2.5            // %
    },
    inventory: {
        'smartphone_x': { name: "Model X Smartphone", count: 100, last_sale_price: 699.99 }
    },
    products: {}, // Stores details of all designed products
    employees: [
        { id: 'e1', role: 'Founder/CEO', skill: 8, salary: 500, morale: 80, productivity: 1.0 },
        // Add more employees dynamically
    ],
    research: {
        active: [], // [{ techId: '...', progress: 20, duration: 40 }]
        completed: [] // List of unlocked technologies/components
    },
    marketTrends: {
        smartphones: 1.0,   // Multiplier for demand (e.g., 1.1 = up)
        laptops: 0.95,      // General economic factor
        global_economy: 1.0 // Inflation/recession factor
    },
    competitors: [],     // Populated by competition.js
    loans: {
        active: null,       // { principal: N, interestRate: R, remaining: X }
        interestPaymentDue: 0
    }
};

// Initialize the AI Competitors
const INITIAL_COMPETITORS = [
    { name: "InnovateGlobal", focus: "Laptops", reputation: 45, marketShare: 2.1 },
    { name: "MegaByte Systems", focus: "Components", reputation: 30, marketShare: 1.8 },
    { name: "Zenith Tech", focus: "Smartwatches", reputation: 60, marketShare: 1.5 }
];

// Initializing the game state with competitors and starting products
gameState.competitors = INITIAL_COMPETITORS;
gameState.products['smartphone_x'] = {
    id: 'smartphone_x',
    name: "Model X Smartphone",
    category: "Smartphone",
    release_date: new Date(),
    specs: {
        screen: 'advanced', processor: 'medium', camera: 'pro', battery: 'advanced', storage: 'high'
    },
    price: 699.99,
    cost: 250.00, // Initial rough estimate cost
    qualityScore: 85, // Calculated score based on components
    marketing_spend: 5000,
    is_active: true
};

// Ensure all necessary technologies are initially unlocked for the starting product
gameState.research.completed = ['SCREEN_BASIC', 'BASIC_CAM', 'ADVANCED_BATTERY', 'ADVANCED_STORAGE'];

export { 
    gameState, 
    COMPONENTS, 
    TECHNOLOGIES, 
    STARTING_CAPITAL, 
    INITIAL_COMPETITORS 
};
