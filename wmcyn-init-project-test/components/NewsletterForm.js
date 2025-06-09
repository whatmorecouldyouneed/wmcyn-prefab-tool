"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = NewsletterForm;
const react_1 = require("react");
const mailingList_1 = require("../firebase/mailingList");
const NewsletterForm_module_scss_1 = __importDefault(require("./NewsletterForm.module.scss"));
function NewsletterForm() {
    const [email, setEmail] = (0, react_1.useState)('');
    const [status, setStatus] = (0, react_1.useState)('idle');
    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        try {
            await (0, mailingList_1.addToMailingList)(email);
            setStatus('success');
            setEmail('');
        }
        catch (error) {
            setStatus('error');
        }
    };
    return (React.createElement("form", { onSubmit: handleSubmit, className: NewsletterForm_module_scss_1.default.form },
        React.createElement("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "Enter your email", required: true, className: NewsletterForm_module_scss_1.default.input }),
        React.createElement("button", { type: "submit", disabled: status === 'loading', className: NewsletterForm_module_scss_1.default.button }, status === 'loading' ? 'Subscribing...' : 'Subscribe'),
        status === 'success' && (React.createElement("p", { className: `${NewsletterForm_module_scss_1.default.message} ${NewsletterForm_module_scss_1.default.success}` }, "Thanks for subscribing!")),
        status === 'error' && (React.createElement("p", { className: `${NewsletterForm_module_scss_1.default.message} ${NewsletterForm_module_scss_1.default.error}` }, "Something went wrong. Please try again."))));
}
