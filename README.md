# 🚀 CodeSync – Developer Activity Tracker

CodeSync is a powerful developer dashboard built to help you **track, visualize, and stay consistent** with your coding activity across multiple platforms like **GitHub, LeetCode, GFG, Codeforces**, and more.

![CodeSync Preview](./preview.png)

---

## 🛠️ Tech Stack

| Area            | Technology Used                      |
|-----------------|--------------------------------------|
| Frontend        | React, Tailwind CSS, Vite            |
| State Management| React Context API, useState, useEffect |
| Authentication  | Firebase Authentication (Google, GitHub, Email) |
| Database        | Firebase Firestore                   |
| Notifications   | Firebase Cloud Messaging (FCM)       |
| Charts & Graphs | Recharts                             |
| Deployment      | Firebase Hosting + Vercel (for proxy)|
| PWA             | Vite PWA Plugin                      |

---

## 🌟 Key Features

### 🔐 Authentication
- Sign in with Google, GitHub, or Email
- OAuth linking with account detection
- Auth state persistence

### 📈 Dashboard
- Track commits and problem-solving across platforms
- Dynamic streak tracking
- Weekly heatmap visualization
- Streak alerts via push notifications

### 📊 Stats
- Total problems and commits
- Monthly breakdowns
- Switch between **Pie, Bar, Line charts**

### 📝 Log History
- View activity in a responsive, filterable table
- Add manual logs (for offline/unsupported platform work)
- Sync activity via platform APIs and scrape-based services
- Fallback message when activity sync has limitations

### ⚙️ Settings
- Customize tracked platforms
- Update usernames and profile links
- Toggle FCM notifications
- Automatically reset sync logs when usernames change

### 📦 PWA Support
- Installable on mobile/desktop
- Offline-ready shell (though full offline support not required)

---

## 📚 Supported Platforms

- **GitHub** – Commit tracking
- **LeetCode** – Solved problems (recent only)
- **Codeforces** – Submission history
- **GeeksforGeeks (GFG)** – Manual logging
- **More coming soon…**

---

## ⚠️ Limitations
- Most platforms only expose **recent activity** due to rate limits or API constraints.
- Contributions from months back might not sync unless added manually.
- Some functionality (e.g., LeetCode scraping) depends on 3rd-party proxies.

---

## 🧠 Why This Project Matters

- Combines **real-time data** with **manual logging** flexibility
- Integrates multiple services into a clean dashboard
- Encourages consistent coding via **streaks and notifications**
- Mobile-first, dark-mode friendly, and responsive
- Demonstrates **React hooks**, **Firebase**, and **PWA** best practices

---

## 📦 Installation

```bash
git clone https://github.com/your-username/codesync.git
cd codesync
npm install
npm run dev
```

---

Let me know if you want it customized further (e.g., adding badges, contributing guidelines, or a screenshot of your app).