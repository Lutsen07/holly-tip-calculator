// Tip Calculator App JavaScript - FIXED VERSION
class TipCalculator {
    constructor() {
        this.currentBill = 0;
        this.currentTip = 0;
        this.currentTipPercent = 0;
        this.splitCount = 1;
        this.history = this.loadHistory();
        
        this.initializeElements();
        this.attachEventListeners();
        this.loadTheme();
        this.updateHistory();
        
        console.log('Tip Calculator initialized successfully');
    }
    
    initializeElements() {
        // Input elements
        this.billAmountInput = document.getElementById('bill-amount');
        this.customPercentageInput = document.getElementById('custom-percentage');
        this.peopleCountInput = document.getElementById('people-count');
        this.splitCheckbox = document.getElementById('split-checkbox');
        
        // Button elements
        this.tipButtons = document.querySelectorAll('.tip-btn:not(.custom)');
        this.customTipBtn = document.getElementById('custom-tip');
        this.applyCustomBtn = document.getElementById('apply-custom');
        this.clearBtn = document.getElementById('clear-btn');
        this.saveBtn = document.getElementById('save-btn');
        this.themeToggle = document.getElementById('theme-toggle');
        this.historyBtn = document.getElementById('history-btn');
        this.backBtn = document.getElementById('back-btn');
        this.exportBtn = document.getElementById('export-btn');
        this.cameraBtn = document.getElementById('camera-btn');
        
        // Display elements
        this.resultsSection = document.getElementById('results');
        this.billTotalDisplay = document.getElementById('bill-total');
        this.tipAmountDisplay = document.getElementById('tip-amount');
        this.totalAmountDisplay = document.getElementById('total-amount');
        this.perPersonDisplay = document.getElementById('per-person');
        this.tipPercentDisplay = document.getElementById('tip-percent');
        this.splitResult = document.getElementById('split-result');
        this.customInputGroup = document.getElementById('custom-input');
        this.splitInputGroup = document.getElementById('split-input');
        
        // Views
        this.mainView = document.getElementById('main-view');
        this.historyView = document.getElementById('history-view');
        this.historyList = document.getElementById('history-list');
        
        // Camera modal elements
        this.cameraModal = document.getElementById('camera-modal');
        this.video = document.getElementById('video');
        this.canvas = document.getElementById('canvas');
        this.captureBtn = document.getElementById('capture-btn');
        this.closeCameraBtn = document.getElementById('close-camera');
        this.manualBtn = document.getElementById('manual-btn');
        this.ocrResult = document.getElementById('ocr-result');
        this.useDetectedBtn = document.getElementById('use-detected');
        this.retryScanBtn = document.getElementById('retry-scan');
        this.detectedAmountSpan = document.getElementById('detected-amount');
        
        console.log('Elements initialized:', {
            tipButtons: this.tipButtons.length,
            customTipBtn: !!this.customTipBtn,
            themeToggle: !!this.themeToggle
        });
    }
    
    attachEventListeners() {
        // Bill input
        if (this.billAmountInput) {
            this.billAmountInput.addEventListener('input', () => {
                console.log('Bill amount changed:', this.billAmountInput.value);
                this.updateCalculations();
            });
        }
        
        // Tip buttons - FIXED
        this.tipButtons.forEach((btn, index) => {
            console.log('Setting up tip button:', btn.dataset.tip);
            btn.addEventListener('click', (e) => {
                console.log('Tip button clicked:', e.target.dataset.tip);
                this.selectTipPercent(e.target.dataset.tip);
            });
        });
        
        // Custom tip - FIXED
        if (this.customTipBtn) {
            this.customTipBtn.addEventListener('click', () => {
                console.log('Custom tip button clicked');
                this.showCustomInput();
            });
        }
        
        if (this.applyCustomBtn) {
            this.applyCustomBtn.addEventListener('click', () => this.applyCustomTip());
        }
        
        if (this.customPercentageInput) {
            this.customPercentageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.applyCustomTip();
            });
        }
        
        // Split bill
        if (this.splitCheckbox) {
            this.splitCheckbox.addEventListener('change', () => this.toggleSplitBill());
        }
        if (this.peopleCountInput) {
            this.peopleCountInput.addEventListener('input', () => this.updateCalculations());
        }
        
        // Controls
        if (this.clearBtn) {
            this.clearBtn.addEventListener('click', () => this.clearAll());
        }
        if (this.saveBtn) {
            this.saveBtn.addEventListener('click', () => this.saveToHistory());
        }
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => {
                console.log('Theme toggle clicked');
                this.toggleTheme();
            });
        }
        if (this.historyBtn) {
            this.historyBtn.addEventListener('click', () => this.showHistory());
        }
        if (this.backBtn) {
            this.backBtn.addEventListener('click', () => this.showCalculator());
        }
        if (this.exportBtn) {
            this.exportBtn.addEventListener('click', () => this.exportHistory());
        }
        
        // Camera
        if (this.cameraBtn) {
            this.cameraBtn.addEventListener('click', () => this.openCamera());
        }
        if (this.closeCameraBtn) {
            this.closeCameraBtn.addEventListener('click', () => this.closeCamera());
        }
        if (this.captureBtn) {
            this.captureBtn.addEventListener('click', () => this.captureImage());
        }
        if (this.manualBtn) {
            this.manualBtn.addEventListener('click', () => this.closeCamera());
        }
        if (this.useDetectedBtn) {
            this.useDetectedBtn.addEventListener('click', () => this.useDetectedAmount());
        }
        if (this.retryScanBtn) {
            this.retryScanBtn.addEventListener('click', () => this.retryCapture());
        }
        
        console.log('Event listeners attached successfully');
    }
    
    // Theme Management - FIXED
    loadTheme() {
        const savedTheme = localStorage.getItem('tip-calculator-theme') || 'light';
        console.log('Loading theme:', savedTheme);
        this.setTheme(savedTheme);
    }
    
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        console.log('Toggling theme from', currentTheme, 'to', newTheme);
        this.setTheme(newTheme);
    }
    
    setTheme(theme) {
        console.log('Setting theme to:', theme);
        document.documentElement.setAttribute('data-theme', theme);
        if (this.themeToggle) {
            this.themeToggle.textContent = theme === 'light' ? '🌙' : '☀️';
        }
        localStorage.setItem('tip-calculator-theme', theme);
        
        // Force CSS refresh
        document.body.style.display = 'none';
        document.body.offsetHeight; // Trigger reflow
        document.body.style.display = '';
    }
    
    // Calculation Methods - FIXED
    updateCalculations() {
        this.currentBill = parseFloat(this.billAmountInput.value) || 0;
        
        console.log('Updating calculations:', {
            bill: this.currentBill,
            tipPercent: this.currentTipPercent
        });
        
        if (this.currentBill > 0 && this.currentTipPercent > 0) {
            this.currentTip = this.currentBill * (this.currentTipPercent / 100);
            const total = this.currentBill + this.currentTip;
            
            this.splitCount = this.splitCheckbox && this.splitCheckbox.checked ? 
                (parseInt(this.peopleCountInput.value) || 1) : 1;
            
            console.log('Displaying results:', {
                bill: this.currentBill,
                tip: this.currentTip,
                total: total,
                splitCount: this.splitCount
            });
            
            this.displayResults(this.currentBill, this.currentTip, total);
            if (this.resultsSection) {
                this.resultsSection.style.display = 'block';
            }
        } else {
            console.log('Hiding results - insufficient data');
            if (this.resultsSection) {
                this.resultsSection.style.display = 'none';
            }
        }
    }
    
    displayResults(bill, tip, total) {
        console.log('Displaying results:', { bill, tip, total });
        
        if (this.billTotalDisplay) {
            this.billTotalDisplay.textContent = this.formatCurrency(bill);
        }
        if (this.tipAmountDisplay) {
            this.tipAmountDisplay.textContent = this.formatCurrency(tip);
        }
        if (this.totalAmountDisplay) {
            this.totalAmountDisplay.textContent = this.formatCurrency(total);
        }
        if (this.tipPercentDisplay) {
            this.tipPercentDisplay.textContent = this.currentTipPercent.toFixed(1);
        }
        
        if (this.splitCount > 1) {
            const perPerson = total / this.splitCount;
            if (this.perPersonDisplay) {
                this.perPersonDisplay.textContent = this.formatCurrency(perPerson);
            }
            if (this.splitResult) {
                this.splitResult.style.display = 'flex';
            }
        } else {
            if (this.splitResult) {
                this.splitResult.style.display = 'none';
            }
        }
    }
    
    selectTipPercent(percent) {
        console.log('Selecting tip percent:', percent);
        this.currentTipPercent = parseFloat(percent);
        this.updateTipButtonStates(percent);
        this.hideCustomInput();
        this.updateCalculations();
    }
    
    updateTipButtonStates(activePercent) {
        this.tipButtons.forEach(btn => {
            if (btn.dataset.tip === activePercent.toString()) {
                btn.classList.add('active');
                console.log('Activating button:', activePercent);
            } else {
                btn.classList.remove('active');
            }
        });
    }
    
    showCustomInput() {
        console.log('Showing custom input');
        if (this.customInputGroup) {
            this.customInputGroup.style.display = 'flex';
        }
        if (this.customPercentageInput) {
            this.customPercentageInput.focus();
        }
        
        // Clear other tip button states
        this.tipButtons.forEach(btn => {
            btn.classList.remove('active');
        });
    }
    
    hideCustomInput() {
        if (this.customInputGroup) {
            this.customInputGroup.style.display = 'none';
        }
        if (this.customPercentageInput) {
            this.customPercentageInput.value = '';
        }
    }
    
    applyCustomTip() {
        const customPercent = parseFloat(this.customPercentageInput.value);
        console.log('Applying custom tip:', customPercent);
        
        if (customPercent && customPercent >= 0 && customPercent <= 100) {
            this.currentTipPercent = customPercent;
            this.hideCustomInput();
            this.updateCalculations();
        } else {
            alert('Please enter a valid percentage between 0 and 100');
        }
    }
    
    toggleSplitBill() {
        if (this.splitCheckbox && this.splitCheckbox.checked) {
            if (this.splitInputGroup) {
                this.splitInputGroup.style.display = 'flex';
            }
        } else {
            if (this.splitInputGroup) {
                this.splitInputGroup.style.display = 'none';
            }
        }
        this.updateCalculations();
    }
    
    clearAll() {
        if (this.billAmountInput) this.billAmountInput.value = '';
        if (this.customPercentageInput) this.customPercentageInput.value = '';
        if (this.peopleCountInput) this.peopleCountInput.value = '2';
        if (this.splitCheckbox) this.splitCheckbox.checked = false;
        
        this.currentBill = 0;
        this.currentTip = 0;
        this.currentTipPercent = 0;
        
        if (this.resultsSection) this.resultsSection.style.display = 'none';
        if (this.customInputGroup) this.customInputGroup.style.display = 'none';
        if (this.splitInputGroup) this.splitInputGroup.style.display = 'none';
        
        this.tipButtons.forEach(btn => btn.classList.remove('active'));
    }
    
    // History Management
    async saveToHistory() {
        if (this.currentBill <= 0 || this.currentTip <= 0) {
            alert('Please calculate a tip before saving to history');
            return;
        }
        
        let location = 'Unknown Location';
        try {
            const position = await this.getCurrentLocation();
            location = await this.getLocationName(position.coords.latitude, position.coords.longitude);
        } catch (error) {
            console.log('Location not available:', error);
        }
        
        const historyItem = {
            id: Date.now(),
            date: new Date().toLocaleString(),
            billAmount: this.currentBill,
            tipPercent: this.currentTipPercent,
            tipAmount: this.currentTip,
            totalAmount: this.currentBill + this.currentTip,
            splitCount: this.splitCount,
            perPerson: (this.currentBill + this.currentTip) / this.splitCount,
            location: location
        };
        
        this.history.unshift(historyItem);
        this.saveHistory();
        this.updateHistory();
        
        // Show confirmation
        const originalText = this.saveBtn.textContent;
        this.saveBtn.textContent = '✅ Saved!';
        this.saveBtn.style.backgroundColor = '#27AE60';
        
        setTimeout(() => {
            this.saveBtn.textContent = originalText;
            this.saveBtn.style.backgroundColor = '';
        }, 2000);
    }
    
    getCurrentLocation() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation not supported'));
                return;
            }
            
            navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000
            });
        });
    }
    
    async getLocationName(lat, lng) {
        try {
            const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`);
            const data = await response.json();
            
            if (data.city && data.principalSubdivision) {
                return `${data.city}, ${data.principalSubdivision}`;
            } else if (data.locality) {
                return data.locality;
            }
        } catch (error) {
            console.log('Geocoding failed:', error);
        }
        
        return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
    
    loadHistory() {
        try {
            const saved = localStorage.getItem('tip-calculator-history');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Error loading history:', error);
            return [];
        }
    }
    
    saveHistory() {
        try {
            localStorage.setItem('tip-calculator-history', JSON.stringify(this.history));
        } catch (error) {
            console.error('Error saving history:', error);
        }
    }
    
    updateHistory() {
        if (!this.historyList) return;
        
        this.historyList.innerHTML = '';
        
        if (this.history.length === 0) {
            this.historyList.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 20px;">No history yet. Save some tip calculations!</p>';
            return;
        }
        
        this.history.forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            
            historyItem.innerHTML = `
                <div class="history-date">${item.date} • ${item.location}</div>
                <div class="history-details">
                    <div>
                        <div>Bill: ${this.formatCurrency(item.billAmount)} + ${item.tipPercent.toFixed(1)}% tip</div>
                        <div>Total: ${this.formatCurrency(item.totalAmount)}${item.splitCount > 1 ? ` (${item.splitCount} people: ${this.formatCurrency(item.perPerson)}/person)` : ''}</div>
                    </div>
                    <button onclick="app.deleteHistoryItem(${item.id})" style="background: var(--error-color); color: white; border: none; border-radius: 4px; padding: 5px 10px; cursor: pointer;">×</button>
                </div>
            `;
            
            this.historyList.appendChild(historyItem);
        });
    }
    
    deleteHistoryItem(id) {
        this.history = this.history.filter(item => item.id !== id);
        this.saveHistory();
        this.updateHistory();
    }
    
    showHistory() {
        if (this.mainView) this.mainView.style.display = 'none';
        if (this.historyView) this.historyView.style.display = 'block';
    }
    
    showCalculator() {
        if (this.historyView) this.historyView.style.display = 'none';
        if (this.mainView) this.mainView.style.display = 'block';
    }
    
    exportHistory() {
        if (this.history.length === 0) {
            alert('No history to export');
            return;
        }
        
        const csvContent = this.generateCSV();
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tip-history-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }
    
    generateCSV() {
        const headers = ['Date', 'Location', 'Bill Amount', 'Tip %', 'Tip Amount', 'Total', 'Split Count', 'Per Person'];
        const rows = this.history.map(item => [
            item.date,
            item.location,
            item.billAmount.toFixed(2),
            item.tipPercent.toFixed(1),
            item.tipAmount.toFixed(2),
            item.totalAmount.toFixed(2),
            item.splitCount,
            item.perPerson.toFixed(2)
        ]);
        
        const csvContent = [headers, ...rows]
            .map(row => row.map(cell => `"${cell}"`).join(','))
            .join('\n');
        
        return csvContent;
    }
    
    // Camera and OCR functionality
    async openCamera() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    facingMode: 'environment'
                } 
            });
            this.video.srcObject = stream;
            this.cameraModal.style.display = 'flex';
            this.ocrResult.style.display = 'none';
        } catch (error) {
            console.error('Camera access failed:', error);
            alert('Camera access failed. Please check permissions or enter amount manually.');
        }
    }
    
    closeCamera() {
        if (this.video.srcObject) {
            const tracks = this.video.srcObject.getTracks();
            tracks.forEach(track => track.stop());
        }
        this.cameraModal.style.display = 'none';
        this.ocrResult.style.display = 'none';
    }
    
    captureImage() {
        const context = this.canvas.getContext('2d');
        this.canvas.width = this.video.videoWidth;
        this.canvas.height = this.video.videoHeight;
        context.drawImage(this.video, 0, 0);
        
        this.captureBtn.textContent = '🔍 Processing...';
        this.captureBtn.disabled = true;
        
        this.processImage();
    }
    
    async processImage() {
        try {
            if (typeof Tesseract === 'undefined') {
                await this.loadTesseract();
            }
            
            const { data: { text } } = await Tesseract.recognize(this.canvas, 'eng', {
                logger: m => console.log(m)
            });
            
            console.log('OCR Result:', text);
            const amount = this.extractAmountFromText(text);
            
            if (amount) {
                this.detectedAmountSpan.textContent = amount.toFixed(2);
                this.ocrResult.style.display = 'block';
            } else {
                alert('Could not detect amount. Please try again or enter manually.');
                this.retryCapture();
            }
        } catch (error) {
            console.error('OCR failed:', error);
            alert('Text recognition failed. Please try again or enter manually.');
            this.retryCapture();
        }
    }
    
    async loadTesseract() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/tesseract.js@4/dist/tesseract.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
    
    extractAmountFromText(text) {
        const patterns = [
            /\$([0-9]+\.?[0-9]*)/g,
            /([0-9]+\.?[0-9]*)\s*\$/g,
            /total[:\s]*\$?([0-9]+\.?[0-9]*)/gi,
            /amount[:\s]*\$?([0-9]+\.?[0-9]*)/gi,
            /([0-9]+\.?[0-9]*)\s*total/gi
        ];
        
        const amounts = [];
        
        for (const pattern of patterns) {
            let match;
            while ((match = pattern.exec(text)) !== null) {
                const amount = parseFloat(match[1]);
                if (amount > 0 && amount < 10000) {
                    amounts.push(amount);
                }
            }
        }
        
        return amounts.length > 0 ? Math.max(...amounts) : null;
    }
    
    useDetectedAmount() {
        const amount = parseFloat(this.detectedAmountSpan.textContent);
        this.billAmountInput.value = amount.toFixed(2);
        this.closeCamera();
        this.updateCalculations();
    }
    
    retryCapture() {
        this.captureBtn.textContent = '📷 Capture';
        this.captureBtn.disabled = false;
        this.ocrResult.style.display = 'none';
    }
    
    // Utility Methods
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }
}

// Initialize the app when the page loads
let app;
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing app...');
    app = new TipCalculator();
});

// Service Worker for offline functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('SW registered'))
            .catch(error => console.log('SW registration failed'));
    });
}