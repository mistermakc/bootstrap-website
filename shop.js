// fetch the products from the JSON file
let cartItems = JSON.parse(localStorage.getItem("cartItems")) || {};

// asynchronous function to load the products
async function loadProducts() {
	// fetching the JSON data from the products file
	const response = await fetch("data/products.json");
	const data = await response.json();
	const products = data.products;

	// function to render the products based on the applied filters
	function renderProducts() {
		const filter = document.getElementById("filter").value.toLowerCase();
		const category = document.getElementById("category").value;
		const minPrice = Number(document.getElementById("min-price").value);
		const maxPrice = Number(document.getElementById("max-price").value);

		const filteredProducts = products.filter(product => {
			if (category && product.category !== category) {
				return false;
			}
			if ((minPrice && product.price < minPrice) || (maxPrice && product.price > maxPrice)) {
				return false;
			}
			if (filter && !product.name.toLowerCase().includes(filter)) {
				return false;
			}
			return true;
		});

		// selecting the container to render the filtered products
		const shopItems = document.querySelector('.shop-items');
		shopItems.innerHTML = "";

		// updating the cart badge
		updateCartBadge();

		// looping through the filtered products and rendering them
		filteredProducts.forEach((product) => {
			const shopItem = document.createElement("div");
			shopItem.classList.add("col");
			shopItem.innerHTML = `
            <div class="card rounded-3">
                <div class="card-img-wrapper">
                    <img src="${product.image}" class="card-img-top-shop" alt="${product.name}">
                </div>
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">€${product.price.toFixed(2)}</p>
                    <button class="btn btn-primary btn-lg addToCart" data-product="${product.id}">Add to cart</button>
                </div>
            </div>
            `;
			shopItems.appendChild(shopItem);
		});

		// adding event listeners to the filter inputs
		document.getElementById("filter").addEventListener("input", renderProducts);
		document.getElementById("category").addEventListener("change", renderProducts);
		document.getElementById("min-price").addEventListener("change", renderProducts);
		document.getElementById("max-price").addEventListener("change", renderProducts);

		// adding an event listener to all "Add to cart" buttons
		document.querySelectorAll('.addToCart').forEach(button => {
			button.addEventListener('click', () => {
				const productId = Number(button.getAttribute('data-product'));
				addToCart(productId);
			});
		});
	}

	// function to add a product to the cart
	const addToCart = (productId) => {
		const product = products.find(p => p.id === productId);
		if (!product) {
			return;
		}
		if (cartItems[product.id]) {
			cartItems[product.id]++;
		} else {
			cartItems[product.id] = 1;
		}
		localStorage.setItem("cartItems", JSON.stringify(cartItems));
		updateCartBadge();
	};

	// function to update the cart badge
	const updateCartBadge = () => {
		const cartBadge = document.querySelector("#cartBadge");
		let totalItems = 0;
		for (const item in cartItems) {
			totalItems += cartItems[item];
		}
		cartBadge.innerHTML = totalItems;
	};

	// rendering the products
	renderProducts();
}
loadProducts();