# Quick Mobile Commands Reference

## 🔄 Daily Development

```bash
# Make code changes in frontend/src/

# Build and sync
cd frontend
npm run build
npx cap sync

# Open in Android Studio
npx cap open android

# Open in Xcode (Mac only)
npx cap open ios
```

## 🌐 Web Development (No Changes)

```bash
cd frontend
npm run dev
# Visit http://localhost:3000
```

## 📦 One-Time Setup (Already Done!)

```bash
# Install Capacitor (✅ Done)
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android @capacitor/ios

# Add platforms (✅ Done)
npx cap add android
npx cap add ios
```

## 🎯 What You Have Now

✅ **Web App** - Works in any browser
✅ **Android Project** - Ready for Google Play Store
✅ **iOS Project** - Ready for Apple App Store
✅ **One Codebase** - All three platforms share the same code
✅ **Same Backend** - All connect to your FastAPI backend

## 📱 To Test on Your Phone

### Android:
1. Download Android Studio
2. Open `frontend/android` folder
3. Click Run button
4. Choose your phone or emulator

### iOS (Mac required):
1. Download Xcode from Mac App Store
2. Open `frontend/ios/App/App.xcworkspace`
3. Click Play button
4. Choose your iPhone or simulator

## 🚀 You're All Set!

Your InspectIQ app can now be:
- Used on the web
- Installed on Android phones
- Installed on iPhones

All from the same codebase! 🎉
