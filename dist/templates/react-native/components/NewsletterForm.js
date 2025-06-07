"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = NewsletterForm;
const react_1 = require("react");
const react_native_1 = require("react-native");
const mailingList_1 = require("../firebase/mailingList");
function NewsletterForm() {
    const [email, setEmail] = (0, react_1.useState)('');
    const [status, setStatus] = (0, react_1.useState)('idle');
    const handleSubmit = async () => {
        if (!email)
            return;
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
    return (React.createElement(react_native_1.View, { style: styles.container },
        React.createElement(react_native_1.TextInput, { style: styles.input, value: email, onChangeText: setEmail, placeholder: "Enter your email", keyboardType: "email-address", autoCapitalize: "none", autoComplete: "email" }),
        React.createElement(react_native_1.TouchableOpacity, { style: [styles.button, status === 'loading' && styles.buttonDisabled], onPress: handleSubmit, disabled: status === 'loading' }, status === 'loading' ? (React.createElement(react_native_1.ActivityIndicator, { color: "#fff" })) : (React.createElement(react_native_1.Text, { style: styles.buttonText }, "Subscribe"))),
        status === 'success' && (React.createElement(react_native_1.Text, { style: styles.successMessage }, "Thanks for subscribing!")),
        status === 'error' && (React.createElement(react_native_1.Text, { style: styles.errorMessage }, "Something went wrong. Please try again."))));
}
const styles = react_native_1.StyleSheet.create({
    container: {
        width: '100%',
        maxWidth: 400,
        gap: 12,
    },
    input: {
        width: '100%',
        height: 48,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 8,
        paddingHorizontal: 16,
        fontSize: 16,
    },
    button: {
        width: '100%',
        height: 48,
        backgroundColor: '#3b82f6',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    successMessage: {
        color: '#059669',
        fontSize: 14,
        textAlign: 'center',
    },
    errorMessage: {
        color: '#dc2626',
        fontSize: 14,
        textAlign: 'center',
    },
});
