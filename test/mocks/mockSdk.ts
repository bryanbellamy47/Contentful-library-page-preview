import { vi } from 'vitest';

const mockSdk: any = {
  app: {
    onConfigure: vi.fn(),
    getParameters: vi.fn().mockReturnValueOnce({}),
    setReady: vi.fn(),
    getCurrentState: vi.fn(),
  },
  window: {
    startAutoResizer: vi.fn(),
    updateHeight: vi.fn(),
  },
  ids: {
    app: 'test-app',
  },
};

export { mockSdk };
