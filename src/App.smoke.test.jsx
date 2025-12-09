import { render, screen } from '@testing-library/react';
import App from './App.jsx';
import { burstData, rechargeData } from './data/powerbanks/models.js';

const renderAt = (path) => {
  window.history.pushState({}, '', path);
  return render(<App />);
};

describe('App smoke routes', () => {
  it('renders the homepage hero', () => {
    renderAt('/');
    expect(screen.getByText(/Power banks ranked/i)).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /View Scoreboard/i }),
    ).toHaveAttribute('href', '/products');
  });

  it('shows recharge-time data and chart', async () => {
    const { container } = renderAt('/recharge-time');
    expect(
      screen.getByText(/45 Minutes to Boarding/i),
    ).toBeInTheDocument();

    const sampleName = rechargeData[0].name.replace(/\s*\(.*?\)/, '');
    expect(
      await screen.findByText(new RegExp(sampleName, 'i')),
    ).toBeInTheDocument();
    expect(container.querySelector('svg.recharts-surface')).not.toBeNull();
  });

  it('shows burst-recharge data and chart', async () => {
    const { container } = renderAt('/burst-recharge');
    expect(
      screen.getByText(/20 Min Burst Check/i),
    ).toBeInTheDocument();

    const sampleName = burstData[0].name.replace(/\s*\(.*?\)/, '');
    expect(
      await screen.findByText(new RegExp(sampleName, 'i')),
    ).toBeInTheDocument();
    expect(container.querySelector('svg.recharts-surface')).not.toBeNull();
  });

  it('shows the product scores table with burst data', () => {
    renderAt('/products');
    expect(screen.getByText(/Product Scorecard/i)).toBeInTheDocument();

    const productName = burstData[0].name.split(' ')[0];
    expect(screen.getByText(new RegExp(productName, 'i'))).toBeInTheDocument();
    expect(screen.getByText(/Full pack <60 min\?/i)).toBeInTheDocument();
  });
});

