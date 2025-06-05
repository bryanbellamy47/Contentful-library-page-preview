import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { mockCma, mockSdk } from '../../test/mocks';
import Field from './Field';

vi.mock('@contentful/react-apps-toolkit', () => ({
  useSDK: () => mockSdk,
  useCMA: () => mockCma,
}));

describe('Field component', () => {
  it('Renders preview placeholder', () => {
    const { getByText } = render(<Field />);

    expect(getByText('Loading preview …')).toBeTruthy();
  });
});
