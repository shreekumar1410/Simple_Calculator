let currentInput = '';
let lastResult = null;
let shouldReset = false;

function appendToDisplay(value) {
    // Check if we should reset the display (after a calculation)
    if (shouldReset && !isOperator(value) && value !== '%' && value !== '.') {
        clearDisplay();
        shouldReset = false;
    }
    
    currentInput += value;
    document.getElementById('result').value = currentInput;
}

function isOperator(value) {
    return ['+', '-', '*', '/', '×'].includes(value);
}

function clearDisplay() {
    currentInput = '';
    lastResult = null;
    document.getElementById('result').value = '';
}

function deleteLastChar() {
    currentInput = currentInput.slice(0, -1);
    document.getElementById('result').value = currentInput;
}

function calculate() {
    try {
        // Replace × with * for proper evaluation
        let expression = currentInput.replace(/×/g, '*');
        
        // Handle percentage calculations
        expression = expression.replace(/(\d+)%/g, function(match, p1) {
            return parseFloat(p1) / 100;
        });
        
        const result = eval(expression);
        currentInput = result.toString();
        lastResult = result;
        document.getElementById('result').value = currentInput;
        shouldReset = true;
    } catch (error) {
        document.getElementById('result').value = 'Error';
        currentInput = '';
        lastResult = null;
        shouldReset = false;
    }
}

// Keyboard support
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    if (/[0-9]/.test(key)) {
        if (shouldReset) {
            clearDisplay();
            shouldReset = false;
        }
        appendToDisplay(key);
    } else if (isOperator(key) || key === '%' || key === '.') {
        appendToDisplay(key);
        shouldReset = false;
    } else if (key === 'Enter') {
        calculate();
    } else if (key === 'Escape') {
        clearDisplay();
    } else if (key === 'Backspace') {
        deleteLastChar();
    } else if (key === '(' || key === ')') {
        appendToDisplay(key);
    }
});