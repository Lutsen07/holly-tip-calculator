# 💰 Holly's Tip Calculator App

A mobile-friendly tip calculator web app built specifically for Holly, with OCR bill scanning, split bill functionality, and tip history tracking.

## 🚀 Quick Start

**The app is currently running at:** 
- **Network Access:** http://192.168.40.4:8080 (accessible from any device on your WiFi network)
- **Local Access:** http://localhost:8080 (Mac mini only)

1. Open your phone's web browser
2. Navigate to http://192.168.40.4:8080
3. Add to home screen for app-like experience

## ✨ Features

### Core Functionality
- **📱 Mobile-Friendly Design** - Optimized for phone screens
- **💸 Preset Tip Options** - 15%, 20%, 25% buttons for quick selection
- **🎯 Custom Tip Calculator** - Enter any percentage or fixed amount
- **👥 Split Bill Feature** - Divide total among multiple people
- **💳 Bill Input** - Manual entry or camera scanning (OCR)
- **🌙 Dark/Light Theme** - Toggle between themes for comfort

### Smart Features
- **📷 Camera OCR** - Scan bills to automatically detect amounts
- **📍 Location Tracking** - Automatically log restaurant locations
- **📊 Tip History** - Track all your tip calculations over time
- **📤 Export History** - Download tip history as CSV file
- **💾 Offline Ready** - Works without internet connection
- **🔄 Auto-Save** - All data stored locally on your phone

## 🎮 How to Use

### Basic Tip Calculation
1. Enter bill amount (or tap 📷 to scan)
2. Select tip percentage (15%, 20%, 25%, or Custom)
3. View calculated tip and total
4. Tap "Split bill" if dining with others
5. Save to history for record keeping

### Camera Bill Scanning
1. Tap the 📷 camera button next to bill amount
2. Allow camera permissions when prompted
3. Point camera at bill total on receipt
4. Tap "📷 Capture" to scan
5. Review detected amount and tap "Use This Amount"
6. Falls back to manual entry if scanning fails

### Split Bill
1. Check "Split bill among multiple people"
2. Enter number of people
3. App automatically calculates per-person amount
4. Includes tip in the per-person calculation

### History & Export
1. Tap 📊 icon to view tip history
2. See all past calculations with dates and locations
3. Tap "Export History" to download CSV file
4. Delete individual entries with × button

## 🛠 Technical Details

### Built With
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **OCR**: Tesseract.js for client-side text recognition
- **Storage**: Local Storage for offline data persistence
- **Geolocation**: Built-in browser APIs for location tracking
- **PWA**: Service Worker for offline functionality

### Browser Support
- **iOS Safari** - Full support
- **Android Chrome** - Full support
- **Other mobile browsers** - Core features supported

### Privacy & Data
- **🔐 All data stays on your device** - No external servers
- **📍 Location permission optional** - Works without location access
- **💾 Local storage only** - No cloud synchronization
- **🛡 No tracking or analytics** - Complete privacy

## 📱 Installation as App

### iPhone (iOS)
1. Open in Safari
2. Tap Share button (square with arrow)
3. Tap "Add to Home Screen"
4. Tap "Add" to confirm
5. App icon appears on home screen

### Android
1. Open in Chrome
2. Tap menu (3 dots)
3. Tap "Add to Home Screen"
4. Confirm installation
5. App appears in app drawer

## 🔧 Customization Options

The app can be easily customized:
- **Colors**: Edit CSS variables in `style.css`
- **Tip Presets**: Modify percentages in `script.js`
- **Currency**: Currently USD, can be changed to other currencies
- **Rounding**: Modify rounding rules for tip calculations

## 📈 Future Enhancements

Possible additions based on usage:
- **Multiple currencies** support for travel
- **Tax calculation** options
- **Receipt photo storage** alongside calculations
- **Merchant/restaurant favorites** with default tip rates
- **Monthly/yearly spending summaries**
- **Cloud backup** option for history sync

## 🐛 Troubleshooting

### Camera Not Working
- Check browser permissions for camera access
- Ensure good lighting when scanning bills
- Use manual entry as backup
- Works better on bills with clear, dark text

### Location Not Detected
- Allow location permissions when prompted
- May take a few seconds to acquire GPS lock
- Falls back to "Unknown Location" if unavailable
- Works in airplane mode with saved locations

### App Not Loading
- Ensure web server is running (`python3 -m http.server 8080`)
- Check network connection to localhost
- Clear browser cache if needed
- Try incognito/private browsing mode

## 🎯 Perfect for Holly

This app is specifically designed for Holly's needs:
- **Quick and intuitive** - No complicated menus
- **Reliable in restaurants** - Works in low light with camera
- **Accurate calculations** - No math errors when dining out
- **History tracking** - Keep records for budgeting
- **Split bill friendly** - Great for group dinners
- **Theme options** - Light theme for day, dark for evening dining

---

**Status**: ✅ Complete and ready for testing!
**Server**: Currently running on http://localhost:8080
**Next**: Test on Holly's phone and gather feedback