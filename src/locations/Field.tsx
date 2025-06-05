// src/locations/Field.tsx
import { useSDK } from '@contentful/react-apps-toolkit';
import type { FieldAppSDK } from '@contentful/app-sdk';
import Preview from '../components/Preview';

const Field = () => {
  const sdk = useSDK<FieldAppSDK>();
  return sdk ? <Preview sdk={sdk} /> : null;
};

export default Field;