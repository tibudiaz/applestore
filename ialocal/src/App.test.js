import { render, screen, within } from '@testing-library/react';
import App from './App';

test('renders chat focused interface with mode selector', () => {
  render(<App />);

  expect(
    screen.getByRole('heading', { name: /interfaz conversacional con controles de recursos/i })
  ).toBeInTheDocument();

  const modeSelector = screen.getByLabelText(/selector de modo/i);
  expect(within(modeSelector).getByRole('button', { name: /chat/i })).toBeInTheDocument();
  expect(within(modeSelector).getByRole('button', { name: /imagen/i })).toBeInTheDocument();
  expect(within(modeSelector).getByRole('button', { name: /video/i })).toBeInTheDocument();

  expect(screen.getByLabelText(/toggle imagen/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/toggle video/i)).toBeInTheDocument();
});
