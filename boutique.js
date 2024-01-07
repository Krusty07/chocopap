// boutique.js

// Fonction pour mélanger un tableau de manière aléatoire
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

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

    // Fonction appelée lorsqu'une case à cocher est cochée ou décochée
    function filtrerProduits() {
      const checkboxCategories =
        document.querySelectorAll(".category-checkbox");
      const selectedCategories = Array.from(checkboxCategories)
        .filter((checkbox) => checkbox.checked)
        .map((checkbox) => checkbox.value);

      //   const prixMin =
      //     parseFloat(document.getElementById("prix-min").value) || 0;
      //   const prixMax =
      //     parseFloat(document.getElementById("prix-max").value) || Infinity;

      //   const noteMin = parseInt(document.getElementById("note-min").value) || 1;
      //   const noteMax = parseInt(document.getElementById("note-max").value) || 5;

      // Filtrer les produits en fonction des critères sélectionnés
      const produitsFiltres = shuffledProducts.filter((product) => {
        const categorieMatch =
          selectedCategories.length === 0 ||
          selectedCategories.some((category) => product.category[category]);
        // const prixMatch = product.price >= prixMin && product.price <= prixMax;
        // const noteMatch = product.note >= noteMin && product.note <= noteMax;

        // return categorieMatch && prixMatch && noteMatch;
      });

      // Effacer le contenu du conteneur
      const productContainer = document.getElementById("product-container");
      productContainer.innerHTML = "";

      // Afficher les produits filtrés dans le conteneur
      produitsFiltres.forEach((product) => {
        const productElement = document.createElement("div");
        productElement.classList.add("product");
        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.title}" class="product-image">
            <h3 class="product-title">${product.title}</h3>
            <p class="product-price">${product.price} €</p>
            <p class="product-note">Note: ${product.note}</p>
            <p class="product-description">${product.description}</p>
            <p class="product-ingredients">${product.ingredients}</p>
            <button class="add-to-cart">Ajouter au panier</button>
          `;
        productContainer.appendChild(productElement);
      });
    }

    // Créer une case à cocher pour chaque catégorie
    const categories = Object.keys(data[0].category);
    const filtersContainer = document.getElementById("filter");

    categories.forEach((category) => {
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = category;
      checkbox.id = `ch-${category}`;
      checkbox.className = "category-checkbox";
      checkbox.addEventListener("change", filtrerProduits);

      const label = document.createElement("label");
      label.htmlFor = `ch-${category}`;
      label.innerText = category;

      // Ajouter les cases à cocher au conteneur de filtres
      filtersContainer.appendChild(checkbox);
      filtersContainer.appendChild(label);
    });

    // Ajouter des événements pour les filtres supplémentaires
    const prixMinInput = document.getElementById("prix-min");
    const prixMaxInput = document.getElementById("prix-max");
    const noteMinSelect = document.getElementById("note-min");
    const noteMaxSelect = document.getElementById("note-max");

    // [prixMinInput, prixMaxInput, noteMinSelect, noteMaxSelect].forEach(
    //   (element) => {
    //     element.addEventListener("input", filtrerProduits);
    //   }
    // );

    // Afficher tous les produits au chargement initial
    filtrerProduits();
  })
  .catch((error) => {
    console.error("Erreur lors de la requête fetch:", error);
  });
