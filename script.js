// Tip Calculator App JavaScript
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
    }
    
    initializeElements() {
        // Input elements
        this.billAmountInput = document.getElementById('bill-amount');
        this.customPercentageInput = document.getElementById('custom-percentage');
        this.peopleCountInput = document.getElementById('people-count');
        this.splitCheckbox = document.getElementById('split-checkbox');
        
        // Button elements
        this.tipButtons = document.querySelectorAll('.tip-btn');
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
    }
    
    attachEventListeners() {
        // Bill input
        this.billAmountInput.addEventListener('input', () => this.updateCalculations());
        
        // Tip buttons
        this.tipButtons.forEach(btn => {
            if (!btn.classList.contains('custom')) {
                btn.addEventListener('click', (e) => this.selectTipPercent(e.target.dataset.tip));
            }
        });
        
        // Custom tip
        this.customTipBtn.addEventListener('click', () => this.showCustomInput());
        this.applyCustomBtn.addEventListener('click', () => this.applyCustomTip());
        this.customPercentageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.applyCustomTip();
        });
        
        // Split bill
        this.splitCheckbox.addEventListener('change', () => this.toggleSplitBill());
        this.peopleCountInput.addEventListener('input', () => this.updateCalculations());
        
        // Controls
        this.clearBtn.addEventListener('click', () => this.clearAll());
        this.saveBtn.addEventListener('click', () => this.saveToHistory());
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        this.historyBtn.addEventListener('click', () => this.showHistory());
        this.backBtn.addEventListener('click', () => this.showCalculator());
        this.exportBtn.addEventListener('click', () => this.exportHistory());
        
        // Camera
        this.cameraBtn.addEventListener('click', () => this.openCamera());
        this.closeCameraBtn.addEventListener('click', () => this.closeCamera());
        this.captureBtn.addEventListener('click', () => this.captureImage());
        this.manualBtn.addEventListener('click', () => this.closeCamera());
        this.useDetectedBtn.addEventListener('click', () => this.useDetectedAmount());
        this.retryScanBtn.addEventListener('click', () => this.retryCapture());
    }
    
    // Theme Management
    loadTheme() {
        const savedTheme = localStorage.getItem('tip-calculator-theme') || 'light';
        this.setTheme(savedTheme);
    }
    
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }
    
    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.themeToggle.textContent = theme === 'light' ? '🌙' : '☀️';
        localStorage.setItem('tip-calculator-theme', theme);
    }
    
    // Calculation Methods
    updateCalculations() {
        this.currentBill = parseFloat(this.billAmountInput.value) || 0;
        
        if (this.currentBill > 0 && this.currentTipPercent > 0) {
            this.currentTip = this.currentBill * (this.currentTipPercent / 100);
            const total = this.currentBill + this.currentTip;
            
            this.splitCount = this.splitCheckbox.checked ? 
                (parseInt(this.peopleCountInput.value) || 1) : 1;
            
            this.displayResults(this.currentBill, this.currentTip, total);
            this.resultsSection.style.display = 'block';
        } else {
            this.resultsSection.style.display = 'none';
        }
    }
    
    displayResults(bill, tip, total) {
        this.billTotalDisplay.textContent = this.formatCurrency(bill);
        this.tipAmountDisplay.textContent = this.formatCurrency(tip);
        this.totalAmountDisplay.textContent = this.formatCurrency(total);
        this.tipPercentDisplay.textContent = this.currentTipPercent.toFixed(1);
        
        if (this.splitCount > 1) {
            const perPerson = total / this.splitCount;
            this.perPersonDisplay.textContent = this.formatCurrency(perPerson);
            this.splitResult.style.display = 'flex';
        } else {
            this.splitResult.style.display = 'none';
        }
    }
    
    selectTipPercent(percent) {
        this.currentTipPercent = parseFloat(percent);
        this.updateTipButtonStates(percent);
        this.hideCustomInput();
        this.updateCalculations();
    }
    
    updateTipButtonStates(activePercent) {
        this.tipButtons.forEach(btn => {
            if (btn.classList.contains('custom')) return;
            
            if (btn.dataset.tip === activePercent.toString()) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
    
    showCustomInput() {
        this.customInputGroup.style.display = 'flex';
        this.customPercentageInput.focus();
        
        // Clear other tip button states
        this.tipButtons.forEach(btn => {
            if (!btn.classList.contains('custom')) {
                btn.classList.remove('active');
            }
        });
    }
    
    hideCustomInput() {
        this.customInputGroup.style.display = 'none';
        this.customPercentageInput.value = '';
    }
    
    applyCustomTip() {
        const customPercent = parseFloat(this.customPercentageInput.value);
        if (customPercent && customPercent >= 0 && customPercent <= 100) {
            this.currentTipPercent = customPercent;
            this.hideCustomInput();
            this.updateCalculations();
        } else {
            alert('Please enter a valid percentage between 0 and 100');
        }
    }
    
    toggleSplitBill() {
        if (this.splitCheckbox.checked) {
            this.splitInputGroup.style.display = 'flex';
        } else {
            this.splitInputGroup.style.display = 'none';
        }
        this.updateCalculations();
    }
    
    clearAll() {
        this.billAmountInput.value = '';
        this.customPercentageInput.value = '';
        this.peopleCountInput.value = '2';
        this.splitCheckbox.checked = false;
        this.currentBill = 0;
        this.currentTip = 0;
        this.currentTipPercent = 0;
        
        this.resultsSection.style.display = 'none';
        this.customInputGroup.style.display = 'none';
        this.splitInputGroup.style.display = 'none';
        
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
            // Using a free reverse geocoding service
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
        this.historyList.innerHTML = '';
        
        if (this.history.length === 0) {
            this.historyList.innerHTML = '<p style=\"text-align: center; color: var(--text-secondary); padding: 20px;\">No history yet. Save some tip calculations!</p>';
            return;
        }
        
        this.history.forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            
            historyItem.innerHTML = `
                <div class=\"history-date\">${item.date} • ${item.location}</div>
                <div class=\"history-details\">
                    <div>
                        <div>Bill: ${this.formatCurrency(item.billAmount)} + ${item.tipPercent.toFixed(1)}% tip</div>
                        <div>Total: ${this.formatCurrency(item.totalAmount)}${item.splitCount > 1 ? ` (${item.splitCount} people: ${this.formatCurrency(item.perPerson)}/person)` : ''}</div>
                    </div>
                    <button onclick=\"app.deleteHistoryItem(${item.id})\" style=\"background: var(--error-color); color: white; border: none; border-radius: 4px; padding: 5px 10px; cursor: pointer;\">×</button>
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
        this.mainView.style.display = 'none';
        this.historyView.style.display = 'block';
    }
    
    showCalculator() {
        this.historyView.style.display = 'none';
        this.mainView.style.display = 'block';
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
            .map(row => row.map(cell => `\"${cell}\"`).join(','))
            .join('\\n');
        
        return csvContent;
    }
    
    // Camera and OCR functionality
    async openCamera() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    facingMode: 'environment' // Use back camera if available
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
        
        // Show loading state
        this.captureBtn.textContent = '🔍 Processing...';
        this.captureBtn.disabled = true;
        
        this.processImage();
    }
    
    async processImage() {
        try {
            // Load Tesseract.js from CDN
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
        // Look for currency amounts in various formats
        const patterns = [
            /\\$([0-9]+\\.?[0-9]*)/g,           // $12.34
            /([0-9]+\\.?[0-9]*)\\s*\\$/g,       // 12.34 $
            /total[:\\s]*\\$?([0-9]+\\.?[0-9]*)/gi,  // Total: $12.34
            /amount[:\\s]*\\$?([0-9]+\\.?[0-9]*)/gi, // Amount: 12.34
            /([0-9]+\\.?[0-9]*)\\s*total/gi     // 12.34 total
        ];
        
        const amounts = [];
        
        for (const pattern of patterns) {
            let match;
            while ((match = pattern.exec(text)) !== null) {
                const amount = parseFloat(match[1]);
                if (amount > 0 && amount < 10000) { // Reasonable range
                    amounts.push(amount);
                }
            }
        }
        
        // Return the largest reasonable amount found
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
    app = new TipCalculator();
});

// Service Worker for offline functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('SW registered'))
            .catch(error => console.log('SW registration failed'));
    });
}