"use client";

import * as React from "react";
import { grants } from "@/lib/mock-data/grants";
import { fiscalYears } from "@/lib/mock-data/users";

interface GrantContextType {
  currentGrantId: string;
  setCurrentGrantId: (id: string) => void;
  currentFiscalYear: string;
  setCurrentFiscalYear: (year: string) => void;
  grants: typeof grants;
  fiscalYears: string[];
}

const GrantContext = React.createContext<GrantContextType | undefined>(undefined);

export function GrantProvider({ children }: { children: React.ReactNode }) {
  const [currentGrantId, setCurrentGrantId] = React.useState("all");
  const [currentFiscalYear, setCurrentFiscalYear] = React.useState("2025");

  return (
    <GrantContext.Provider
      value={{
        currentGrantId,
        setCurrentGrantId,
        currentFiscalYear,
        setCurrentFiscalYear,
        grants,
        fiscalYears,
      }}
    >
      {children}
    </GrantContext.Provider>
  );
}

export function useGrantContext() {
  const context = React.useContext(GrantContext);
  if (!context) {
    throw new Error("useGrantContext must be used within GrantProvider");
  }
  return context;
}
