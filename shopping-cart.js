// fetch the products from the JSON file
let cartItems = JSON.parse(localStorage.getItem("cartItems")) || {};

async function loadProducts() {
	// fetch the products from the JSON file
	const response = await fetch("data/products.json");
	const data = await response.json();
	const products = data.products;

	function renderProducts() {
		// filter products that are not in the cart
		const filteredProducts = products.filter(product => cartItems.hasOwnProperty(product.id) && cartItems[product.id] > 0);
		productsContainer.innerHTML = '';

		// render each product in the cart
		filteredProducts.forEach(product => {
			const productHtml = `
              <!-- Single item -->
              <div class="row">
                <div class="col-lg-3 col-md-12 mb-4 mb-lg-0">
                  <!-- Image -->
                  <div class="bg-image hover-overlay hover-zoom ripple rounded" data-mdb-ripple-color="light">
                    <img src="${product.image}"
                      class="w-100" alt="${product.name}" />
                    <a href="#!">
                      <div class="mask" style="background-color: rgba(251, 251, 251, 0.2)"></div>
                    </a>
                  </div>
                  <!-- Image -->
                </div>
    
                <div class="col-lg-5 col-md-6 mb-4 mb-lg-0">
                  <!-- Data -->
                  <p><strong>${product.name}</strong></p>
                  <p>Color: blue</p>
                  <p>Size: unisex</p>
                  <!-- Data -->
                </div>
    
                <div class="col-lg-4 col-md-6 mb-4 mb-lg-0">
                  <!-- Quantity -->
                  <div class="d-flex justify-content-between align-items-center">
                    <button class="btn btn-lg btn-primary me-2 minus" data-product-minus="${product.id}">-</button>
                    <input type="number" min="1" value="${cartItems[product.id]}" class="form-control form-control-lg form-control-sm text-center" data-product-id="${product.id}" onchange="changeQuantity(event)">
                    <button class="btn btn-lg btn-primary ms-2 plus" data-product-plus="${product.id}">+</button>
                  </div>
    
                  <!-- Quantity -->
    
                  <!-- Price -->
                  <p class="text-start text-md-center">
                    <strong>€${product.price * cartItems[product.id]}.00</strong>
                  </p>
                  <!-- Price -->
                </div>
              </div>
              <!-- Seperation line -->
            
                <hr class="my-4" />
            
              <!-- Seperation line -->
            `;
			productsContainer.insertAdjacentHTML('beforeend', productHtml);
		});

		// add event listeners to all "+" and "-" buttons
		document.querySelectorAll(".plus").forEach((button) => {
			button.addEventListener("click", () => {
				const productId = Number(button.getAttribute("data-product-plus"));
				addToCart(productId);
			});
		});
		document.querySelectorAll(".minus").forEach((button) => {
			button.addEventListener("click", () => {
				const productId = Number(button.getAttribute("data-product-minus"));
				removeFromCart(productId);
			});
		});
	}

	// add product to the cart
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
		// save cart items to local storage
		localStorage.setItem('cartItems', JSON.stringify(cartItems));
		refreshCart();

	};

	// Function to remove a product from the cart
	const removeFromCart = (productId) => {
		// Find the product in the products array based on the provided productId
		const product = products.find(p => p.id === productId);

		// If the product is not found, return
		if (!product) {
			return;
		}

		// If the product is in the cart, decrement the quantity
		if (cartItems[product.id]) {
			cartItems[product.id]--;

			// If the quantity reaches zero, remove the product from the cart
			if (cartItems[product.id] === 0) {
				delete cartItems[product.id];
			}
		}

		// Save the updated cart items to local storage
		localStorage.setItem('cartItems', JSON.stringify(cartItems));

		// Refresh the cart display
		refreshCart();
	};

	// Function to update the cart total price
	const updateCart = () => {
		const cartTotal = document.querySelector('#cartTotal');
		let total = 0;

		// Calculate the total price of the cart items
		for (const item in cartItems) {
			total += cartItems[parseInt(item)] * products.find(p => p.id === parseInt(item)).price;
		}

		// Display the cart total price
		cartTotal.innerHTML = `€${total.toFixed(2)}`;
		subTotal.innerHTML = `€${total.toFixed(2)}`;
	};

	// Function to update the cart badge with the total number of items
	const updateCartBadge = () => {
		const cartBadge = document.querySelector("#cartBadge");
		let totalItems = 0;

		// Calculate the total number of items in the cart
		for (const item in cartItems) {
			totalItems += cartItems[item];
		}

		// Update the cart badge with the total number of items
		cartBadge.innerHTML = totalItems;
		cartOverview.innerHTML = totalItems;
	};

	// Function to refresh the cart by updating the total price, rendering products, and updating the cart badge
	const refreshCart = () => {
		updateCart();
		renderProducts();
		updateCartBadge();
	};

	// Update cart badge and cart total price, and render products on page load
	updateCartBadge();
	updateCart();
	renderProducts();

}

// Set the timeout to 24 hours (in milliseconds)
const timeout = 60 * 60 * 1000;

// Reset the local storage after the timeout
setTimeout(() => {
	localStorage.removeItem('cartItems');
}, timeout);

// Load the products to the page
loadProducts();