import { render, screen, within } from '@testing-library/react';
import App from './App';

test('renders local ai interface', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /tu asistente inteligente/i })).toBeInTheDocument();

  const modeSelector = screen.getByLabelText(/selector de modo/i);
  expect(within(modeSelector).getByRole('button', { name: /chat/i })).toBeInTheDocument();
  expect(within(modeSelector).getByRole('button', { name: /imagen/i })).toBeInTheDocument();
  expect(within(modeSelector).getByRole('button', { name: /video/i })).toBeInTheDocument();
});
