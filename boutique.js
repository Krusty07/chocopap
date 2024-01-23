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
  let focusProductId = focusbutton.getAttribute("data-id");

  let productObject = {
    title: focusProductTitle,
    price: focusProductprice,
    image: focusProductimage,
    id: focusProductId,
  };

  // Récupérez le panier actuel depuis localStorage
  const panier = JSON.parse(localStorage.getItem("panier")) || [];

  // Vérifiez si l'article est déjà dans le panier
  let existingProduct = panier.find(product => product.id === focusProductId);

  if (existingProduct) {
    // L'article est déjà présent, incrémente la quantité
    existingProduct.qt += 1;
  } else {
    // L'article n'est pas dans le panier, ajoutez-le
    productObject.qt = 1;  // Ajoutez la propriété qt (quantité)
    panier.push(productObject);
  }


  // // Ajoutez le produit au panier
  // panier.push(productObject);

  // Stockez le panier mis à jour dans localStorage
  localStorage.setItem("panier", JSON.stringify(panier));

  ouvrirPopupPanier()

  console.log(`Produit ajouté au panier : ${focusProductTitle}`);
}

function clearCart() {
  localStorage.clear()
  ouvrirPopupPanier()
}

function delElement(event) {
  let delElementBouton = event.target;
  let papa = delElementBouton.parentElement.id

  const panier = JSON.parse(localStorage.getItem("panier")) || [];
  let index = panier.findIndex(product => product.id === papa);

  panier.splice(index, 1)

  localStorage.setItem("panier", JSON.stringify(panier));

  ouvrirPopupPanier()
}

function updateQuantity(productId, newQuantity) {
  const panier = JSON.parse(localStorage.getItem("panier")) || [];
  const productIndex = panier.findIndex((product) => product.id === productId);

  if (productIndex !== -1) {
    panier[productIndex].qt = newQuantity;
    localStorage.setItem("panier", JSON.stringify(panier));
    ouvrirPopupPanier(); // Met à jour le contenu du panier après la modification de la quantité
  }
}



// POP-UP Panier ** Local Storage **
function ouvrirPopupPanier() {
  const popupPanier = document.getElementById("popup-panier");
  const contenuPanier = document.getElementById("contenu-panier");

  // Récupérez le panier depuis localStorage
  const panier = JSON.parse(localStorage.getItem("panier")) || [];

  // Affichez le contenu du panier
  if (panier.length > 0) {
    // Utilisez une liste ou un autre élément pour afficher chaque produit

    const listeProduits = panier.map((product) => {
      return `<div class="productsPanier" id="${product.id}">
                <span class="fa-solid fa-trash" onclick='delElement(event)'>X</span>
                <img class="imagePanier" src=${product.image} alt=${product.title}>
                <span>${product.title}</span>
                <span>${product.price} €</span>
                <input type="number" id="${product.id}-quantity" value="${product.qt}" min="1" max="100" 
                oninput='updateQuantity("${product.id}", this.value)' />
                </div>`;
    });

    contenuPanier.innerHTML = listeProduits.join("");
  } else {
    contenuPanier.innerHTML = "Le panier est vide.";
  }

  popupPanier.style.display = "block";

  // Calcul montant total panier
  let prixTotalCalcul = [];

  for (let m = 0; m < panier.length; m++) {
    let prixProduitsDansLePanier = parseFloat(panier[m].price);
    prixTotalCalcul.push(prixProduitsDansLePanier * panier[m].qt);
  }

  const initialValue = 0;
  const prixTotal = prixTotalCalcul.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    initialValue
  );

  console.log(prixTotal);
  document.getElementById("totalPanier").innerHTML = prixTotal.toFixed(2);

  // Mettez à jour le nombre de produits dans le panier
  const nombreProduitsDansLePanier = panier.reduce((total, product) => total + parseInt(product.qt), 0);
  document.getElementById("nombreProduitsPanier").innerHTML = nombreProduitsDansLePanier;
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
      // Vérifiez si la propriété 'qt' (quantité) existe, sinon attribuez-lui une valeur par défaut
      if (!product.hasOwnProperty('qt')) {
        product.qt = 1;
      }

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
            <button class="addPanier" onclick="ajouterAuPanier(${product.id})" data-id="${product.id}" data-product='${JSON.stringify(product)}>Ajouter au panier</button>
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
