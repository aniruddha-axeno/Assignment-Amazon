const searchResult = {
    container: "",
    value: "",
    init: function (container) {
        this.container = container;
        this.fetchQuery();
        this.fetchResult();
    },
    fetchQuery: function () {
        const params = new URLSearchParams(window.location.search);
        const value = params.get("search");
        const searchInput = this.container.querySelector(
            ".header__search--inputbox"
        );
        searchInput.value = value;
        this.value = value;
    },
    fetchResult: function () {
        fetch(`https://dummyjson.com/products/search?q=${this.value}`)
            .then((res) => {
                if (res.ok) {
                    return res.json();
                }
            })
            .then((res) => {
                const products = Array.from(res.products);
                this.getResultHeader(products.length);
                this.sortProducts(products);
                this.filterProducts(products);
                this.slidebar(products);
                this.renderProducts(products);
            })
            .catch((error) => {
                console.log(error);
            });
    },
    getResultHeader: function (length) {
        const resultfoundDiv = this.container.querySelector(
            ".searchresult__desc--left"
        );
        resultfoundDiv.innerHTML = `${length} results found for <span>"${this.value}" </span>`;
    },
    renderProducts(products) {
        const resultDiv = this.container.querySelector(".mainright__results");
        resultDiv.innerHTML = "";
        if (products.length === 0) {
            resultDiv.innerHTML = "<h3>Products Not Found</h3>";
        }
        products.forEach((product) => {
            const mainDiv = document.createElement("div");
            mainDiv.classList.add("mainright__results--product");
            let price = product.price * 100;
            const discount = (price * product.discountPercentage) / 100;
            const finalPrice = (Math.floor(price - discount)).toLocaleString();
            price = (Math.floor(price)).toLocaleString();
            mainDiv.innerHTML = `
                  <div class="product__image">
                    <img class="product__image--img" src=${product.thumbnail}>
                  </div>
                  <div class="product__details">
                    <h2 class="product__details--title">${product.title}: ${product.description}</h2>
                    <div class="product__details--ratingdiv">
                      <p class="product__details--rating product--rating1">★</p>
                      <p class="product__details--rating product--rating2">★</p>
                      <p class="product__details--rating product--rating3">★</p>
                      <p class="product__details--rating product--rating4">★</p>
                      <p class="product__details--rating product--rating5" >★</p>
                      <span class="product__details--ratingdiv--reviewcount">${product.reviews.length}</span>
                    </div>
                    <div class="product__details--price">
                      <span>₹</span><h2>${finalPrice}</h2>
                      <div>M.R.P: <s>${price}</s></div><p>(${product.discountPercentage}% off)</p>
                    </div>
                    <p class="product__details--save">Save Extra with No Cost EMI</p>
                    <p>${product.returnPolicy}</p>
                    <button class="product__details--addcart">Add to cart</button>

                  </div>
                </div>
            `;
            const productRating = product.rating;
            for (let i = 1; i <= Math.floor(productRating); i++) {
                const starDiv = mainDiv.querySelector(`.product--rating${i}`);
                if (starDiv) {
                    starDiv.style.color = "#da7a47";
                }
            }
            resultDiv.appendChild(mainDiv);
        });
    },
    slidebar: function (products) {
        const minSlidebar = this.container.querySelector(".mainleft__pricerange--slidebarmin");
        const maxSlidebar = this.container.querySelector(".mainleft__pricerange--slidebarmax");
        const minPrice = this.container.querySelector(".minprice");
        const maxPrice = this.container.querySelector(".maxprice");
        minSlidebar.addEventListener("input", (e) => {
            if (parseInt(minSlidebar.value) > parseInt(maxSlidebar.value)) {
                minSlidebar.value = maxSlidebar.value - 1;
            }
            minPrice.innerHTML = `${minSlidebar.value}`;
        })
        maxSlidebar.addEventListener("input", (e) => {
            if (parseInt(minSlidebar.value) > parseInt(maxSlidebar.value)) {
                maxSlidebar.value = minSlidebar.value;
            }
            maxPrice.innerHTML = `${maxSlidebar.value}`;
        })

        const clickPrice = this.container.querySelector(".mainleft__pricerange--button");
        clickPrice.addEventListener("click", () => {
            const minprice = parseInt(minSlidebar.value) / 100;
            const maxprice = parseInt(maxSlidebar.value) / 100;
            const filteredProducts = products.filter(product => {
                return product.price >= minprice && product.price <= maxprice;
            });
            this.renderProducts(filteredProducts);
        })
    },
    filterProducts: function (products) {
        const checkboxes = this.container.querySelectorAll(".mainleft input[type='checkbox']");
        checkboxes.forEach((checkbox) => {
            checkbox.addEventListener("change", () => {
                const selectedCategories = Array.from(checkboxes)
                    .filter(cb => cb.checked)
                    .map(cb => cb.value);
                if (selectedCategories.length === 0) {
                    this.renderProducts(products);
                    this.sortProducts(products);
                }
                else {
                    const filteredProducts = products.filter(product =>
                        selectedCategories.includes(product.category)
                    );
                    this.renderProducts(filteredProducts);
                    this.sortProducts(filteredProducts);
                }
            });
        });
    },
    sortProducts: function (products) {
        const sortBy = this.container.querySelector(".searchresult__sortby");
        sortBy.addEventListener("change", (e) => {
            const sortProducts = [...products];
            if (e.target.value === "lowtohigh") {
                sortProducts.sort((a, b) => {
                    return a.price - b.price;
                });
            }
            else if (e.target.value === "hightolow") {
                sortProducts.sort((a, b) => {
                    return b.price - a.price;
                })
            }
            else if (e.target.value === "customerreview") {
                sortProducts.sort((a, b) => {
                    return b.rating - a.rating;
                })
            }
            else if (e.target.value === "featured") { }
            this.renderProducts(sortProducts);
        })

    }
};

document.addEventListener("DOMContentLoaded", () => {
    const containers = document.querySelectorAll(".wrapper");
    containers.forEach((container) => {
        searchResult.init(container);
    });
});
