<div align="center">

# 🚀 create-rn-structure

**The Ultimate Zero-Friction React Native & Expo Scaffolding Engine.**

[![npm version](https://img.shields.io/npm/v/create-rn-structure.svg?style=for-the-badge&color=007AFF)](https://www.npmjs.com/package/create-rn-structure)
[![Downloads](https://img.shields.io/npm/dt/create-rn-structure.svg?style=for-the-badge&color=007AFF)](https://www.npmjs.com/package/create-rn-structure)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

_Stop wasting 45 minutes manually creating folders, writing boilerplate, and installing Redux every time you start a new app._

</div>

---

## 🛑 Wait. Are you still building folder structures by hand?

Every time you initialize a new React Native or Expo project, you spend precious time deleting default files, creating `src/components`, setting up your state management, typing your hooks, configuring your routes, and waiting for dependencies to install.

Top-tier engineers don't write boilerplate. They automate it.

**`create-rn-structure`** is a lightning-fast, state-aware CLI that instantly transforms your empty directory into a **production-ready, enterprise-grade architecture** in under 5 seconds.

---

## 📸 See it in action

![Terminal UI Demo](https://res.cloudinary.com/dxvco4okv/image/upload/v1779711147/Video1_h0abwp.gif)

---

## ⚡ Instant Quick Start (Zero Config)

No global installations. No messy dependencies. Just run this command at the root of your fresh React Native or Expo project:

```bash
npx create-rn-structure
```

---

## 🔥 Why This is a Total Game Changer

This isn't just a script that creates empty folders. It is a highly intelligent generation engine that injects fully-typed, production-ready code directly into your project.

---

## 🧠 1. Smart Auto-Installer (It reads your mind)

Selected Redux Toolkit but forgot to install it? No problem. The CLI reads your `package.json`. If you are missing required libraries for your chosen stack, it installs them for you automatically in the background. If you already have them, it skips the download instantly to save you time.

---

## 🗺️ 2. Modern Navigation Native

Whether you are building a legacy app or looking to the future, we have you covered out of the box:

- **Expo Router:** Automatically generates the modern `app/` directory layout for file-based routing.
- **React Navigation:** Generates a fully typed `Routes.ts` enum and traditional screen structures.

---

## 🏦 3. Enterprise State Management

Choose your weapon. The CLI instantly wires up the boilerplate, types, and hooks for the industry's most powerful state managers:

- **Redux Toolkit:** Generates a pre-configured `store.ts` and strongly-typed `userSlice.ts`.
- **Zustand:** Drops in a lightweight, hook-based `useAppStore.ts`.
- **MobX:** Generates an observable, class-based `RootStore.ts`.
- **Context API:** Creates a native `AppContext.tsx` with pre-built provider wrappers.

---

## 💣 4. The "Value Bomb" Templates (No Empty Folders!)

Empty folders are useless. We populate your new architecture with high-value, reusable TypeScript assets so you never start from zero:

- ✅ A fully styled, typed `<Button />` component.
- ✅ A highly useful `useToggle` custom hook.
- ✅ An `api.ts` fetch wrapper for your network requests.
- ✅ A global `Colors.ts` constants file with Dark Mode support built-in.

---

## 🏗️ What It Builds

Here is a glimpse of the clean, scalable architecture generated instantly on your machine:

![Terminal UI Demo](https://res.cloudinary.com/dxvco4okv/image/upload/v1779711261/Video2_gojk5e.gif)

```plaintext
your-app/
├── 📁 app/                 <-- (If using Expo Router)
├── 📁 src/
│   ├── 📁 assets/
│   │   ├── 🖼️ images/
│   │   └── 🔤 fonts/
│   ├── 📁 components/
│   │   └── 📁 common/
│   │       └── ⚛️ Button.tsx (Fully Typed!)
│   ├── 📁 constants/
│   │   └── 🎨 Colors.ts (Dark Mode Ready)
│   ├── 📁 hooks/
│   │   └── 🪝 useToggle.ts
│   ├── 📁 navigation/      <-- (If using React Navigation)
│   │   └── 🗺️ Routes.ts
│   ├── 📁 services/
│   │   └── 🌐 api.ts
│   ├── 📁 store/           <-- (Pre-configured RTK, Zustand, Context, or MobX!)
│   └── 📁 utils/
│       └── 🛠️ formatters.ts
```

---

## 📸 The Result

A clean, scalable, enterprise-grade React Native architecture generated instantly so you can focus on building features instead of wasting time on repetitive setup.

---

## 🤝 Contributing

Love this tool? Want to add a new state manager or template? Pull requests are highly welcome!
