function addCart() {
  console.log("hello");
}

// Fonction pour mélanger un tableau de manière aléatoire
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
function ajouterAuPanier(productId) {
  // Récupérez le panier actuel depuis localStorage
  const panier = JSON.parse(localStorage.getItem("panier")) || [];

  // Ajoutez l'identifiant du produit au panier
  panier.push(productId);

  // Stockez le panier mis à jour dans localStorage
  localStorage.setItem("panier", JSON.stringify(panier));

  console.log(`Produit ajouté au panier avec l'identifiant ${productId}`);
}

// POP-UP Panier ** Local Storage **
function ouvrirPopupPanier() {
  const popupPanier = document.getElementById("popup-panier");
  const contenuPanier = document.getElementById("contenu-panier");

  // Récupérez le panier depuis localStorage
  const panier = JSON.parse(localStorage.getItem("panier")) || [];

  // Affichez le contenu du panier
  if (panier.length > 0) {
    contenuPanier.innerHTML = "Produits dans le panier : " + panier.join(", ");
  } else {
    contenuPanier.innerHTML = "Le panier est vide.";
  }

  popupPanier.style.display = "block";
}

// Fonction pour fermer le popup du panier
function fermerPopupPanier() {
  const popupPanier = document.getElementById("popup-panier");
  popupPanier.style.display = "none";
}

// Sélectionnez tous les boutons "Ajouter au panier"
const addPanierButtons = document.querySelectorAll(".addPanier");

// Ajoutez un gestionnaire d'événements à chaque bouton
addPanierButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    // Récupérez l'identifiant unique du produit associé au bouton
    const productId = event.currentTarget.getAttribute("data-id");

    // // Ajoutez le produit au panier (vous devrez implémenter cette fonction)
    // ajouterAuPanier(productId);
  });
});

// Récupérer les produits via Fetch
fetch("products.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error(
        `Status de la réponse: ${response.status} (${response.statusText})`
      );
    }
    return response.json();
  })
  .then((data) => {
    // Mélanger les produits de manière aléatoire
    const shuffledProducts = shuffleArray(data);

    // Afficher les produits dans le conteneur
    const productContainer = document.getElementById("product-container");
    shuffledProducts.forEach((product) => {
      const productElement = document.createElement("span");
      productElement.innerHTML = `
      <div class="Card">
        <img class="imageCard" src=${product.image}>
        <p>${product.title}</p>
        <p>${product.price} €</p>
        <p>Note: ${product.note}</p>
        <button class="addPanier" onclick="ajouterAuPanier(${product.id})" data-id="${product.id}">Ajouter au panier</button>
        </div>
      `;
      productContainer.appendChild(productElement);
    });

    // Fonction appelée lorsque la case à cocher est cochée ou décochée
    function filtrerProduits() {
      // Récupérer les valeurs des filtres
      const checkboxCategories =
        document.querySelectorAll(".category-checkbox");

      const selectedValues = Array.from(checkboxCategories)
        .filter((checkbox) => checkbox.checked)
        .map((checkbox) => checkbox.id);

      const prixMin =
        parseFloat(document.getElementById("prix-min").value) || 0;
      const prixMax =
        parseFloat(document.getElementById("prix-max").value) || Infinity;

      const noteMin = parseInt(document.getElementById("note-min").value) || 1;
      const noteMax = parseInt(document.getElementById("note-max").value) || 5;

      // Filtrer les produits en fonction des critères sélectionnés
      const produitsFiltres = shuffledProducts.filter((product) => {
        const categorieMatch =
          selectedValues.length === 0 ||
          selectedValues.some((category) => product.category[category]);
        const prixMatch = product.price >= prixMin && product.price <= prixMax;
        const noteMatch = product.note >= noteMin && product.note <= noteMax;

        return categorieMatch && prixMatch && noteMatch;
      });

      // Effacer le contenu du conteneur
      const productContainer = document.getElementById("product-container");
      productContainer.innerHTML = "";

      // Afficher les produits filtrés dans le conteneur
      produitsFiltres.forEach((product) => {
        const productElement = document.createElement("span");
        productElement.classList.add("product");
        productElement.innerHTML = `
          <div class="Card">
            <img class="imageCard" src=${product.image}>
            <p>${product.title}</p>
            <p>${product.price} €</p>
            <p>Note: ${product.note}</p>
            <button class="addPanier" onclick="ajouterAuPanier(${product.id})" data-id="${product.id}">Ajouter au panier</button>
            </div>
        `;
        productContainer.appendChild(productElement);
      });
    }

    // Ajouter un gestionnaire d'événements à chaque case à cocher
    const checkboxCategories = document.querySelectorAll(".category-checkbox");
    checkboxCategories.forEach((checkbox) => {
      checkbox.addEventListener("change", filtrerProduits);
    });

    // Ajouter un gestionnaire d'événements aux filtres supplémentaires
    const prixMinInput = document.getElementById("prix-min");
    const prixMaxInput = document.getElementById("prix-max");
    const noteMinSelect = document.getElementById("note-min");
    const noteMaxSelect = document.getElementById("note-max");

    [prixMinInput, prixMaxInput, noteMinSelect, noteMaxSelect].forEach(
      (element) => {
        element.addEventListener("input", filtrerProduits);
      }
    );
  })
  .catch((error) => {
    console.error("Erreur lors de la requête fetch:", error);
  });

// Fonction pour ajouter un produit au panier (à implémenter)
// function ajouterAuPanier(productId) {
//   // Vous devrez ajouter la logique pour ajouter le produit au panier ici
//   // Par exemple, enregistrer l'identifiant du produit dans un tableau ou un objet
//   console.log(`Produit ajouté au panier avec l'identifiant ${productId}`);
// }
