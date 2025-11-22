# InspectIQ Mobile App Guide

## 🎉 Your app is now ready for iOS and Android!

Capacitor has been successfully configured. You now have:
- ✅ Web version (React)
- ✅ Android app project
- ✅ iOS app project

All three use the **same codebase** and connect to the **same backend**.

---

## 📱 Project Structure

```
frontend/
├── src/              # Your React code (shared by all platforms)
├── dist/             # Built web app
├── android/          # Android native project
├── ios/              # iOS native project
└── capacitor.config.ts
```

---

## 🚀 Development Workflow

### 1. Make Changes to Your App
Edit files in `frontend/src/` as usual. Changes apply to web, iOS, and Android.

### 2. Build the Web App
```bash
cd frontend
npm run build
```

### 3. Sync Changes to Mobile
```bash
npx cap sync
```
This copies your built web app to iOS and Android projects.

---

## 📱 Testing on Android

### Requirements:
- Android Studio (download from https://developer.android.com/studio)

### Steps:
1. Open Android Studio
2. Open the project: `frontend/android`
3. Wait for Gradle sync to complete
4. Click the green "Run" button
5. Choose an emulator or connected device

### Quick Command:
```bash
cd frontend
npx cap open android
```

---

## 🍎 Testing on iOS

### Requirements:
- Mac computer (required for iOS development)
- Xcode (download from Mac App Store)

### Steps:
1. Open Xcode
2. Open the project: `frontend/ios/App/App.xcworkspace`
3. Select a simulator or connected iPhone
4. Click the "Play" button

### Quick Command:
```bash
cd frontend
npx cap open ios
```

---

## 🌐 Testing Web Version

Just run your dev server as usual:
```bash
cd frontend
npm run dev
```
Open http://localhost:3000

---

## 📦 Building for Production

### Web
```bash
cd frontend
npm run build
# Deploy the 'dist' folder to your web host
```

### Android APK/AAB
1. Open Android Studio
2. Build → Generate Signed Bundle/APK
3. Follow the wizard to create a release build
4. Upload to Google Play Console

### iOS IPA
1. Open Xcode
2. Product → Archive
3. Distribute App
4. Upload to App Store Connect

---

## 🔄 Update Workflow

When you make changes:

```bash
# 1. Make your code changes in src/

# 2. Build
npm run build

# 3. Sync to mobile
npx cap sync

# 4. Test
npx cap open android  # or ios
```

---

## 🔌 Adding Native Features

Capacitor provides plugins for native features:

### Camera
```bash
npm install @capacitor/camera
```

### Geolocation
```bash
npm install @capacitor/geolocation
```

### Push Notifications
```bash
npm install @capacitor/push-notifications
```

### File System
```bash
npm install @capacitor/filesystem
```

See all plugins: https://capacitorjs.com/docs/plugins

---

## 📝 App Store Submission

### Google Play Store (Android)
1. Create a Google Play Developer account ($25 one-time fee)
2. Build a signed release APK/AAB
3. Create app listing with screenshots, description
4. Submit for review (usually 1-3 days)

### Apple App Store (iOS)
1. Join Apple Developer Program ($99/year)
2. Create App ID in Apple Developer Portal
3. Build and archive in Xcode
4. Upload to App Store Connect
5. Submit for review (usually 1-3 days)

---

## 🎨 App Icons & Splash Screens

Place your app icon and splash screen in:
- `frontend/android/app/src/main/res/` (Android)
- `frontend/ios/App/App/Assets.xcassets/` (iOS)

Or use a tool like:
```bash
npm install @capacitor/assets
npx capacitor-assets generate
```

---

## 🔧 Configuration

Edit `frontend/capacitor.config.ts` to customize:
- App ID (com.inspectiq.app)
- App Name (InspectIQ)
- Server URL for API
- Plugins configuration

---

## 📚 Resources

- Capacitor Docs: https://capacitorjs.com/docs
- Android Studio: https://developer.android.com/studio
- Xcode: https://developer.apple.com/xcode/
- Google Play Console: https://play.google.com/console
- App Store Connect: https://appstoreconnect.apple.com/

---

## 🆘 Common Issues

### "npx cap sync" fails
- Make sure you ran `npm run build` first
- Check that `dist` folder exists

### Android build errors
- Update Android Studio to latest version
- File → Invalidate Caches and Restart

### iOS build errors (on Mac)
- Run `pod install` in `frontend/ios/App`
- Update Xcode to latest version

### API not connecting
- Update API URL in your `.env` file
- For Android emulator, use `10.0.2.2` instead of `localhost`
- For iOS simulator, `localhost` works fine

---

## 🎯 Next Steps

1. **Install Android Studio** to test Android app
2. **Customize app icon** and splash screen
3. **Test on real devices** (not just emulators)
4. **Add native features** as needed (camera, push notifications)
5. **Prepare for app store submission**

Your app is ready to go! 🚀
