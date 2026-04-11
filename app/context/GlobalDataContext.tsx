"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the shape of our global data
export interface GlobalDataState {
  targets: any[];
  assets: any[];
  services: any[];
  ports: any[];
}

interface GlobalDataContextType {
  data: GlobalDataState;
  setTargets: (targets: any[]) => void;
  setAssets: (assets: any[]) => void;
  setServices: (services: any[]) => void;
  setPorts: (ports: any[]) => void;
}

// Initial placeholder data (can be replaced with an empty array later)
const defaultState: GlobalDataState = {
  targets: [],
  // Adding some initial mock data so we can see it working immediately
  assets: Array(142).fill({ id: 1, name: "Asset" }),
  services: [],
  ports: [],
};

const GlobalDataContext = createContext<GlobalDataContextType | undefined>(undefined);

export function GlobalDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<GlobalDataState>(defaultState);

  const setTargets = (targets: any[]) => setData((prev) => ({ ...prev, targets }));
  const setAssets = (assets: any[]) => setData((prev) => ({ ...prev, assets }));
  const setServices = (services: any[]) => setData((prev) => ({ ...prev, services }));
  const setPorts = (ports: any[]) => setData((prev) => ({ ...prev, ports }));

  return (
    <GlobalDataContext.Provider
      value={{
        data,
        setTargets,
        setAssets,
        setServices,
        setPorts,
      }}
    >
      {children}
    </GlobalDataContext.Provider>
  );
}

// Hook to use the global context easily
export function useGlobalData() {
  const context = useContext(GlobalDataContext);
  if (context === undefined) {
    throw new Error("useGlobalData must be used within a GlobalDataProvider");
  }
  return context;
}
