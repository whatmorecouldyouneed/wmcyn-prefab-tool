"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = App;
const expo_status_bar_1 = require("expo-status-bar");
const react_native_1 = require("react-native");
const NewsletterForm_1 = __importDefault(require("./components/NewsletterForm"));
const Shop_1 = __importDefault(require("./screens/Shop"));
const react_1 = require("react");
const SHOPIFY_ENABLED = Boolean(process.env.EXPO_PUBLIC_SHOPIFY_DOMAIN && process.env.EXPO_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN);
function App() {
    const [showShop, setShowShop] = (0, react_1.useState)(false);
    if (SHOPIFY_ENABLED && showShop) {
        return React.createElement(Shop_1.default, null);
    }
    return (React.createElement(react_native_1.View, { style: styles.container },
        React.createElement(expo_status_bar_1.StatusBar, { style: "auto" }),
        React.createElement(NewsletterForm_1.default, null),
        SHOPIFY_ENABLED && (React.createElement(react_native_1.Button, { title: "View Shop", onPress: () => setShowShop(true) }))));
}
const styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
});
