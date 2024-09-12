'use client';
import { OfficeProvider } from './contexts/OfficeContext';

export function Providers({ children }) {
  return <OfficeProvider>{children}</OfficeProvider>;
}
