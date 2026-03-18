# PetCare Tracker — Setup Guide

A mobile-installable PWA with real-time sync via Firebase (free tier).

## What You Get
- Installable app from a link (no Play Store needed)
- Real-time sync — both team members see updates instantly
- Works offline, syncs when back online
- Browser push notifications for due follow-ups
- Free forever on Firebase free tier (more than enough for 2 users)

---

## Setup Steps (One-Time, ~15 minutes)

### Step 1: Create Firebase Project (Free)

1. Go to https://console.firebase.google.com
2. Click **"Create a project"**
3. Name it something like `petcare-tracker`
4. Disable Google Analytics (not needed) → **Create Project**
5. Once created, click the **web icon (</>)** on the project overview page
6. Register app name: `PetCare Tracker`
7. **Copy the firebaseConfig object** — you'll need it in Step 3

It looks like this:
```js
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "petcare-tracker.firebaseapp.com",
  projectId: "petcare-tracker",
  storageBucket: "petcare-tracker.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

### Step 2: Enable Firestore Database

1. In Firebase Console → left sidebar → **Build → Firestore Database**
2. Click **"Create database"**
3. Choose **Start in test mode** (we'll secure it later)
4. Select the nearest region (e.g., `asia-south1` for India)
5. Click **Enable**

### Step 3: Add Your Firebase Config

Open `index.html` and find this block near line 340:
```js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  ...
};
```
Replace it with the config you copied in Step 1.

### Step 4: Deploy to Firebase Hosting (Free Link)

1. Install Firebase CLI (one-time):
   ```
   npm install -g firebase-tools
   ```

2. Login:
   ```
   firebase login
   ```

3. From the `pet-tracker-app` folder, run:
   ```
   firebase init hosting
   ```
   - Select your project
   - Public directory: `.` (current directory)
   - Single-page app: **Yes**
   - Don't overwrite index.html

4. Deploy:
   ```
   firebase deploy --only hosting
   ```

5. You'll get a link like: `https://petcare-tracker.web.app`

**Share this link** with both team members. On phone, open it in Chrome → tap "Add to Home Screen" → it installs like a native app.

### Step 5: Secure Firestore (Recommended)

In Firebase Console → Firestore → **Rules** tab, replace with:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /teams/{teamId}/{document=**} {
      allow read, write: if true;
    }
  }
}
```

This allows any user with the team code to read/write their team's data. For a 2-person internal tool, this is sufficient.

---

## How to Use

1. Both team members open the app link
2. Enter your name and the **same team code** (e.g., `petcare-mumbai`)
3. Start logging visits — data syncs instantly between both phones
4. Dashboard shows overdue and due follow-ups automatically
5. Browser notifications remind you when follow-up dates arrive

---

## Cost

**$0.** Firebase free tier includes:
- 1 GB Firestore storage
- 50,000 reads/day, 20,000 writes/day
- 10 GB hosting bandwidth/month
- For 2 people tracking 5-6 clinics/day, you'll use less than 1% of the free quota.

---

## Re-deploying After Changes

After editing `index.html`, just run:
```
firebase deploy --only hosting
```
Both users will get the update on next page refresh.
