#!/usr/bin/env node
import * as p from "@clack/prompts";
import { execSync } from "child_process";
import fs from "fs/promises";
import path from "path";
import pc from "picocolors";

// ==========================================
// 1. STATE MANAGEMENT TEMPLATES
// ==========================================
const zustandTemplate = `import { create } from 'zustand';

interface AppState {
  theme: 'light' | 'dark';
  isAuthenticated: boolean;
  setTheme: (theme: 'light' | 'dark') => void;
  setAuth: (isAuth: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  theme: 'dark',
  isAuthenticated: false,
  setTheme: (theme) => set({ theme }),
  setAuth: (isAuthenticated) => set({ isAuthenticated }),
}));
`;

const reduxStoreTemplate = `import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
`;

const reduxSliceTemplate = `import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  isAuthenticated: boolean;
  theme: 'light' | 'dark';
}

const initialState: UserState = {
  isAuthenticated: false,
  theme: 'dark',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    }
  }
});

export const { setAuth, setTheme } = userSlice.actions;
export default userSlice.reducer;
`;

const contextTemplate = `import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AppContextType {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  return (
    <AppContext.Provider value={{ theme, setTheme }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
`;

const mobxTemplate = `import { makeAutoObservable } from 'mobx';

class RootStore {
  theme: 'light' | 'dark' = 'dark';
  isAuthenticated: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  setTheme(theme: 'light' | 'dark') {
    this.theme = theme;
  }

  setAuth(isAuthenticated: boolean) {
    this.isAuthenticated = isAuthenticated;
  }
}

export const rootStore = new RootStore();
`;

// ==========================================
// 2. VALUE BOMB TEMPLATES (POPULATING FOLDERS)
// ==========================================
const buttonTemplate = `import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps } from 'react-native';
import { Colors } from '../../constants/Colors';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary';
}

export const Button = ({ title, variant = 'primary', style, ...props }: ButtonProps) => {
  const isPrimary = variant === 'primary';
  return (
    <TouchableOpacity 
      style={[styles.container, isPrimary ? styles.primary : styles.secondary, style]} 
      {...props}
    >
      <Text style={[styles.text, isPrimary ? styles.textLight : styles.textDark]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  primary: { backgroundColor: Colors.light.primary },
  secondary: { backgroundColor: Colors.light.background, borderWidth: 1, borderColor: Colors.light.primary },
  text: { fontSize: 16, fontWeight: '600' },
  textLight: { color: '#FFF' },
  textDark: { color: Colors.light.primary },
});
`;

const useToggleTemplate = `import { useState, useCallback } from 'react';

export const useToggle = (initialState: boolean = false): [boolean, () => void] => {
  const [state, setState] = useState<boolean>(initialState);
  const toggle = useCallback(() => setState(state => !state), []);
  return [state, toggle];
};
`;

const apiServiceTemplate = `// Basic fetch wrapper for API calls
const BASE_URL = 'https://api.yourdomain.com';

export const apiClient = async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
  try {
    const response = await fetch(\`\${BASE_URL}\${endpoint}\`, {
      headers: { 'Content-Type': 'application/json', ...options?.headers },
      ...options,
    });
    if (!response.ok) throw new Error(response.statusText);
    return await response.json();
  } catch (error) {
    console.error('API Call Error:', error);
    throw error;
  }
};
`;

const formattersTemplate = `export const formatCurrency = (amount: number, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
};

export const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(date);
};
`;

const colorsTemplate = `export const Colors = {
  light: { text: '#111827', background: '#FFFFFF', primary: '#007AFF' },
  dark: { text: '#ECEDEE', background: '#151718', primary: '#0A84FF' },
};
`;

// ==========================================
// 3. NAVIGATION TEMPLATES
// ==========================================
const routesTemplate = `export const Routes = {
  HOME: 'Home',
  AUTH: 'Auth',
  PROFILE: 'Profile',
} as const;

export type RootStackParamList = {
  [Routes.HOME]: undefined;
  [Routes.AUTH]: undefined;
  [Routes.PROFILE]: { userId: string };
};
`;

// ==========================================
// 4. CORE CLI EXECUTION ENGINE
// ==========================================
async function main() {
  console.clear();
  p.intro(pc.bgBlue(pc.black(" 🚀 create-rn-structure ")) + pc.dim(" v1.0.0"));

  const options = await p.group(
    {
      navigation: () =>
        p.select({
          message: "Which navigation architecture are you using?",
          options: [
            {
              value: "expo-router",
              label: "Expo Router (Modern file-based layout)",
            },
            {
              value: "react-navigation",
              label: "React Navigation (Traditional stack-based)",
            },
          ],
        }),
      stateManagement: () =>
        p.select({
          message: "Select your global state management blueprint:",
          options: [
            {
              value: "redux",
              label: "Redux Toolkit (Enterprise standard state slices)",
            },
            {
              value: "zustand",
              label: "Zustand (Recommended - Clean hook-based state slices)",
            },
            {
              value: "mobx",
              label: "MobX (Observable & class-based architecture)",
            },
            {
              value: "context",
              label: "Context API (Native, lightweight context wrappers)",
            },
            { value: "none", label: "None (Keep it strictly structural)" },
          ],
        }),
    },
    {
      onCancel: () => {
        p.cancel("Scaffolding aborted. Catch you later!");
        process.exit(0);
      },
    },
  );

  const s = p.spinner();
  s.start("Generating folder structure matrix...");

  const targetDir = process.cwd();

  try {
    // 1. Define Base Folders (Now includes assets!)
    const baseFolders = [
      "src/assets/images",
      "src/assets/fonts",
      "src/components/common",
      "src/hooks",
      "src/utils",
      "src/constants",
      "src/services",
    ];

    if (options.navigation === "expo-router") {
      baseFolders.push("app");
    } else {
      baseFolders.push(
        "src/navigation",
        "src/screens/Home",
        "src/screens/Auth",
      );
    }

    if (options.stateManagement === "zustand") {
      baseFolders.push("src/store");
    } else if (options.stateManagement === "redux") {
      baseFolders.push("src/store/slices");
    } else if (options.stateManagement === "mobx") {
      baseFolders.push("src/stores");
    } else if (options.stateManagement === "context") {
      baseFolders.push("src/context");
    }

    // 2. Create Directories
    for (const folder of baseFolders) {
      await fs.mkdir(path.join(targetDir, folder), { recursive: true });
    }

    // 3. Inject High-Value Boilerplates
    s.message("Injecting typed boilerplate files...");

    await fs.writeFile(
      path.join(targetDir, "src/constants/Colors.ts"),
      colorsTemplate,
    );
    await fs.writeFile(
      path.join(targetDir, "src/components/common/Button.tsx"),
      buttonTemplate,
    );
    await fs.writeFile(
      path.join(targetDir, "src/hooks/useToggle.ts"),
      useToggleTemplate,
    );
    await fs.writeFile(
      path.join(targetDir, "src/utils/formatters.ts"),
      formattersTemplate,
    );
    await fs.writeFile(
      path.join(targetDir, "src/services/api.ts"),
      apiServiceTemplate,
    );

    // 4. Inject State Management
    if (options.stateManagement === "zustand") {
      await fs.writeFile(
        path.join(targetDir, "src/store/useAppStore.ts"),
        zustandTemplate,
      );
    } else if (options.stateManagement === "redux") {
      await fs.writeFile(
        path.join(targetDir, "src/store/store.ts"),
        reduxStoreTemplate,
      );
      await fs.writeFile(
        path.join(targetDir, "src/store/slices/userSlice.ts"),
        reduxSliceTemplate,
      );
    } else if (options.stateManagement === "context") {
      await fs.writeFile(
        path.join(targetDir, "src/context/AppContext.tsx"),
        contextTemplate,
      );
    } else if (options.stateManagement === "mobx") {
      await fs.writeFile(
        path.join(targetDir, "src/stores/RootStore.ts"),
        mobxTemplate,
      );
    }

    // 5. Inject Navigation Routes
    if (options.navigation === "react-navigation") {
      await fs.writeFile(
        path.join(targetDir, "src/navigation/Routes.ts"),
        routesTemplate,
      );
    }

    // 6. SMART AUTO-INSTALL DEPENDENCIES
    let requiredDeps = [];
    if (options.navigation === "react-navigation") {
      requiredDeps.push(
        "@react-navigation/native",
        "@react-navigation/native-stack",
      );
    }
    if (options.stateManagement === "zustand") requiredDeps.push("zustand");
    if (options.stateManagement === "redux")
      requiredDeps.push("@reduxjs/toolkit", "react-redux");
    if (options.stateManagement === "mobx")
      requiredDeps.push("mobx", "mobx-react-lite");

    let depsToInstall = [];
    try {
      const packageJsonRaw = await fs.readFile(
        path.join(targetDir, "package.json"),
        "utf-8",
      );
      const packageJson = JSON.parse(packageJsonRaw);
      const allExistingDeps = {
        ...(packageJson.dependencies || {}),
        ...(packageJson.devDependencies || {}),
      };

      depsToInstall = requiredDeps.filter((dep) => !allExistingDeps[dep]);
    } catch (e) {
      depsToInstall = requiredDeps;
    }

    if (depsToInstall.length > 0) {
      // UX UPGRADE: Tell the user exactly why it's taking time
      s.message(
        `Libraries missing: ${depsToInstall.join(", ")}. Installing now to make your setup smooth (this may take a minute)...`,
      );

      // EXTREMELY IMPORTANT FIX:
      // Force Node to wait 100ms so the terminal has time to print the message above
      // before 'execSync' freezes the thread to download the packages.
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Run npm install silently for the missing packages
      execSync(`npm install ${depsToInstall.join(" ")}`, {
        stdio: "ignore",
        cwd: targetDir,
      });
    } else if (requiredDeps.length > 0) {
      s.message("All required packages already installed. Skipping download!");
    }

    s.stop(pc.green("Architecture map generated and dependencies verified!"));
    p.outro(
      pc.bgGreen(pc.black(" Success! ")) +
        " Your professional structure is ready. Happy coding!",
    );
  } catch (error) {
    s.stop(pc.red("Generation engine encountered an error."));
    console.error(error);
  }
}

main();
