// Retrieve cart items from local storage
let cartItems = JSON.parse(localStorage.getItem("cartItems"));

// Function to update cart badge
const updateCartBadge = () => {
	// Select the HTML element with the ID of `cartBadge`
	const cartBadge = document.querySelector("#cartBadge");
	// Initialize the total number of items to 0
	let totalItems = 0;
	// Loop through each item in `cartItems` and add up their quantities
	for (const item in cartItems) {
		totalItems += cartItems[item];
	}
	// Update the content of `cartBadge` with the total number of items
	cartBadge.innerHTML = totalItems;
};

// Call the `updateCartBadge()` function to update the cart badge on the page with the number of items in the cart
updateCartBadge();
