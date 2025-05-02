// /types/layoutTypes.ts
import { AppProps } from 'next/app';

export const LayoutType = {
  Guest: "guest",
  Auth : "auth",
  App: "app",
  Admin: "admin",
  None: "none",
} as const;

export type LayoutType = typeof LayoutType[keyof typeof LayoutType];

export interface LayoutProps extends AppProps {
  layoutType: LayoutType;
}
