import { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { fetchShopifyProducts } from '../shopify/fetchProducts';

// These will be replaced by template processing
const SHOPIFY_DOMAIN = process.env.EXPO_PUBLIC_SHOPIFY_DOMAIN || '';
const SHOPIFY_TOKEN = process.env.EXPO_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || '';

export default function Shop() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchShopifyProducts(SHOPIFY_DOMAIN, SHOPIFY_TOKEN)
      .then(setProducts)
      .catch(() => setError('Failed to load products'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;
  if (error) return <Text style={styles.error}>{error}</Text>;

  return (
    <FlatList
      data={products}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <View style={styles.card}>
          {item.images.edges[0]?.node.src && (
            <Image source={{ uri: item.images.edges[0].node.src }} style={styles.image} />
          )}
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.price}>${item.variants.edges[0]?.node.price}</Text>
          <Text style={styles.desc}>{item.description}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
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