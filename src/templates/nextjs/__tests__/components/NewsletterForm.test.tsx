import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NewsletterForm from '../../components/NewsletterForm';

// mock the firebase mailing list function
jest.mock('../../firebase/mailingList', () => ({
  addToMailingList: jest.fn()
}));

describe('NewsletterForm', () => {
  it('renders the form correctly', () => {
    render(<NewsletterForm />);
    
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Subscribe' })).toBeInTheDocument();
  });

  it('handles successful subscription', async () => {
    const { addToMailingList } = require('../../firebase/mailingList');
    addToMailingList.mockResolvedValueOnce(undefined);

    render(<NewsletterForm />);
    
    const emailInput = screen.getByPlaceholderText('Enter your email');
    const submitButton = screen.getByRole('button', { name: 'Subscribe' });

    await userEvent.type(emailInput, 'test@example.com');
    fireEvent.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(screen.getByText('Subscribing...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Thanks for subscribing!')).toBeInTheDocument();
    });

    expect(emailInput).toHaveValue('');
  });

  it('handles subscription error', async () => {
    const { addToMailingList } = require('../../firebase/mailingList');
    addToMailingList.mockRejectedValueOnce(new Error('Failed to subscribe'));

    render(<NewsletterForm />);
    
    const emailInput = screen.getByPlaceholderText('Enter your email');
    const submitButton = screen.getByRole('button', { name: 'Subscribe' });

    await userEvent.type(emailInput, 'test@example.com');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Something went wrong. Please try again.')).toBeInTheDocument();
    });
  });
}); 