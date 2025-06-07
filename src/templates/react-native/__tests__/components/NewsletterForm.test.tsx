import { render, fireEvent, waitFor } from '@testing-library/react-native';
import NewsletterForm from '../../components/NewsletterForm';

// mock the firebase mailing list function
jest.mock('../../firebase/mailingList', () => ({
  addToMailingList: jest.fn()
}));

describe('NewsletterForm', () => {
  it('renders the form correctly', () => {
    const { getByPlaceholderText, getByText } = render(<NewsletterForm />);
    
    expect(getByPlaceholderText('Enter your email')).toBeTruthy();
    expect(getByText('Subscribe')).toBeTruthy();
  });

  it('handles successful subscription', async () => {
    const { addToMailingList } = require('../../firebase/mailingList');
    addToMailingList.mockResolvedValueOnce(undefined);

    const { getByPlaceholderText, getByText } = render(<NewsletterForm />);
    
    const emailInput = getByPlaceholderText('Enter your email');
    const submitButton = getByText('Subscribe');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.press(submitButton);

    expect(getByText('Subscribing...')).toBeTruthy();

    await waitFor(() => {
      expect(getByText('Thanks for subscribing!')).toBeTruthy();
    });

    expect(emailInput.props.value).toBe('');
  });

  it('handles subscription error', async () => {
    const { addToMailingList } = require('../../firebase/mailingList');
    addToMailingList.mockRejectedValueOnce(new Error('Failed to subscribe'));

    const { getByPlaceholderText, getByText } = render(<NewsletterForm />);
    
    const emailInput = getByPlaceholderText('Enter your email');
    const submitButton = getByText('Subscribe');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(getByText('Something went wrong. Please try again.')).toBeTruthy();
    });
  });
}); 