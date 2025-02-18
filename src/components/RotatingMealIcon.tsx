import React, { useState, useEffect } from 'react';
import BreakfastDiningIcon from '@mui/icons-material/BreakfastDining';
import LunchDiningIcon from '@mui/icons-material/LunchDining';
import DinnerDiningIcon from '@mui/icons-material/DinnerDining';

export const RotatingMealIcon = () => {
  const [currentIcon, setCurrentIcon] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIcon((current) => (current + 1) % 3);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  switch (currentIcon) {
    case 0:
      return <BreakfastDiningIcon />;
    case 1:
      return <LunchDiningIcon />;
    case 2:
      return <DinnerDiningIcon />;
    default:
      return <BreakfastDiningIcon />;
  }
}; 