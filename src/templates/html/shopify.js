// This script is only used if Shopify is enabled
window.renderShopifyProducts = async function(domain, token) {
  const section = document.getElementById('shopify-section');
  const container = document.getElementById('shopify-products');
  if (!section || !container) return;
  section.style.display = '';

  const endpoint = `https://${domain}/api/2023-07/graphql.json`;
  const query = `{
    products(first: 8) {
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
  if (!res.ok) {
    container.innerHTML = '<p>Failed to load products.</p>';
    return;
  }
  const json = await res.json();
  const products = json.data.products.edges.map(edge => edge.node);
  container.innerHTML = products.map(product => `
    <div class="product">
      ${product.images.edges[0]?.node.src ? `<img src="${product.images.edges[0].node.src}" alt="${product.title}" />` : ''}
      <h3>${product.title}</h3>
      <p class="price">$${product.variants.edges[0]?.node.price}</p>
      <p>${product.description}</p>
    </div>
  `).join('');
} 