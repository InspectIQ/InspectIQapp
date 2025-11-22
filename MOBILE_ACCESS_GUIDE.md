# Access InspectIQ from Your Phone

## 📱 Quick Setup

Your servers are now configured to accept connections from your phone!

### Your Access URLs:

**Frontend (React App):**
```
http://192.168.1.13:3000
```

**Backend API:**
```
http://192.168.1.13:8000
```

---

## 🔧 How to Connect

### Step 1: Make Sure You're on the Same WiFi
- Your phone must be on the **same WiFi network** as your computer
- Check your phone's WiFi settings
- Should see the same network name as your computer

### Step 2: Open on Your Phone
1. Open your phone's browser (Safari, Chrome, etc.)
2. Type in the address bar: `http://192.168.1.13:3000`
3. Press Go/Enter

### Step 3: Test the App
- Register a new account or login
- Try creating a property
- Test the camera feature!
- Upload photos directly from your phone

---

## 🔥 Windows Firewall (If Connection Fails)

If your phone can't connect, Windows Firewall might be blocking it.

### Allow Node.js and Python:

1. **Open Windows Defender Firewall:**
   - Press Windows key
   - Type "Windows Defender Firewall"
   - Click "Allow an app through Windows Firewall"

2. **Click "Change settings"** (requires admin)

3. **Click "Allow another app..."**

4. **Add Node.js:**
   - Browse to: `C:\Program Files\nodejs\node.exe`
   - Check both "Private" and "Public"
   - Click "Add"

5. **Add Python:**
   - Browse to: `C:\Users\kevin\AppData\Local\Microsoft\WindowsApps\python.exe`
   - Check both "Private" and "Public"
   - Click "Add"

6. **Click "OK"**

### Quick Firewall Rule (Alternative):
Run this in PowerShell as Administrator:
```powershell
New-NetFirewallRule -DisplayName "Node.js Server" -Direction Inbound -Program "C:\Program Files\nodejs\node.exe" -Action Allow
New-NetFirewallRule -DisplayName "Python Server" -Direction Inbound -Program "python" -Action Allow
```

---

## 🧪 Testing Checklist

On your phone, test:
- [ ] Can access http://192.168.1.13:3000
- [ ] Can register/login
- [ ] Can create a property
- [ ] Can create an inspection
- [ ] Camera button appears
- [ ] Can take photos with camera
- [ ] Photos upload successfully
- [ ] Can view uploaded photos

---

## 🚨 Troubleshooting

### "Can't reach this page" or "Connection refused"

**Check 1: Same WiFi?**
- Phone and computer must be on same network
- Check WiFi name on both devices

**Check 2: Servers Running?**
- Frontend should show: `Network: http://192.168.1.13:3000/`
- Backend should be running on port 8000

**Check 3: Firewall?**
- Follow firewall steps above
- Temporarily disable firewall to test

**Check 4: IP Address Changed?**
- Run this to get current IP:
  ```powershell
  Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.IPAddress -like "192.168.*"}
  ```
- Update URL if IP changed

### Camera Not Working

**iOS (iPhone/iPad):**
- Safari works best
- Chrome on iOS may have issues
- Make sure you allow camera permissions

**Android:**
- Chrome works best
- Allow camera permissions when prompted
- Some browsers may not support camera

### Photos Not Uploading

**Check Backend URL:**
- Frontend needs to know backend IP
- May need to update API URL in code

---

## 🔄 Restarting Servers

If you need to restart:

### Frontend:
```bash
cd frontend
npm run dev
```
(Already configured with --host flag)

### Backend:
```bash
python -m uvicorn main:app --reload --host 0.0.0.0
```

---

## 📝 Important Notes

### Security Warning
- `0.0.0.0` means "accept from any IP"
- Only use this on trusted networks (home WiFi)
- Don't use on public WiFi
- For production, use proper security

### IP Address Changes
- Your IP (192.168.1.13) may change
- Happens when router restarts
- Check IP again if connection stops working

### Network Performance
- WiFi speed affects loading
- Photos may take longer to upload
- Use good WiFi signal for best experience

---

## 🎉 You're All Set!

Your InspectIQ app is now accessible from your phone!

**Try these features:**
1. Take photos with your phone's camera
2. Test the mobile-optimized interface
3. Create an inspection on-the-go
4. See the larger touch targets in action

Enjoy testing your app on mobile! 📱✨
