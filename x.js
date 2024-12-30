(() => {
  const jsonURL =
    "https://gist.githubusercontent.com/sevindi/5765c5812bbc8238a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/products.json";

  // Local storage kullanılabilir mi diye bakıyoruz.
  const isLocalStorageAvailable = () => {
    try {
      const test = "__test__";
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  };

  // Favorilenmişleri alıyoruz.
  const getFavorites = () => {
    if (!isLocalStorageAvailable()) {
      return [];
    }
    return JSON.parse(localStorage.getItem("favorites")) || [];
  };

  // Favorileri kaydediyoruz.
  const saveFavorites = (favorites) => {
    if (isLocalStorageAvailable()) {
      localStorage.setItem("favorites", JSON.stringify(favorites));
    }
  };

  // Favori durumunu kontrol ediyoruz.
  const isFavorite = (productId) => getFavorites().includes(productId);

  // Favori durumu değiştiriyoruz.
  const toggleFavorite = (productId) => {
    const favorites = getFavorites();
    if (favorites.includes(productId)) {
      saveFavorites(favorites.filter((id) => id !== productId));
    } else {
      favorites.push(productId);
      saveFavorites(favorites);
    }
  };

  // HTML yapısını oluşturuyoruz.
  document.body.innerHTML = `
        <div class="product-detail"></div>
    `;

  // Karusel için HTML oluşturuyoruz.
  const buildHTML = (products) => {
    const container = document.createElement("div");
    container.className = "carousel-container";

    const track = document.createElement("div");
    track.className = "carousel-track";

    products.forEach((product) => {
      const productCard = document.createElement("div");
      productCard.className = "carousel-item";
      productCard.innerHTML = `
                <img src="${product.img}" alt="${product.name}" />
                <h3>${product.name}</h3>
                <p>${product.price.toFixed(2)} TL</p>
                <button class="favorite-btn ${
                  isFavorite(product.id) ? "favorited" : ""
                }" data-id="${product.id}">❤</button>
            `;
      productCard.addEventListener("click", (e) => {
        if (!e.target.classList.contains("favorite-btn")) {
          window.open(product.url, "_blank");
        }
      });
      track.appendChild(productCard);
    });

    container.appendChild(track);

    const leftButton = document.createElement("button");
    leftButton.className = "carousel-btn left";
    leftButton.textContent = "❮";

    const rightButton = document.createElement("button");
    rightButton.className = "carousel-btn right";
    rightButton.textContent = "❯";

    container.appendChild(leftButton);
    container.appendChild(rightButton);

    document.querySelector(".product-detail").appendChild(container);
  };

  // Gerekli CSS kodlarını ekliyoruz.
  const buildCSS = () => {
    const css = `
            .carousel-container {
                position: relative;
                overflow: hidden;
                width: 100%;
                margin: 20px auto;
            }
            .carousel-track {
                display: flex;
                transition: transform 0.3s ease-in-out;
            }
            .carousel-item {
                min-width: calc(100% / 6.5);
                box-sizing: border-box;
                padding: 10px;
                text-align: center;
            }
            .carousel-item img {
                width: 100%;
                border-radius: 5px;
            }
            .carousel-item p {
                margin: 5px 0;
                font-size: 1rem;
                color: #555;
            }
            .favorite-btn {
                border: none;
                background: none;
                cursor: pointer;
                font-size: 1.5rem;
                color: gray;
            }
            .favorite-btn.favorited {
                color: red;
            }
            .carousel-btn {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                background: rgba(0, 0, 0, 0.5);
                border: none;
                color: white;
                font-size: 2rem;
                cursor: pointer;
                z-index: 10;
            }
            .carousel-btn.left {
                left: 10px;
            }
            .carousel-btn.right {
                right: 10px;
            }
        `;
    const style = document.createElement("style");
    style.innerHTML = css;
    document.head.appendChild(style);
  };

  // Event listener'ları ekliyoruz.
  const setEvents = () => {
    document.addEventListener("click", (event) => {
      if (event.target.classList.contains("favorite-btn")) {
        const productId = event.target.getAttribute("data-id");
        toggleFavorite(productId);
        event.target.classList.toggle("favorited");
      }

      if (event.target.classList.contains("carousel-btn")) {
        const track = document.querySelector(".carousel-track");
        const currentTranslate =
          parseFloat(
            track.style.transform.replace("translateX(", "").replace("px)", "")
          ) || 0;

        if (event.target.classList.contains("left")) {
          track.style.transform = `translateX(${currentTranslate + 200}px)`;
        } else if (event.target.classList.contains("right")) {
          track.style.transform = `translateX(${currentTranslate - 200}px)`;
        }
      }
    });
  };

  // Uygulamayı başlatıyoruz.
  const init = async () => {
    try {
      const response = await fetch(jsonURL);
      const products = await response.json();
      buildCSS();
      buildHTML(products);
      setEvents();
    } catch (error) {
      console.error("Ürünler yüklenirken bir hata oluştu:", error);
    }
  };

  init();
})();
