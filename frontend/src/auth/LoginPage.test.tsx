import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { test, expect } from 'vitest';
import { AuthProvider } from './AuthContext';
import { LoginPage } from './LoginPage';

test('shows login form defaults', () => {
  render(
    <MemoryRouter>
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    </MemoryRouter>,
  );

  expect(screen.getByRole('heading', { name: 'Task Tracker' })).toBeInTheDocument();
  expect(screen.getByDisplayValue('demo@example.com')).toBeInTheDocument();
});
