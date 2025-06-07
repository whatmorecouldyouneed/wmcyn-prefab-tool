"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchShopifyProducts = fetchShopifyProducts;
async function fetchShopifyProducts(domain, token) {
    const endpoint = `https://${domain}/api/2023-07/graphql.json`;
    const query = `{
    products(first: 10) {
      edges {
        node {
          id
          title
          description
          images(first: 1) { edges { node { src } } }
          variants(first: 1) { edges { node { price } } }
        }
      }
    }
  }`;
    const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': token,
        },
        body: JSON.stringify({ query }),
    });
    if (!res.ok)
        throw new Error('Failed to fetch products');
    const json = await res.json();
    return json.data.products.edges.map((edge) => edge.node);
}
