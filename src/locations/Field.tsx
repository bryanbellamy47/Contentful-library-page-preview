// src/locations/Field.tsx               ← runs inside the entry-field iframe
import { GlobalStyles } from '@contentful/f36-components';
import { useSDK } from '@contentful/react-apps-toolkit';
import type { FieldAppSDK } from '@contentful/app-sdk';

import Preview from '../components/Preview';

const Field = () => {
  const sdk = useSDK<FieldAppSDK>();
  if (!sdk) return null;

  return (
    <>
      <GlobalStyles />   {/* ← inject F36 reset & tokens into THIS iframe */}
      <Preview sdk={sdk} />
    </>
  );
};

export default Field;