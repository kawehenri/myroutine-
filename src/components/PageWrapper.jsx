import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

export default function PageWrapper({ children }) {
  useKeyboardShortcuts();
  return children;
}

