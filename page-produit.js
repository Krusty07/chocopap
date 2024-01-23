// Fonction pour extraire les paramètres de l'URL
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// Récupérer l'ID du produit à partir de l'URL
const productId = getParameterByName('id');

// Fonction pour charger les détails du produit à partir de products.json
function loadProductDetails(productId) {
    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            // Trouver le produit avec l'ID correspondant
            const product = data.find(product => product.id === productId);

            // Mettre à jour le contenu de la page avec les détails du produit
            const productDetailsContainer = document.getElementById('product-details');
            if (product) {
                productDetailsContainer.innerHTML = `
                <div class="topProduct">
                    <img src="${product.image}" alt="${product.title}" width="300" height="300">
                    <div class="infosProduct">
                        <h1>${product.title}</h1>
                        <p>${product.price} €</p>
                        <p>${product.description}</p>
                        <div class="addCart">
                            <input type="number" id="${product.id}-quantity" value="${product.qt}" min="1" max="100" 
                            oninput='updateQuantity("${product.id}", this.value)' />
                            <button class="addPanier" onclick="ajouterAuPanier(event)" data-id="${product.id}" data-image=${product.image} data-title=${product.title} data-price=${product.price}>Ajouter au panier</button>
                        </div>
                    </div>
                </div>
                <div class="bottomProduct">
                     <h2>Ingrédients</h1>
                     <p>${product.ingredients}</p>
                </div>    
                   
            `;
            } else {
                productDetailsContainer.innerHTML = '<p>Produit non trouvé.</p>';
            }
        })
        .catch(error => {
            console.error('Erreur lors du chargement des détails du produit:', error);
        });
}

// Appeler la fonction pour charger les détails du produit avec l'ID extrait de l'URL
loadProductDetails(productId);