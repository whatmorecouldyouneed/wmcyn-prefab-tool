"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const user_event_1 = __importDefault(require("@testing-library/user-event"));
const NewsletterForm_1 = __importDefault(require("../../components/NewsletterForm"));
// mock the firebase mailing list function
jest.mock('../../firebase/mailingList', () => ({
    addToMailingList: jest.fn()
}));
describe('NewsletterForm', () => {
    it('renders the form correctly', () => {
        (0, react_1.render)(React.createElement(NewsletterForm_1.default, null));
        expect(react_1.screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
        expect(react_1.screen.getByRole('button', { name: 'Subscribe' })).toBeInTheDocument();
    });
    it('handles successful subscription', async () => {
        const { addToMailingList } = require('../../firebase/mailingList');
        addToMailingList.mockResolvedValueOnce(undefined);
        (0, react_1.render)(React.createElement(NewsletterForm_1.default, null));
        const emailInput = react_1.screen.getByPlaceholderText('Enter your email');
        const submitButton = react_1.screen.getByRole('button', { name: 'Subscribe' });
        await user_event_1.default.type(emailInput, 'test@example.com');
        react_1.fireEvent.click(submitButton);
        expect(submitButton).toBeDisabled();
        expect(react_1.screen.getByText('Subscribing...')).toBeInTheDocument();
        await (0, react_1.waitFor)(() => {
            expect(react_1.screen.getByText('Thanks for subscribing!')).toBeInTheDocument();
        });
        expect(emailInput).toHaveValue('');
    });
    it('handles subscription error', async () => {
        const { addToMailingList } = require('../../firebase/mailingList');
        addToMailingList.mockRejectedValueOnce(new Error('Failed to subscribe'));
        (0, react_1.render)(React.createElement(NewsletterForm_1.default, null));
        const emailInput = react_1.screen.getByPlaceholderText('Enter your email');
        const submitButton = react_1.screen.getByRole('button', { name: 'Subscribe' });
        await user_event_1.default.type(emailInput, 'test@example.com');
        react_1.fireEvent.click(submitButton);
        await (0, react_1.waitFor)(() => {
            expect(react_1.screen.getByText('Something went wrong. Please try again.')).toBeInTheDocument();
        });
    });
});
