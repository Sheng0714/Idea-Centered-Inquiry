import React, { createContext, useState } from 'react';

export const ModeContext = createContext();

export const ModeProvider = ({ children }) => {
  const [isMapBoard, setIsMapBoard] = useState(true);

  const updateBoardMode = (mode) => {
    setIsMapBoard(mode);
  };

  return (
    <ModeContext.Provider value={{ isMapBoard, updateBoardMode }}>
      {children}
    </ModeContext.Provider>
  );
};
