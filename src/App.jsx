import React from 'react';
import { useSDK } from '@contentful/react-apps-toolkit';
import Preview from './components/Preview';       // ✅ only one import

export default function App() {
  const sdk = useSDK();
  return <Preview sdk={sdk} />;
}