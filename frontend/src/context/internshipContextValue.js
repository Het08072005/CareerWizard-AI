import { createContext, useContext } from 'react';

export const InternshipContext = createContext(null);

export function useInternship() {
  const value = useContext(InternshipContext);
  if (!value) throw new Error('useInternship must be used within InternshipProvider');
  return value;
}
