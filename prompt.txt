Create a modern, production-ready Progressive Web App (PWA) called **"QuickQR"** that allows users to generate QR codes instantly from links, text, or custom input.

### CORE IDEA

The app should be extremely simple, fast, and user-friendly — similar to how Apple designs products: minimal UI, smooth experience, and instant results.

---

### MAIN FEATURES

1. QR Code Generator

* Input field where user can paste:

  * URL (https links)
  * Text
  * Phone numbers
  * Email
* Generate QR code instantly on button click
* Auto-detect input type (URL, text, etc.)

2. Live Preview

* Show QR code preview in real-time as user types
* Smooth animation when QR updates

3. Download Options

* Allow download as:

  * PNG
  * SVG
* High resolution output

4. Copy Feature

* Copy QR image to clipboard
* Copy original text/link

5. Share Feature

* Share QR via Web Share API (mobile friendly)

---

### UI / UX DESIGN

* Minimal modern UI (inspired by Apple / Stripe)
* Centered layout
* Soft shadows and rounded corners
* Light + Dark mode toggle
* Responsive for mobile and desktop

Colors:

* Primary: #000000
* Secondary: #ffffff
* Accent: #4f46e5 (modern blue)
* Background: subtle gradient or clean white

Typography:

* Clean sans-serif (Inter / SF Pro style)

---

### PWA FEATURES

* Installable on mobile (Add to Home Screen)
* Offline support using Service Workers
* Fast loading (Lighthouse score optimized)
* Cache static assets

Manifest settings:

* Name: QuickQR
* Short name: QRGen
* Display: standalone
* Theme color: dark

---

### ADVANCED FEATURES

1. Custom QR Styling

* Change QR color
* Change background color
* Add logo in center (optional upload)

2. History System (Local Storage)

* Save last 10 generated QR codes
* Show history list
* Click to regenerate

3. Error Handling

* Validate URLs properly
* Show user-friendly error messages

4. Analytics Ready

* Structure code so analytics can be added later

---

### TECH STACK

Frontend:

* React (or Next.js if needed)
* Tailwind CSS for styling

QR Generation:

* Use a reliable QR library (like qrcode.js or similar)

PWA:

* Service Worker
* Web App Manifest

State Management:

* React hooks (no heavy libraries)

---

### PERFORMANCE

* Lazy load components
* Optimize images
* Avoid unnecessary re-renders
* Fast initial load

---

### FILE STRUCTURE

* /components

  * QRGenerator.jsx
  * QRPreview.jsx
  * History.jsx
* /pages

  * Home.jsx
* /utils

  * qrHelpers.js
* /public

  * manifest.json
  * icons

---

### USER FLOW

1. User opens app
2. Sees clean input box
3. Pastes link or text
4. QR appears instantly
5. User downloads or shares

---

### EXTRA TOUCHES

* Add subtle animations (fade, scale)
* Show loading animation for generation
* Add "Generated Successfully" feedback

---

### SECURITY

* Sanitize user input
* Prevent malicious scripts
* No backend required (client-side only)

---

### DEPLOYMENT READY

* Make it ready for:

  * Vercel
  * Netlify

---

### FINAL GOAL

Create a smooth, fast, beautiful QR generator app that:

* Works offline
* Feels premium
* Is extremely easy to use
* Can scale into a bigger SaaS later

---

### BONUS (OPTIONAL)

* Add login system (future-ready)
* Allow saving QR codes to cloud
* Add scan QR using camera

---

Build everything clean, modular, and production-ready with comments explaining key parts of the code.
