let currentInput = '';

function appendToDisplay(value) {
    currentInput += value;
    document.getElementById('result').value = currentInput;
}

function clearDisplay() {
    currentInput = '';
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
        document.getElementById('result').value = currentInput;
    } catch (error) {
        document.getElementById('result').value = 'Error';
        currentInput = '';
    }
}

// Keyboard support
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    if (/[0-9+\-*/.%]/.test(key)) {
        appendToDisplay(key);
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
