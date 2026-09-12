import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

beforeEach(() => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve([]),
    }),
  );
});

describe('App', () => {
  it('renders the page title', async () => {
    render(<App />);
    expect(screen.getByText('FDE Inventory Console')).toBeInTheDocument();
  });

  it('renders the input fields', async () => {
    render(<App />);
    expect(screen.getByPlaceholderText('Product name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Category')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Quantity')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Price')).toBeInTheDocument();
  });

  it('renders the Add Item button', async () => {
    render(<App />);
    expect(
      screen.getByRole('button', { name: 'Add Item' }),
    ).toBeInTheDocument();
  });

  it('shows empty state when there are no items', async () => {
    render(<App />);
    const emptyMessage = await screen.findByText(
      'No items yet — add your first one above.',
    );
    expect(emptyMessage).toBeInTheDocument();
  });
});
