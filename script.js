let currentInput = '';
let lastResult = null;
let shouldReset = false;
let memory = 0;
let history = [];
let isMemorySet = false;

function appendToDisplay(value) {
    if (shouldReset) {
        if (!isOperator(value) && value !== '%' && value !== '.' && value !== '(' && value !== ')') {
            clearDisplay();
        }
        shouldReset = false;
    }

    // Prevent invalid expressions
    if (isOperator(value) && (currentInput === '' || isOperator(currentInput.slice(-1)))) {
        return;
    }

    // Prevent multiple decimal points in a number
    if (value === '.' && currentInput.split(/[\+\-\*\/]/).pop().includes('.')) {
        return;
    }

    // Prevent operators after opening parenthesis
    if (isOperator(value) && currentInput.slice(-1) === '(') {
        return;
    }

    // Prevent closing parenthesis without opening
    if (value === ')' && (currentInput.match(/\(/g) || []).length <= (currentInput.match(/\)/g) || []).length) {
        return;
    }

    currentInput += value;
    updateDisplay();
}

function isOperator(value) {
    return ['+', '-', '*', '/', '×'].includes(value);
}

function clearDisplay() {
    currentInput = '';
    updateDisplay();
}

function clearAll() {
    currentInput = '';
    lastResult = null;
    updateDisplay();
}

function deleteLastChar() {
    currentInput = currentInput.slice(0, -1);
    updateDisplay();
}

function calculate() {
    try {
        if (!currentInput) return;
        
        let expression = currentInput
            .replace(/×/g, '*')
            .replace(/(\d+)%/g, (_, p1) => parseFloat(p1) / 100);
        
        // Validate parentheses
        if ((expression.match(/\(/g) || []).length !== (expression.match(/\)/g) || []).length) {
            throw new Error('Mismatched parentheses');
        }
        
        // Validate expression structure
        if (/[\+\-\*\/]$/.test(expression)) {
            throw new Error('Invalid expression');
        }
        
        // Handle division by zero
        if (/\/0(?!\.)/.test(expression)) {
            throw new Error('Division by zero');
        }
        
        const result = eval(expression);
        addToHistory(`${currentInput} = ${result}`);
        currentInput = result.toString();
        lastResult = result;
        shouldReset = true;
        updateDisplay();
    } catch (error) {
        showError(error.message);
    }
}

function showError(message) {
    const display = document.getElementById('result');
    currentInput = '';
    lastResult = null;
    display.value = message;
    display.classList.add('error-flash');
    setTimeout(() => {
        display.classList.remove('error-flash');
        display.value = '0';
    }, 1500);
}

// Memory functions
function memoryAdd() {
    const value = parseFloat(currentInput || '0');
    memory += value;
    isMemorySet = true;
    updateMemoryIndicator();
    animateButton('.memory-btn:nth-child(1)');
}

function memorySubtract() {
    const value = parseFloat(currentInput || '0');
    memory -= value;
    isMemorySet = true;
    updateMemoryIndicator();
    animateButton('.memory-btn:nth-child(2)');
}

function memoryRecall() {
    if (isMemorySet) {
        currentInput = memory.toString();
        updateDisplay();
        animateButton('.memory-btn:nth-child(3)');
    }
}

function memoryClear() {
    memory = 0;
    isMemorySet = false;
    updateMemoryIndicator();
    animateButton('.memory-btn:nth-child(4)');
}

function updateMemoryIndicator() {
    const indicator = document.getElementById('memory-indicator');
    if (isMemorySet) {
        indicator.classList.add('active');
    } else {
        indicator.classList.remove('active');
    }
}

// Advanced operations
function squareRoot() {
    try {
        const value = parseFloat(currentInput || '0');
        if (value < 0) throw new Error('Invalid input');
        currentInput = Math.sqrt(value).toString();
        addToHistory(`√(${value}) = ${currentInput}`);
        updateDisplay();
        shouldReset = true;
        animateButton('button:nth-last-child(4)');
    } catch (error) {
        showError('Invalid input');
    }
}

function power(exponent) {
    const value = parseFloat(currentInput || '0');
    currentInput = Math.pow(value, exponent).toString();
    addToHistory(`(${value})^${exponent} = ${currentInput}`);
    updateDisplay();
    shouldReset = true;
    animateButton(exponent === 2 ? 'button:nth-last-child(3)' : 'button:nth-last-child(2)');
}

// History functions
function addToHistory(entry) {
    history.unshift(entry);
    if (history.length > 10) history.pop();
    updateHistoryDisplay();
}

function updateHistoryDisplay() {
    const historyContent = document.getElementById('history-content');
    historyContent.innerHTML = history.map(item => 
        `<div class="history-item" onclick="useHistoryItem('${item}')">${item}</div>`
    ).join('');
}

function useHistoryItem(item) {
    const result = item.split(' = ')[1];
    currentInput = result;
    updateDisplay();
    shouldReset = true;
    animateButton('#history-content .history-item');
}

function clearHistory() {
    history = [];
    updateHistoryDisplay();
    animateButton('.clear-history');
}

// Theme toggle
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    document.body.classList.toggle('light-theme');
    animateButton('.theme-toggle');
}

// Animation
function animateButton(selector) {
    const button = document.querySelector(selector);
    if (button) {
        button.classList.add('button-press');
        setTimeout(() => {
            button.classList.remove('button-press');
        }, 200);
    }
}

function updateDisplay() {
    document.getElementById('result').value = currentInput || '0';
}

// Keyboard support
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    if (/[0-9]/.test(key)) {
        if (shouldReset && !event.shiftKey) {
            clearDisplay();
            shouldReset = false;
        }
        appendToDisplay(key);
        animateButton(`button:contains('${key}')`);
    }
    else if (isOperator(key) || key === '%' || key === '.') {
        appendToDisplay(key);
        shouldReset = false;
        animateButton(`button:contains('${key === '*' ? '×' : key}')`);
    }
    else if (key === 'Enter' || key === '=') {
        calculate();
        animateButton('.equals');
    }
    else if (key === 'Escape') {
        clearAll();
        animateButton('button:contains("AC")');
    }
    else if (key === 'Backspace') {
        deleteLastChar();
        animateButton('button:contains("⌫")');
    }
    else if (key === '(' || key === ')') {
        appendToDisplay(key);
        animateButton(`button:contains('${key}')`);
    }
    else if (key === 'm' || key === 'M') {
        if (event.shiftKey) {
            memorySubtract();
        } else {
            memoryAdd();
        }
    }
    else if (key === 'r' && event.ctrlKey) {
        memoryRecall();
    }
    else if (key === 'c' && event.ctrlKey) {
        memoryClear();
    }
    else if (key === 'h' && event.ctrlKey) {
        clearHistory();
    }
});

// Initialize
updateDisplay();
updateMemoryIndicator();