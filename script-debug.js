// SIMPLE DEBUG VERSION - Direct approach
console.log('Debug version starting...');

let currentBill = 0;
let currentTip = 0;
let currentTipPercent = 0;

function initApp() {
    console.log('Initializing simple version...');
    
    // Get elements
    const billInput = document.getElementById('bill-amount');
    const resultsSection = document.getElementById('results');
    const billTotalDisplay = document.getElementById('bill-total');
    const tipAmountDisplay = document.getElementById('tip-amount');
    const totalAmountDisplay = document.getElementById('total-amount');
    const tipPercentDisplay = document.getElementById('tip-percent');
    const customInput = document.getElementById('custom-input');
    const customPercentInput = document.getElementById('custom-percentage');
    const themeToggle = document.getElementById('theme-toggle');
    
    console.log('Elements found:', {
        billInput: !!billInput,
        resultsSection: !!resultsSection,
        themeToggle: !!themeToggle
    });
    
    // Simple calculation function
    function calculate() {
        console.log('Calculating...');
        currentBill = parseFloat(billInput.value) || 0;
        
        if (currentBill > 0 && currentTipPercent > 0) {
            currentTip = currentBill * (currentTipPercent / 100);
            const total = currentBill + currentTip;
            
            console.log('Results:', { bill: currentBill, tip: currentTip, total: total });
            
            billTotalDisplay.textContent = formatCurrency(currentBill);
            tipAmountDisplay.textContent = formatCurrency(currentTip);
            totalAmountDisplay.textContent = formatCurrency(total);
            tipPercentDisplay.textContent = currentTipPercent.toFixed(1);
            
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
    
    // Bill input listener
    if (billInput) {
        billInput.addEventListener('input', calculate);
        console.log('Bill input listener added');
    }
    
    // Tip buttons - DIRECT approach
    document.addEventListener('click', function(e) {
        console.log('Click detected on:', e.target);
        
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
            currentBill = 0;
            currentTip = 0;
            currentTipPercent = 0;
            if (resultsSection) resultsSection.style.display = 'none';
            if (customInput) customInput.style.display = 'none';
            
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
    
    console.log('Simple version initialized!');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}