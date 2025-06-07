import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Button } from 'react-native';
import NewsletterForm from './components/NewsletterForm';
import Shop from './screens/Shop';
import { useState } from 'react';

const SHOPIFY_ENABLED = Boolean(process.env.EXPO_PUBLIC_SHOPIFY_DOMAIN && process.env.EXPO_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN);

export default function App() {
  const [showShop, setShowShop] = useState(false);

  if (SHOPIFY_ENABLED && showShop) {
    return <Shop />;
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <NewsletterForm />
      {SHOPIFY_ENABLED && (
        <Button title="View Shop" onPress={() => setShowShop(true)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
}); 