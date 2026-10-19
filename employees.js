// --- EMPLOYEE MODULE: Human Resource Management ---

import { gameState } from './data.js';

/** Adds a new employee to the roster. */
function hireEmployee(role) {
    const salary = 500 + Math.random() * 300; // Variable starting salary
    const skill = Math.floor(Math.random() * 5) + 5; // Mid-range skill
    const newId = 'e' + (gameState.employees.length + 1);

    if (gameState.currency < 10000) {
        alert("Cannot hire. Not enough capital ($10,000 minimum required).");
        return;
    }

    gameState.currency -= 10000; // Hiring fee

    gameState.employees.push({
        id: newId,
        role: role.charAt(0).toUpperCase() + role.slice(1),
        skill: skill,
        salary: salary,
        morale: Math.floor(Math.random() * 30) + 70, // High starting morale
        productivity: (skill / 5) // Productivity factor based on skill
    });

    alert(`Successfully hired a new ${role}! Salary set to ${formatCurrency(salary)}.`);
    loadView('employees');
}

/** Removes an employee from the roster. */
function fireEmployee(employeeId) {
    if (confirm("Are you sure you want to fire this employee? This cannot be undone.")) {
        gameState.employees = gameState.employees.filter(e => e.id !== employeeId);
        alert("Employee fired. Productivity and salary expenses reduced.");
        loadView('employees');
    }
}

/** Calculates the overall impact of staff on various departments (e.g., R&D). */
function calculateStaffImpact() {
    const engineers = gameState.employees.filter(e => e.role === 'Engineer').length;
    const researchers = gameState.employees.filter(e => e.role === 'Researcher').length;

    let report = `Engineering Capacity: ${engineers} Staff.\n`;
    report += `Research Capability: ${researchers} Staff. (Higher skill/morale boosts research speed.)\n`;
    return report;
}


window.hireEmployee = hireEmployee;
window.fireEmployee = fireEmployee;
