// Fonction pour mélanger un tableau de manière aléatoire
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// function ajouterAuPanier(product) {
//   // Récupérez le panier actuel depuis localStorage
//   const panier = JSON.parse(localStorage.getItem("panier")) || [];
//   const productId = event.currentTarget.getAttribute("data-id");
//   const product = JSON.parse(event.currentTarget.getAttribute("data-product"));
//   ajouterAuPanier(product);

//   // Ajoutez le produit au panier
//   panier.push(product);

//   // Stockez le panier mis à jour dans localStorage
//   localStorage.setItem("panier", JSON.stringify(panier));

//   console.log(`Produit ajouté au panier : ${product.title}`);
// }

function ajouterAuPanier(event) {
  let focusbutton = event.target;

  let focusProductTitle = focusbutton.getAttribute("data-title");
  let focusProductprice = focusbutton.getAttribute("data-price");
  let focusProductimage = focusbutton.getAttribute("data-image");

  let productObject = {
    title: focusProductTitle,
    price: focusProductprice,
    image: focusProductimage,
  };

  // Récupérez le panier actuel depuis localStorage
  const panier = JSON.parse(localStorage.getItem("panier")) || [];

  // Ajoutez le produit au panier
  panier.push(productObject);

  // Stockez le panier mis à jour dans localStorage
  localStorage.setItem("panier", JSON.stringify(panier));

  console.log(`Produit ajouté au panier : ${focusProductTitle}`);
}

// POP-UP Panier ** Local Storage **
function ouvrirPopupPanier() {
  const popupPanier = document.getElementById("popup-panier");
  const contenuPanier = document.getElementById("contenu-panier");

  // Récupérez le panier depuis localStorage
  const panier = JSON.parse(localStorage.getItem("panier")) || [];
  console.log(panier);

  // Affichez le contenu du panier
  if (panier.length > 0) {
    // Utilisez une liste ou un autre élément pour afficher chaque produit

    const listeProduits = panier.map((product) => {
      return `<div>
                <img class="imagePanier" src=${product.image} alt=${product.title}>
                <span>${product.title}</span>
              </div>`;
    });

    contenuPanier.innerHTML = listeProduits.join("");
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
        <button class="addPanier" onclick="ajouterAuPanier(event)" data-id="${product.id}" data-image =${product.image} data-title =${product.title}  data-price =${product.price}>Ajouter au panier</button>
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
            <button class="addPanier" onclick="ajouterAuPanier(${
              product.id
            })" data-id="${product.id}" data-product='${JSON.stringify(
          product
        )}>Ajouter au panier</button>
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
