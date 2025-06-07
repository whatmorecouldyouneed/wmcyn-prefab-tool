"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Shop;
const react_1 = require("react");
const react_native_1 = require("react-native");
const fetchProducts_1 = require("../shopify/fetchProducts");
// These will be replaced by template processing
const SHOPIFY_DOMAIN = process.env.EXPO_PUBLIC_SHOPIFY_DOMAIN || '';
const SHOPIFY_TOKEN = process.env.EXPO_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || '';
function Shop() {
    const [products, setProducts] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)('');
    (0, react_1.useEffect)(() => {
        (0, fetchProducts_1.fetchShopifyProducts)(SHOPIFY_DOMAIN, SHOPIFY_TOKEN)
            .then(setProducts)
            .catch(() => setError('Failed to load products'))
            .finally(() => setLoading(false));
    }, []);
    if (loading)
        return React.createElement(react_native_1.ActivityIndicator, { size: "large", style: { marginTop: 40 } });
    if (error)
        return React.createElement(react_native_1.Text, { style: styles.error }, error);
    return (React.createElement(react_native_1.FlatList, { data: products, keyExtractor: item => item.id, contentContainerStyle: styles.list, renderItem: ({ item }) => (React.createElement(react_native_1.View, { style: styles.card },
            item.images.edges[0]?.node.src && (React.createElement(react_native_1.Image, { source: { uri: item.images.edges[0].node.src }, style: styles.image })),
            React.createElement(react_native_1.Text, { style: styles.title }, item.title),
            React.createElement(react_native_1.Text, { style: styles.price },
                "$",
                item.variants.edges[0]?.node.price),
            React.createElement(react_native_1.Text, { style: styles.desc }, item.description))) }));
}
const styles = react_native_1.StyleSheet.create({
    list: {
        padding: 16,
        alignItems: 'center',
    },
    card: {
        width: 320,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
        alignItems: 'center',
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 8,
        marginBottom: 12,
        backgroundColor: '#f3f3f3',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    price: {
        fontSize: 16,
        color: '#3b82f6',
        marginBottom: 8,
    },
    desc: {
        fontSize: 14,
        color: '#444',
        textAlign: 'center',
    },
    error: {
        color: '#dc2626',
        marginTop: 40,
        textAlign: 'center',
    },
});
