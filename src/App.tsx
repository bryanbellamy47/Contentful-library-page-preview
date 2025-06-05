// src/App.tsx
import { locations, AppExtensionSDK } from '@contentful/app-sdk';
import { useSDK } from '@contentful/react-apps-toolkit';
import { useMemo, FunctionComponent } from 'react';

import ConfigScreen from './locations/ConfigScreen';
import Dialog       from './locations/Dialog';
import EntryEditor  from './locations/EntryEditor';
import Field        from './locations/Field';
import Page         from './locations/Page';
import Sidebar      from './locations/Sidebar';
import Home         from './locations/Home';

/**
 * Map every possible location to its React component
 */
const LocationComponents: Record<string, FunctionComponent<any>> = {
  [locations.LOCATION_APP_CONFIG]:   ConfigScreen,
  [locations.LOCATION_ENTRY_FIELD]:  Field,
  [locations.LOCATION_ENTRY_EDITOR]: EntryEditor,
  [locations.LOCATION_DIALOG]:       Dialog,
  [locations.LOCATION_ENTRY_SIDEBAR]:Sidebar,
  [locations.LOCATION_PAGE]:         Page,
  [locations.LOCATION_HOME]:         Home,
};

const App = () => {
  // sdk is strongly typed as AppExtensionSDK
  const sdk = useSDK<AppExtensionSDK>();

  /**
   * Pick the component that matches the current iframe location.
   * useMemo avoids re-evaluating on every render.
   */
  const Component = useMemo(() => {
    return (
      Object.entries(LocationComponents)
        .find(([loc]) => sdk.location.is(loc))?.[1] // returns the matching component
      ?? null
    );
  }, [sdk.location]);

  return Component ? <Component /> : null;
};

export default App;