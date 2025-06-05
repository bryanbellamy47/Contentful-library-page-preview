// src/App.tsx  (or App.jsx)

import React from 'react';
import { useSDK } from '@contentful/react-apps-toolkit';
import { F36Provider, GlobalStyles } from '@contentful/f36-components';
// 👇 this file contains the CSS reset + core tokens

import Preview from './components/Preview';

export default function App() {
  const sdk = useSDK();

  return (
    <F36Provider>
      <GlobalStyles />
      <Preview sdk={sdk} />
    </F36Provider>
  );
}