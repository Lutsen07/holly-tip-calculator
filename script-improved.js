// IMPROVED VERSION - Real-world feedback fixes
console.log('Improved version starting...');

let currentBill = 0;
let currentTip = 0;
let currentTipPercent = 0;
let splitCount = 1;
let roundToNearestDollar = false;
let history = [];

function initApp() {
    console.log('Initializing improved version...');
    
    // Load saved data
    loadSettings();
    loadHistory();
    
    // Get elements
    const billInput = document.getElementById('bill-amount');
    const resultsSection = document.getElementById('results');
    const billTotalDisplay = document.getElementById('bill-total');
    const tipAmountDisplay = document.getElementById('tip-amount');
    const totalAmountDisplay = document.getElementById('total-amount');
    const tipPercentDisplay = document.getElementById('tip-percent');
    const perPersonDisplay = document.getElementById('per-person');
    const splitResult = document.getElementById('split-result');
    const customInput = document.getElementById('custom-input');
    const customPercentInput = document.getElementById('custom-percentage');
    const themeToggle = document.getElementById('theme-toggle');
    const splitCheckbox = document.getElementById('split-checkbox');
    const peopleCountInput = document.getElementById('people-count');
    const saveBtn = document.getElementById('save-btn');
    
    // Add round-up toggle to header (dynamically)
    const headerControls = document.querySelector('.header-controls');
    if (headerControls && !document.getElementById('round-toggle')) {
        const roundToggle = document.createElement('button');
        roundToggle.id = 'round-toggle';
        roundToggle.className = 'icon-btn';
        roundToggle.title = 'Round to nearest dollar';
        roundToggle.textContent = roundToNearestDollar ? '$1' : '$¢';
        headerControls.appendChild(roundToggle);
    }
    
    console.log('Elements found:', {
        billInput: !!billInput,
        resultsSection: !!resultsSection,
        themeToggle: !!themeToggle,
        splitCheckbox: !!splitCheckbox,
        saveBtn: !!saveBtn
    });
    
    // Simple calculation function
    function calculate() {
        console.log('Calculating...');
        currentBill = parseFloat(billInput.value) || 0;
        
        if (currentBill > 0 && currentTipPercent > 0) {
            currentTip = currentBill * (currentTipPercent / 100);
            
            // Round to nearest dollar if enabled
            if (roundToNearestDollar) {
                currentTip = Math.ceil(currentTip);
            }
            
            const total = currentBill + currentTip;
            
            // Handle split bill
            splitCount = 1;
            if (splitCheckbox && splitCheckbox.checked && peopleCountInput) {
                splitCount = parseInt(peopleCountInput.value) || 1;
            }
            
            console.log('Results:', { 
                bill: currentBill, 
                tip: currentTip, 
                total: total, 
                splitCount: splitCount,
                roundUp: roundToNearestDollar 
            });
            
            billTotalDisplay.textContent = formatCurrency(currentBill);
            tipAmountDisplay.textContent = formatCurrency(currentTip);
            totalAmountDisplay.textContent = formatCurrency(total);
            tipPercentDisplay.textContent = currentTipPercent.toFixed(1);
            
            // Show split result if needed
            if (splitCount > 1) {
                const perPerson = total / splitCount;
                perPersonDisplay.textContent = formatCurrency(perPerson);
                splitResult.style.display = 'flex';
            } else {
                splitResult.style.display = 'none';
            }
            
            resultsSection.style.display = 'block';
        } else {
            resultsSection.style.display = 'none';
        }
    }
    
    // Format currency
    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }
    
    // Save calculation to history
    function saveToHistory() {
        if (currentBill <= 0 || currentTip <= 0) {
            alert('Please calculate a tip before saving');
            return;
        }
        
        const historyItem = {
            id: Date.now(),
            date: new Date().toLocaleString(),
            billAmount: currentBill,
            tipPercent: currentTipPercent,
            tipAmount: currentTip,
            totalAmount: currentBill + currentTip,
            splitCount: splitCount,
            perPerson: (currentBill + currentTip) / splitCount,
            location: 'Restaurant',
            roundedUp: roundToNearestDollar
        };
        
        history.unshift(historyItem);
        
        // Keep only last 50 entries
        if (history.length > 50) {
            history = history.slice(0, 50);
        }
        
        // Save to localStorage
        try {
            localStorage.setItem('tip-calculator-history', JSON.stringify(history));
            console.log('History saved successfully', history.length, 'items');
            
            // Show confirmation
            const originalText = saveBtn.textContent;
            saveBtn.textContent = '✅ Saved!';
            saveBtn.style.backgroundColor = '#27AE60';
            
            setTimeout(() => {
                saveBtn.textContent = originalText;
                saveBtn.style.backgroundColor = '';
            }, 2000);
            
        } catch (error) {
            console.error('Failed to save history:', error);
            alert('Could not save to history. Storage may be full.');
        }
    }
    
    // Load history from localStorage
    function loadHistory() {
        try {
            const saved = localStorage.getItem('tip-calculator-history');
            history = saved ? JSON.parse(saved) : [];
            console.log('History loaded:', history.length, 'items');
        } catch (error) {
            console.error('Failed to load history:', error);
            history = [];
        }
    }
    
    // Load settings
    function loadSettings() {
        roundToNearestDollar = localStorage.getItem('tip-calculator-round') === 'true';
        console.log('Settings loaded:', { roundToNearestDollar });
    }
    
    // Save settings
    function saveSettings() {
        localStorage.setItem('tip-calculator-round', roundToNearestDollar.toString());
        console.log('Settings saved:', { roundToNearestDollar });
    }
    
    // Bill input listener
    if (billInput) {
        billInput.addEventListener('input', calculate);
        console.log('Bill input listener added');
    }
    
    // Split bill change listener
    if (splitCheckbox) {
        splitCheckbox.addEventListener('change', function() {
            const splitInputGroup = document.getElementById('split-input');
            if (splitInputGroup) {
                splitInputGroup.style.display = splitCheckbox.checked ? 'flex' : 'none';
            }
            calculate();
        });
    }
    
    // People count change listener
    if (peopleCountInput) {
        peopleCountInput.addEventListener('input', calculate);
    }
    
    // Main click handler
    document.addEventListener('click', function(e) {
        console.log('Click detected on:', e.target.id || e.target.className);
        
        // Tip percentage buttons
        if (e.target.classList.contains('tip-btn') && !e.target.classList.contains('custom')) {
            const percent = parseFloat(e.target.dataset.tip);
            console.log('Tip button clicked:', percent);
            
            currentTipPercent = percent;
            
            // Update button states
            document.querySelectorAll('.tip-btn:not(.custom)').forEach(btn => {
                btn.classList.remove('active');
            });
            e.target.classList.add('active');
            
            // Hide custom input
            if (customInput) {
                customInput.style.display = 'none';
            }
            
            calculate();
        }
        
        // Custom tip button
        if (e.target.id === 'custom-tip') {
            console.log('Custom tip button clicked');
            if (customInput) {
                customInput.style.display = 'flex';
                if (customPercentInput) {
                    customPercentInput.focus();
                }
            }
            
            // Clear other buttons
            document.querySelectorAll('.tip-btn:not(.custom)').forEach(btn => {
                btn.classList.remove('active');
            });
        }
        
        // Apply custom tip
        if (e.target.id === 'apply-custom') {
            console.log('Apply custom clicked');
            const customPercent = parseFloat(customPercentInput.value);
            if (customPercent && customPercent >= 0 && customPercent <= 100) {
                currentTipPercent = customPercent;
                if (customInput) {
                    customInput.style.display = 'none';
                }
                calculate();
            } else {
                alert('Please enter a valid percentage between 0 and 100');
            }
        }
        
        // Round toggle
        if (e.target.id === 'round-toggle') {
            console.log('Round toggle clicked');
            roundToNearestDollar = !roundToNearestDollar;
            e.target.textContent = roundToNearestDollar ? '$1' : '$¢';
            e.target.title = roundToNearestDollar ? 'Rounding to nearest dollar' : 'Exact tip amounts';
            saveSettings();
            calculate(); // Recalculate with new rounding
        }
        
        // Save button
        if (e.target.id === 'save-btn') {
            console.log('Save button clicked');
            saveToHistory();
        }
        
        // Theme toggle
        if (e.target.id === 'theme-toggle') {
            console.log('Theme toggle clicked');
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            e.target.textContent = newTheme === 'light' ? '🌙' : '☀️';
            localStorage.setItem('tip-calculator-theme', newTheme);
        }
        
        // Clear button
        if (e.target.id === 'clear-btn') {
            console.log('Clear clicked');
            if (billInput) billInput.value = '';
            if (customPercentInput) customPercentInput.value = '';
            if (splitCheckbox) splitCheckbox.checked = false;
            if (peopleCountInput) peopleCountInput.value = '2';
            
            const splitInputGroup = document.getElementById('split-input');
            if (splitInputGroup) {
                splitInputGroup.style.display = 'none';
            }
            
            currentBill = 0;
            currentTip = 0;
            currentTipPercent = 0;
            splitCount = 1;
            
            if (resultsSection) resultsSection.style.display = 'none';
            if (customInput) customInput.style.display = 'none';
            if (splitResult) splitResult.style.display = 'none';
            
            document.querySelectorAll('.tip-btn').forEach(btn => {
                btn.classList.remove('active');
            });
        }
    });
    
    // Load theme
    const savedTheme = localStorage.getItem('tip-calculator-theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    if (themeToggle) {
        themeToggle.textContent = savedTheme === 'light' ? '🌙' : '☀️';
    }
    
    console.log('Improved version initialized with features:', {
        roundToNearestDollar,
        historyItems: history.length,
        theme: savedTheme
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}