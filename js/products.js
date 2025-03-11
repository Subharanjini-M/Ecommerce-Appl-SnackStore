// import { db, collection, getDocs, addDoc, doc, setDoc, serverTimestamp } from "./firebase-config.js"; 
// import { auth } from "./auth.js"; 


// // ✅ Function to Fetch Cart Data and Update UI
// async function fetchCartData() {
//     try {
//         const user = auth.currentUser;
//         if (!user) return {};

//         const cartSnapshot = await getDocs(collection(db, "cart"));
//         const cartData = {};

//         cartSnapshot.forEach((doc) => {
//             const item = doc.data();
//             if (item.userEmail === user.email) {
//                 cartData[item.productId] = item.quantity;
//             }
//         });

//         return cartData;
//     } catch (error) {
//         console.error("❌ Error fetching cart data:", error);
//         return {};
//     }
// }

// // ✅ Fetch Products and Sync with Cart
// // async function fetchProducts() {
// //     try {
// //         const cartData = (await fetchCartData()) || {}; // Ensures cartData is always an object

// //         const querySnapshot = await getDocs(collection(db, "products"));
// //         productList.innerHTML = ""; // Clear previous products

// //         querySnapshot.forEach((doc) => {
// //             const product = doc.data();
// //             if (product.stock_status !== "visible") return;

// //             let imageUrl = product.img_url ? product.img_url : "default.jpg"; // Fallback image
// //             let stockMessage = product.stock < 5
// //                 ? `<p class="stock-warning" style="color: red;">⚠️ Only ${product.stock} left!</p>`
// //                 : "";

// //             let cartQuantity = cartData[doc.id] || 0; // Get cart quantity or default to 0

            
// //             let quantitySelector = `
// //         <div class="quantity-selector">
// //             <button class="decrease-qty" data-id="${doc.id}">−</button>
// //             <span class="qty-value" id="quantity-${doc.id}">${cartQuantity}</span>
// //             <button class="increase-qty" data-id="${doc.id}" data-stock="${doc.data().stock}">+</button>
// //         </div>
// //     `;


// //             let productHTML = `
// //                 <div class="product">
// //                     <img src="${imageUrl}" alt="${product.name}">
// //                     <h2>${product.name}</h2>
// //                     <p class="price">₹${product.price}</p>
// //                     <p>Credit: ${product.credit}</p>
// //                     ${stockMessage}
// //                     ${quantitySelector}
// //                     <button data-id="${doc.id}" class="add-to-cart"
// //                         data-name="${product.name}"
// //                         data-img="${imageUrl}"
// //                         data-price="${product.price}">
// //                         Add to Cart
// //                     </button>
// //                 </div>
// //             `;

// //             productList.innerHTML += productHTML;
// //         });

// //         attachQuantityEventListeners();
// //         attachAddToCartEvent();
// //     } catch (error) {
// //         console.error("❌ Error fetching products:", error);
// //     }
// // }

// // // // ✅ Update Firestore on Quantity Change
// // async function updateCartQuantity(productId, quantity) {
// //     try {
// //         const user = auth.currentUser;
// //         if (!user) return;

// //         const cartRef = doc(db, "cart", `${user.email}_${productId}`);

// //         if (quantity > 0) {
// //             await setDoc(cartRef, {
// //                 userEmail: user.email,
// //                 productId: productId,
// //                 quantity: quantity,
// //                 timestamp: serverTimestamp()
// //             }, { merge: true });
// //         } else {
// //             await deleteDoc(cartRef); // Remove item from cart if quantity is 0
// //         }

// //         console.log(`🔄 Cart updated: ${productId} => ${quantity}`);
// //     } catch (error) {
// //         console.error("❌ Error updating cart:", error);
// //     }
// // }

// // // ✅ Attach Events to Quantity Buttons
// // function attachQuantityEventListeners() {
// //     document.querySelectorAll(".quantity-selector").forEach((container) => {
// //         const minusBtn = container.querySelector(".decrease-qty");
// //         const plusBtn = container.querySelector(".increase-qty");
// //         const qtySpan = container.querySelector(".qty-value");
// //         const productId = minusBtn.getAttribute("data-id");

// //         let quantity = parseInt(qtySpan.innerText, 10);

// //         minusBtn.addEventListener("click", async () => {
// //             if (quantity > 0) {
// //                 quantity--;
// //                 qtySpan.innerText = quantity;
// //                 await updateCartQuantity(productId, quantity);
// //             }
// //         });

        
// //         plusBtn.addEventListener("click", async () => {
// //             const maxStock = parseInt(plusBtn.getAttribute("data-stock"), 10); // Get stock from button
// //             const maxLimit = 20; // Global cart limit
        
// //             if (quantity >= maxLimit) {
// //                 showToast(`⚠️ You can only buy up to ${maxLimit} units per product.`);
// //                 return;
// //             }
        
// //             if (quantity >= maxStock) {
// //                 showToast(`⚠️ Only ${maxStock} items available in stock.`);
// //                 return;
// //             }
        
// //             quantity++;
// //             qtySpan.innerText = quantity;
// //             await updateCartQuantity(productId, quantity);
// //         });
        


// //     });


    
// // }

// // // ✅ Attach Event to Add to Cart Button
// // function attachAddToCartEvent() {
// //     document.querySelectorAll(".add-to-cart").forEach((button) => {
// //         button.addEventListener("click", async (event) => {
// //             const productId = event.target.getAttribute("data-id");
// //             const name = event.target.getAttribute("data-name");
// //             const img_url = event.target.getAttribute("data-img");
// //             const price = parseFloat(event.target.getAttribute("data-price"));
// //             const qtyElement = document.querySelector(`#quantity-${productId}`);
// //             const quantity = qtyElement ? parseInt(qtyElement.innerText) : 0;

// //             if (quantity <= 0) {
// //                 showToast("⚠️ Please select at least 1 item before adding to the cart.");
// //                 return;
// //             }

// //             if (quantity > parseInt(event.target.getAttribute("data-stock"), 10)) {
// //                 showToast("⚠️ Out of stock! You cannot add more than available stock.");
// //                 return;
// //             }
            

// //             console.log(`🛒 Adding ${quantity} of Product ID: ${productId} to cart`);
// //             await updateCartQuantity(productId, quantity);
// //             showToast("✅ Item added to cart successfully!");
// //         });
// //     });
// // }










// // // ✅ Sync Cart Data When Item is Removed
// // async function syncCartWithProducts() {
// //     const cartData = await fetchCartData();
// //     document.querySelectorAll(".qty-value").forEach((qtySpan) => {
// //         const productId = qtySpan.id.replace("quantity-", "");
// //         qtySpan.innerText = cartData[productId] || 0;
// //     });
// // }

// // // ✅ Listen for Changes in Cart (for Syncing)
// // auth.onAuthStateChanged((user) => {
// //     if (user) {
// //         fetchProducts();
// //     }
// // });

// // // ✅ Run fetchProducts() on Page Load
// // document.addEventListener("DOMContentLoaded", fetchProducts);



// // import { db } from "./firebase-config.js";
// // import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// const productList = document.querySelector(".product-list");
// const categoryFilter = document.getElementById("category-filter");
// const searchBar = document.getElementById("search-bar");

// let allProducts = []; // Store all products globally

// // ✅ Fetch All Categories
// async function fetchCategories() {
//     try {
//         const productsRef = collection(db, "products");
//         const snapshot = await getDocs(productsRef);
//         let categories = new Set(); // Store unique categories

//         snapshot.forEach(doc => {
//             const product = doc.data();
//             if (product.category) {
//                 categories.add(product.category);
//             }
//         });

//         // Populate the category dropdown
//         categoryFilter.innerHTML = '<option value="all">All Categories</option>';
//         categories.forEach(category => {
//             categoryFilter.innerHTML += `<option value="${category}">${category}</option>`;
//         });

//     } catch (error) {
//         console.error("❌ Error fetching categories:", error);
//     }
// }

// // ✅ Fetch Products from Firestore
// async function fetchProducts() {
//     try {
//         const querySnapshot = await getDocs(collection(db, "products"));
//         allProducts = []; // Reset global product list
//         productList.innerHTML = ""; // Clear previous products

//         querySnapshot.forEach(doc => {
//             let product = doc.data();
//             product.id = doc.id; // Store product ID
//             allProducts.push(product); // Store in global array
//         });

//         displayProducts(allProducts); // Show products on page load

//     } catch (error) {
//         console.error("❌ Error fetching products:", error);
//     }
// }

// // ✅ Display Products in HTML
// function displayProducts(products) {
//     productList.innerHTML = ""; // Clear previous products

//     if (products.length === 0) {
//         productList.innerHTML = "<p>No snacks found!</p>";
//         return;
//     }

//     products.forEach(product => {
//         let imageUrl = product.img_url ? product.img_url : "default.jpg";
//         let stockMessage = product.stock < 5 ? `<p class="stock-warning" style="color: red;">⚠️ Only ${product.stock} left!</p>` : "";

//         // 🔹 Quantity Selector
//         let quantitySelector = `
//             <div class="quantity-selector">
//                 <button class="decrease-qty" data-id="${product.id}">−</button>
//                 <span class="qty-value" id="quantity-${product.id}">0</span>
//                 <button class="increase-qty" data-id="${product.id}" data-stock="${product.stock}">+</button>
//             </div>
//         `;

//         // 🔹 Add to Cart Button
//         let addToCartButton = `<button class="add-to-cart" data-id="${product.id}">Add to Cart</button>`;

//         let productHTML = `
//             <div class="product">
//                 <img src="${imageUrl}" alt="${product.name}">
//                 <h2>${product.name}</h2>
//                 <p>Category: ${product.category}</p>
//                 <p class="price">₹${product.price}</p>
//                 <p>Credit: ${product.credit}</p>
//                 ${stockMessage}
//                 ${quantitySelector}  <!-- 🔹 Add the quantity selector -->
//                 ${addToCartButton}   <!-- 🔹 Add back the "Add to Cart" button -->
//             </div>
//         `;

//         productList.innerHTML += productHTML;
//     });
// }


// // ✅ Filter Products Based on Category & Search
// function filterProducts() {
//     const searchText = searchBar.value.toLowerCase();
//     const selectedCategory = categoryFilter.value;

//     let filteredProducts = allProducts.filter(product => {
//         const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
//         const matchesSearch = product.name.toLowerCase().includes(searchText);
//         return matchesCategory && matchesSearch;
//     });

//     displayProducts(filteredProducts);
// }

// window.filterProducts=filterProducts;

// // ✅ Run on Page Load
// document.addEventListener("DOMContentLoaded", async () => {
//     await fetchCategories();
//     await fetchProducts();
// });



// document.addEventListener("click", async (event) => {
//     // Handle Decrease (-) Button Click
//     if (event.target.classList.contains("decrease-qty")) {
//         const productId = event.target.getAttribute("data-id");
//         let qtySpan = document.querySelector(`#quantity-${productId}`);
//         let quantity = parseInt(qtySpan.innerText, 10);

//         if (quantity > 0) {
//             quantity--;
//             qtySpan.innerText = quantity;
//             await updateCartQuantity(productId, quantity);
//         }
//     }

//     // Handle Increase (+) Button Click
//     if (event.target.classList.contains("increase-qty")) {
//         const productId = event.target.getAttribute("data-id");
//         const maxStock = parseInt(event.target.getAttribute("data-stock"), 10);
//         const maxLimit = 20; // Max limit per product
//         let qtySpan = document.querySelector(`#quantity-${productId}`);
//         let quantity = parseInt(qtySpan.innerText, 10);

//         if (quantity >= maxLimit) {
//             alert(`⚠️ You can only buy up to ${maxLimit} units.`);
//             return;
//         }

//         if (quantity >= maxStock) {
//             alert(`⚠️ Only ${maxStock} items available in stock.`);
//             return;
//         }

//         quantity++;
//         qtySpan.innerText = quantity;
//         await updateCartQuantity(productId, quantity);
//     }
// });




// // async function updateCartQuantity(productId, quantity) {
// //     try {
// //         const user = auth.currentUser;
// //         if (!user) return;

// //         const cartRef = doc(db, "cart", `${user.email}_${productId}`);

// //         if (quantity > 0) {
// //             await setDoc(cartRef, {
// //                 userEmail: user.email,
// //                 productId: productId,
// //                 quantity: quantity,
// //                 timestamp: serverTimestamp()
// //             }, { merge: true });
// //         } else {
// //             await deleteDoc(cartRef); // Remove item if quantity is 0
// //         }

// //         console.log(`🔄 Cart updated: ${productId} => ${quantity}`);

// //         // 🔹 Call sync function after updating cart
// //         await syncCartWithProducts();
// //     } catch (error) {
// //         console.error("❌ Error updating cart:", error);
// //     }
// // }



// async function updateCartQuantity(productId, quantity) {
//     try {
//         const user = auth.currentUser;
//         if (!user) return;

//         const cartRef = doc(db, "cart", `${user.email}_${productId}`);

//         if (quantity > 0) {
//             await setDoc(cartRef, {
//                 userEmail: user.email,
//                 productId: productId,
//                 quantity: quantity,
//                 timestamp: serverTimestamp()
//             }, { merge: true });
//         } else {
//             await deleteDoc(cartRef); // Remove item if quantity is 0
//         }

//         console.log(`🔄 Cart updated: ${productId} => ${quantity}`);

//         // ✅ Ensure UI reflects the updated cart
//         const qtySpan = document.querySelector(`#quantity-${productId}`);
//         if (qtySpan) {
//             qtySpan.innerText = quantity; // Keep UI consistent
//         }

//         // ✅ Sync cart after updating Firestore
//         await syncCartWithProducts();

//     } catch (error) {
//         console.error("❌ Error updating cart:", error);
//     }
// }



// // ✅ Sync Cart Data with UI
// async function syncCartWithProducts() {
//     try {
//         const cartData = await fetchCartData(); // Fetch updated cart data

//         document.querySelectorAll(".qty-value").forEach((qtySpan) => {
//             const productId = qtySpan.id.replace("quantity-", "");
//             qtySpan.innerText = cartData[productId] || 0; // Update UI with cart values
//         });

//     } catch (error) {
//         console.error("❌ Error syncing cart:", error);
//     }
// }



import { 
    db, collection, getDocs, doc, setDoc, deleteDoc, serverTimestamp 
} from "./firebase-config.js"; 
import { auth } from "./auth.js"; 

// Global variables
let allProducts = []; 
const productList = document.querySelector(".product-list");
const categoryFilter = document.getElementById("category-filter");
const searchBar = document.getElementById("search-bar");

// ✅ Fetch Cart Data
async function fetchCartData() {
    try {
        const user = auth.currentUser;
        if (!user) return {};

        const cartSnapshot = await getDocs(collection(db, "cart"));
        const cartData = {};

        cartSnapshot.forEach((doc) => {
            const item = doc.data();
            if (item.userEmail === user.email) {
                cartData[item.productId] = item.quantity;
            }
        });

        return cartData;
    } catch (error) {
        console.error("❌ Error fetching cart data:", error);
        return {};
    }
}

// ✅ Fetch Products and Sync with Cart
async function fetchProducts() {
    try {
        const cartData = await fetchCartData();
        const querySnapshot = await getDocs(collection(db, "products"));
        allProducts = []; 
        productList.innerHTML = ""; 

        querySnapshot.forEach((doc) => {
            const product = doc.data();
            if (product.stock_status !== "visible") return;

            product.id = doc.id; 
            allProducts.push(product); 

            let imageUrl = product.img_url ? product.img_url : "default.jpg"; 
            let stockMessage = product.stock < 5 
                ? `<p class="stock-warning" style="color: red;">⚠️ Only ${product.stock} left!</p>` 
                : "";

            let cartQuantity = cartData[doc.id] || 0; 

            let quantitySelector = `
                <div class="quantity-selector">
                    <button class="decrease-qty" data-id="${doc.id}">−</button>
                    <span class="qty-value" id="quantity-${doc.id}">${cartQuantity}</span>
                    <button class="increase-qty" data-id="${doc.id}" data-stock="${product.stock}">+</button>
                </div>
            `;

            let productHTML = `
                <div class="product">
                    <img src="${imageUrl}" alt="${product.name}">
                    <h2>${product.name}</h2>
                    <p class="price">₹${product.price}</p>
                    <p>Credit: ${product.credit}</p>
                    ${stockMessage}
                    ${quantitySelector}
                    <button data-id="${doc.id}" class="add-to-cart"
                        data-name="${product.name}"
                        data-img="${imageUrl}"
                        data-price="${product.price}">
                        Add to Cart
                    </button>
                </div>
            `;

            productList.innerHTML += productHTML;
        });

        attachQuantityEventListeners();
        attachAddToCartEvent();
    } catch (error) {
        console.error("❌ Error fetching products:", error);
    }
}

// ✅ Update Firestore on Quantity Change
async function updateCartQuantity(productId, quantity) {
    try {
        const user = auth.currentUser;
        if (!user) return;

        const cartRef = doc(db, "cart", `${user.email}_${productId}`);

        if (quantity > 0) {
            await setDoc(cartRef, {
                userEmail: user.email,
                productId: productId,
                quantity: quantity,
                timestamp: serverTimestamp()
            }, { merge: true });
        } else {
            await deleteDoc(cartRef); 
        }

        console.log(`🔄 Cart updated: ${productId} => ${quantity}`);
    } catch (error) {
        console.error("❌ Error updating cart:", error);
    }
}

// ✅ Attach Events to Quantity Buttons
function attachQuantityEventListeners() {
    document.querySelectorAll(".quantity-selector").forEach((container) => {
        const minusBtn = container.querySelector(".decrease-qty");
        const plusBtn = container.querySelector(".increase-qty");
        const qtySpan = container.querySelector(".qty-value");
        const productId = minusBtn.getAttribute("data-id");

        let quantity = parseInt(qtySpan.innerText, 10);

        minusBtn.addEventListener("click", async () => {
            if (quantity > 0) {
                quantity--;
                qtySpan.innerText = quantity;
                await updateCartQuantity(productId, quantity);
            }
        });

        plusBtn.addEventListener("click", async () => {
            const maxStock = parseInt(plusBtn.getAttribute("data-stock"), 10); 
            const maxLimit = 20; 

            if (quantity >= maxLimit) {
                alert(`⚠️ You can only buy up to ${maxLimit} units per product.`);
                return;
            }

            if (quantity >= maxStock) {
                alert(`⚠️ Only ${maxStock} items available in stock.`);
                return;
            }

            quantity++;
            qtySpan.innerText = quantity;
            await updateCartQuantity(productId, quantity);
        });
    });
}

// ✅ Attach Event to Add to Cart Button
function attachAddToCartEvent() {
    document.querySelectorAll(".add-to-cart").forEach((button) => {
        button.addEventListener("click", async (event) => {
            const productId = event.target.getAttribute("data-id");
            const qtyElement = document.querySelector(`#quantity-${productId}`);
            const quantity = qtyElement ? parseInt(qtyElement.innerText) : 0;

            const user = auth.currentUser; // Check if user is logged in
            if (!user) {
                alert("⚠️ You must log in to add items to the cart!");
                return;
            }
            
            if (quantity <= 0) {
                alert("⚠️ Please select at least 1 item before adding to the cart.");
                return;
            }

            console.log(`🛒 Adding ${quantity} of Product ID: ${productId} to cart`);
            await updateCartQuantity(productId, quantity);
            alert("✅ Item added to cart successfully!");
        });
    });
}

// ✅ Fetch Categories
async function fetchCategories() {
    try {
        const productsRef = collection(db, "products");
        const snapshot = await getDocs(productsRef);
        let categories = new Set(); 

        snapshot.forEach(doc => {
            const product = doc.data();
            if (product.category) {
                categories.add(product.category);
            }
        });

        categoryFilter.innerHTML = '<option value="all">All Categories</option>';
        categories.forEach(category => {
            categoryFilter.innerHTML += `<option value="${category}">${category}</option>`;
        });

    } catch (error) {
        console.error("❌ Error fetching categories:", error);
    }
}

// ✅ Filter Products
function filterProducts() {
    const searchText = searchBar.value.toLowerCase();
    const selectedCategory = categoryFilter.value;

    let filteredProducts = allProducts.filter(product => {
        const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchText);
        return matchesCategory && matchesSearch;
    });

    displayProducts(filteredProducts);
}

// ✅ Display Products
function displayProducts(products) {
    productList.innerHTML = ""; 

    if (products.length === 0) {
        productList.innerHTML = "<p>No products found!</p>";
        return;
    }

    products.forEach(product => {
        let imageUrl = product.img_url ? product.img_url : "default.jpg";
        let stockMessage = product.stock < 5 ? `<p class="stock-warning" style="color: red;">⚠️ Only ${product.stock} left!</p>` : "";

        let productHTML = `
            <div class="product">
                <img src="${imageUrl}" alt="${product.name}">
                <h2>${product.name}</h2>
                <p class="price">₹${product.price}</p>
                ${stockMessage}
                <button data-id="${product.id}" class="add-to-cart">Add to Cart</button>
            </div>
        `;

        productList.innerHTML += productHTML;
    });

    attachAddToCartEvent(); 
}

// ✅ Initialize
document.addEventListener("DOMContentLoaded", async () => {
    await fetchCategories();
    await fetchProducts();
});


window.filterProducts=filterProducts;