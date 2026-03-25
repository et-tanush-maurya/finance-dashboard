import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { DEFAULT_SPLIT_RATIO } from '@/data/mockData';

const SplitRatioContext = createContext(null);

export function SplitRatioProvider({ children }) {
  const [actualSplit, setActualSplit] = useState({ ...DEFAULT_SPLIT_RATIO });
  const [simulatedSplit, setSimulatedSplit] = useState({ ...DEFAULT_SPLIT_RATIO });
  const [isSimulationMode, setIsSimulationMode] = useState(false);

  // The active split is either simulated or actual based on mode
  const activeSplit = useMemo(() => {
    return isSimulationMode ? simulatedSplit : actualSplit;
  }, [isSimulationMode, simulatedSplit, actualSplit]);

  const toggleSimulation = () => {
    if (!isSimulationMode) {
      // When entering simulation mode, start with current actual values
      setSimulatedSplit({ ...actualSplit });
    }
    setIsSimulationMode(!isSimulationMode);
  };

  const updateSimulatedSplit = (icpPercentage) => {
    setSimulatedSplit({
      icp: icpPercentage,
      dalil: 100 - icpPercentage
    });
  };

  const updateActualSplit = (icpPercentage) => {
    setActualSplit({
      icp: icpPercentage,
      dalil: 100 - icpPercentage
    });
  };

  // Calculate shares based on active split
  const calculateShares = useCallback((revenue) => {
    const icpShare = Math.round((revenue * (activeSplit.icp / 100)) * 100) / 100;
    const dalilShare = Math.round((revenue - icpShare) * 100) / 100;
    return { icpShare, dalilShare };
  }, [activeSplit]);

  const value = {
    actualSplit,
    simulatedSplit,
    activeSplit,
    isSimulationMode,
    toggleSimulation,
    updateSimulatedSplit,
    updateActualSplit,
    calculateShares
  };

  return (
    <SplitRatioContext.Provider value={value}>
      {children}
    </SplitRatioContext.Provider>
  );
}

export function useSplitRatio() {
  const context = useContext(SplitRatioContext);
  if (!context) {
    throw new Error('useSplitRatio must be used within a SplitRatioProvider');
  }
  return context;
}
