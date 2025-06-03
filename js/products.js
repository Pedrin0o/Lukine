// Simulação de Banco de Dados (Pode ser substituído por API)
const products = [
    { id: 1, name: "Pulseira de Ouro", price: 899.90, category: "pulseiras", image: "assets/images/pulseira-ouro.jpg" },
    { id: 2, name: "Brincos de Prata", price: 299.90, category: "brincos", image: "assets/images/brincos-prata.jpg" },
    { id: 3, name: "Colar de Diamante", price: 1499.90, category: "colares", image: "assets/images/colar-diamante.jpg" },
    { id: 4, name: "Anel de Rubi", price: 599.90, category: "aneis", image: "assets/images/anel-rubi.jpg" },
];

// Carregar Produtos na Página Inicial
function loadFeaturedProducts() {
    const featuredContainer = document.getElementById('featured-products');
    featuredContainer.innerHTML = '';

    products.slice(0, 4).forEach(product => {
        featuredContainer.innerHTML += `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>R$ ${product.price.toFixed(2)}</p>
                    <button>Adicionar ao Carrinho</button>
                </div>
            </div>
        `;
    });
}

// Inicialização
document.addEventListener('DOMContentLoaded', loadFeaturedProducts);