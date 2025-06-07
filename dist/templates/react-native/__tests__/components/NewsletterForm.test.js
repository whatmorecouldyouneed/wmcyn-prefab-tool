"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("@testing-library/react-native");
const NewsletterForm_1 = __importDefault(require("../../components/NewsletterForm"));
// mock the firebase mailing list function
jest.mock('../../firebase/mailingList', () => ({
    addToMailingList: jest.fn()
}));
describe('NewsletterForm', () => {
    it('renders the form correctly', () => {
        const { getByPlaceholderText, getByText } = (0, react_native_1.render)(React.createElement(NewsletterForm_1.default, null));
        expect(getByPlaceholderText('Enter your email')).toBeTruthy();
        expect(getByText('Subscribe')).toBeTruthy();
    });
    it('handles successful subscription', async () => {
        const { addToMailingList } = require('../../firebase/mailingList');
        addToMailingList.mockResolvedValueOnce(undefined);
        const { getByPlaceholderText, getByText } = (0, react_native_1.render)(React.createElement(NewsletterForm_1.default, null));
        const emailInput = getByPlaceholderText('Enter your email');
        const submitButton = getByText('Subscribe');
        react_native_1.fireEvent.changeText(emailInput, 'test@example.com');
        react_native_1.fireEvent.press(submitButton);
        expect(getByText('Subscribing...')).toBeTruthy();
        await (0, react_native_1.waitFor)(() => {
            expect(getByText('Thanks for subscribing!')).toBeTruthy();
        });
        expect(emailInput.props.value).toBe('');
    });
    it('handles subscription error', async () => {
        const { addToMailingList } = require('../../firebase/mailingList');
        addToMailingList.mockRejectedValueOnce(new Error('Failed to subscribe'));
        const { getByPlaceholderText, getByText } = (0, react_native_1.render)(React.createElement(NewsletterForm_1.default, null));
        const emailInput = getByPlaceholderText('Enter your email');
        const submitButton = getByText('Subscribe');
        react_native_1.fireEvent.changeText(emailInput, 'test@example.com');
        react_native_1.fireEvent.press(submitButton);
        await (0, react_native_1.waitFor)(() => {
            expect(getByText('Something went wrong. Please try again.')).toBeTruthy();
        });
    });
});
