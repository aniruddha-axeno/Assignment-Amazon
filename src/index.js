const amazonUser = {
    container: "",
    data: {
        location: {
            city: "Gurugram",
            pin: "12208",
        },
        searchCategories: {
            all: "All Categories",
            alexaSkills: "Alexa Skills",
            amazonClinic: "Amazon Clinic",
            amazonDevices: "Amazon Devices",
            amazonFresh: "Amazon Fresh",
            amazonPharmacy: "Amazon Pharmacy",
            warehouseDeals: "Amazon Warehouse Deals",
            appliances: "Appliances",
            mobileApps: "Apps & Games",
            artsCrafts: "Arts, Crafts & Sewing",
            audible: "Audible Books & Originals",
            automotive: "Automotive Parts & Accessories",
            babyProducts: "Baby",
            beauty: "Beauty & Personal Care",
            stripbooks: "Books",
            popular: "CDs & Vinyl",
            mobile: "Cell Phones & Accessories",
            fashion: "Clothing, Shoes & Jewelry",
            fashionWomens: "Clothing, Shoes & Jewelry - Women",
            fashionMens: "Clothing, Shoes & Jewelry - Men",
            fashionGirls: "Clothing, Shoes & Jewelry - Girls",
            fashionBoys: "Clothing, Shoes & Jewelry - Boys",
            fashionBaby: "Clothing, Shoes & Jewelry - Baby",
            collectibles: "Collectibles & Fine Art",
            computers: "Computers",
            financial: "Credit and Payment Cards",
            digitalMusic: "Digital Music",
            electronics: "Electronics",
            lawngarden: "Garden & Outdoor",
            giftCards: "Gift Cards",
            grocery: "Grocery & Gourmet Food",
            handmade: "Handmade",
            hpc: "Health, Household & Baby Care",
            localServices: "Home & Business Services",
            garden: "Home & Kitchen",
            industrial: "Industrial & Scientific",
            primeExclusive: "Just for Prime",
            digitalText: "Kindle Store",
            fashionLuggage: "Luggage & Travel Gear",
            luxury: "Luxury Stores",
            magazines: "Magazine Subscriptions",
            moviesTv: "Movies & TV",
            mi: "Musical Instruments",
            officeProducts: "Office Products",
            pets: "Pet Supplies",
            luxuryBeauty: "Premium Beauty",
            instantVideo: "Prime Video",
            smartHome: "Smart Home",
            software: "Software",
            sporting: "Sports & Outdoors",
            specialtyApsSns: "Subscribe & Save",
            subscribeWithAmazon: "Subscription Boxes",
            tools: "Tools & Home Improvement",
            toysAndGames: "Toys & Games",
            underTenDollars: "Under $10",
            videogames: "Video Games",
            wholefoods: "Whole Foods Market",
        },
    },
    init: function (container) {
        this.container = container;
        this.renderDetails();
        this.getSearchResult();
    },
    renderDetails: function () {
        this.container.querySelector(
            ".header__address--city"
        ).innerHTML = `Delivering to ${this.data.location.city} ${this.data.location.pin}`;
        const searchCategory = this.container.querySelector(
            ".header__search--category"
        );
        for (const key in this.data.searchCategories) {
            const newOption = document.createElement("option");
            newOption.textContent = this.data.searchCategories[key];
            newOption.value = key;
            searchCategory.appendChild(newOption);
        }
    },
    getSearchResult: function () {
        const resultHistory = this.container.querySelector(".resulthistory");

        const fetchResult = (value) => {
            if (value === "") {
                const resultbox = this.container.querySelector(".suggestedresult");
                resultbox.style.display = "none";
                resultHistory.style.display = "flex";
                this.getResultHistory();
                return;
            } else {
                resultHistory.style.display = "none";
            }
            fetch(`https://dummyjson.com/products/search?q=${value}`)
                .then((res) => {
                    if (res.ok) {
                        return res.json();
                    }
                })
                .then((res) => {
                    const products = Array.from(res.products);
                    this.createSuggestedSearch(products.slice(0, 10));
                })
                .catch((error) => {
                    console.log(error);
                });
        };
        let debounceTimer;
        const searchInput = this.container.querySelector(
            ".header__search--inputbox"
        );
        searchInput.addEventListener("input", (e) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                fetchResult(e.target.value);
            }, 300);
        });
        searchInput.addEventListener("click", (e) => {
            e.stopPropagation();
            fetchResult(e.target.value);
        });
        const resultbox = this.container.querySelector(".suggestedresult");
        this.container.addEventListener("click", (e) => {
            if (!searchInput.contains(e.target) && !resultbox.contains(e.target)) {
                resultbox.style.display = "none";
            } else {
                resultbox.style.display = "flex";
            }
        });
        const submitBtn = this.container.querySelector(".header__search--submit");
        submitBtn.addEventListener("click", (e) => {
            e.preventDefault();
            const history =
                JSON.parse(localStorage.getItem("localStorageSearchHistory")) || [];
            console.log(searchInput.value);
            if (searchInput.value.trim()) {
                redirect(searchInput.value);
                history.unshift(searchInput.value);
                localStorage.setItem(
                    "localStorageSearchHistory",
                    JSON.stringify(history)
                );
            }
        });
    },
    getResultHistory: function () {
        const local = localStorage.getItem("localStorageSearchHistory");
        let searchHistoryResults = JSON.parse(local);
        searchHistoryResults = searchHistoryResults.slice(0, 10);
        const resultHistory = this.container.querySelector(".resulthistory");
        resultHistory.innerHTML = "";
        if (local) {
            for (let key in searchHistoryResults) {
                const newResult = document.createElement("a");
                const crossicon = document.createElement("img");
                crossicon.src = "./images/cross_icon.svg";
                crossicon.alt = "cross icon";
                newResult.innerHTML = `${searchHistoryResults[key]}`;
                newResult.appendChild(crossicon);
                resultHistory.appendChild(newResult);
                crossicon.addEventListener("click", (e) => {
                    this.deleteItemFromStorage(searchHistoryResults[key]);
                    e.stopPropagation();
                });
                newResult.addEventListener("click", () => {
                    redirect(searchHistoryResults[key]);
                });
            }
        }
        const searchInput = this.container.querySelector(
            ".header__search--inputbox"
        );
        this.container.addEventListener("click", (e) => {
            if (
                !searchInput.contains(e.target) &&
                !resultHistory.contains(e.target)
            ) {
                resultHistory.style.display = "none";
            } else {
                resultHistory.style.display = "flex";
            }
        });
    },
    createSuggestedSearch: function (result) {
        const resultbox = this.container.querySelector(".suggestedresult");
        resultbox.style.display = "flex";
        resultbox.innerHTML = "";
        for (let i = 0; i < result.length; i++) {
            const newResult = document.createElement("a");
            const searchicon = document.createElement("img");
            searchicon.src = "./images/search_icon.svg";
            searchicon.alt = "search icon";
            newResult.appendChild(searchicon);
            newResult.innerHTML += `${result[i].title}`;
            resultbox.appendChild(newResult);
            newResult.addEventListener("click", () => {
                redirect(result[i].title);
            });
        }
    },
    deleteItemFromStorage: function (historyKey) {
        let history =
            JSON.parse(localStorage.getItem("localStorageSearchHistory")) || [];
        console.log(history);
        console.log(historyKey);
        history = Array.from(history);
        console.log(history);
        history = history.filter((item) => item !== historyKey);
        localStorage.setItem("localStorageSearchHistory", JSON.stringify(history));
        this.getResultHistory();
    },
};

document.addEventListener("DOMContentLoaded", () => {
    const containers = document.querySelectorAll(".wrapper");
    containers.forEach((container) => {
        amazonUser.init(container);
    });
});
function redirect(value) {
    window.location.href = `./searchResult.html?search=${value}`;
}
