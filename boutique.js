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
        <button class="addPanier">Ajouter au panier</button>
      </div>
      `;
      productContainer.appendChild(productElement);
    });

    // Fonction appelée lorsque la case à cocher est cochée ou décochée
    function filtrerProduits() {
      // Récupérer les valeurs des filtres
      const checkboxCategories =
        document.querySelectorAll(".category-checkbox");
      const selectedCategories = Array.from(checkboxCategories)
        .filter((checkbox) => checkbox.checked)
        .map((checkbox) => checkbox.value);

      const prixMin =
        parseFloat(document.getElementById("prix-min").value) || 0;
      const prixMax =
        parseFloat(document.getElementById("prix-max").value) || Infinity;

      const noteMin = parseInt(document.getElementById("note-min").value) || 1;
      const noteMax = parseInt(document.getElementById("note-max").value) || 5;

      // Filtrer les produits en fonction des critères sélectionnés
      const produitsFiltres = shuffledProducts.filter((product) => {
        const categorieMatch =
          selectedCategories.length === 0 ||
          selectedCategories.some((category) => product.category[category]);
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
            <button class="addPanier">Ajouter au panier</button>
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
