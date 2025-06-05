// src/index.tsx  ← must be .tsx so JSX is allowed
import { createRoot } from 'react-dom/client';
import { GlobalStyles } from '@contentful/f36-components';
import { SDKProvider } from '@contentful/react-apps-toolkit';

import App from './App';

const root = createRoot(document.getElementById('root')!);

root.render(
  <SDKProvider>
    <GlobalStyles />  {/* Forma 36 reset & design tokens */}
    <App />
  </SDKProvider>
);