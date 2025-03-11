import { auth, db } from "../js/firebase-config.js";
import { collection, addDoc, getDocs, getDoc,query, orderBy, limit, startAfter, doc, updateDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
    const adminPanel = document.getElementById("admin-panel");
    const logoutBtn = document.getElementById("logout-btn");

    // ✅ Check Authentication
    onAuthStateChanged(auth, (user) => {
        if (user && user.email === "subharanjini11@gmail.com") {
            console.log("✅ Admin logged in, displaying panel...");
            adminPanel.style.display = "block"; // Show admin panel
        } else {
            console.log("❌ Not an admin. Redirecting...");
            window.location.href = "../index.html"; // Redirect non-admins
        }
    });

    // ✅ Handle Logout
    logoutBtn.addEventListener("click", async () => {
        try {
            await signOut(auth);
            showToast("✅ Logged out successfully!");
            window.location.href = "../index.html"; // Redirect after logout
        } catch (error) {
            console.error("❌ Error logging out:", error);
            showToast("Error logging out: " + error.message);
        }
    });
});

// ✅ Add Product Function
const addProductForm = document.getElementById("add-product-form");

addProductForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const productData = {
        category: document.getElementById("category").value,
        credit: Number(document.getElementById("credit").value),
        img_url: document.getElementById("img-url").value,
        name: document.getElementById("name").value,
        price: Number(document.getElementById("price").value),
        grams: Number(document.getElementById("grams").value), // ✅ Include grams
        stock_status: document.getElementById("stock-status").value,
        stock: Number(document.getElementById("stock").value),
    };

    try {
        await addDoc(collection(db, "products"), productData);
        showToast("✅ Product added successfully!");
        addProductForm.reset();
        displayProducts(); // Refresh list after adding
    } catch (error) {
        console.error("❌ Error adding product:", error);
        showToast("Error adding product: " + error.message);
    }
});

// ✅ Display Products (with grams)
const productsContainer = document.getElementById("products-container");
let lastVisibleDoc = null;

const displayProducts = async () => {
    let q = lastVisibleDoc 
        ? query(collection(db, "products"), orderBy("name"), startAfter(lastVisibleDoc), limit(5)) 
        : query(collection(db, "products"), orderBy("name"), limit(5));

    const querySnapshot = await getDocs(q);
    productsContainer.innerHTML = ""; 

    querySnapshot.forEach((doc) => {
        const product = doc.data();

        // ✅ Show stock warning if stock < 5
        let stockMessage = product.stock < 5 
            ? `<p class="stock-warning" style="color: red;">⚠️ Only ${product.stock} left!</p>` 
            : `<p>Stock: ${product.stock}</p>`;

        productsContainer.innerHTML += `
            <div class="product-card">
                <img src="${product.img_url}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>Price: ₹${product.price}</p>
                <p>Weight: ${product.grams}g</p> 
                <p>Status: ${product.stock_status}</p>
                ${stockMessage}  <!-- ✅ Stock warning displayed here -->
                <button onclick="editProduct('${doc.id}')">Edit</button>
                <button onclick="toggleStatus('${doc.id}', '${product.stock_status}')">
                    ${product.stock_status === "visible" ? "Deactivate" : "Activate"}
                </button>
            </div>
        `;
    });

    lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1]; 
};


// ✅ Load first batch of products
displayProducts();

// ✅ Pagination
document.getElementById("next-btn").addEventListener("click", () => {
    displayProducts();
});

// ✅ Edit Product
// const editProduct = async (productId) => {
//     const newPrice = prompt("Enter new price:");
//     const newStockStatus = prompt("Enter new stock status (visible/hidden):");
//     const newGrams = prompt("Enter new grams value:"); // ✅ Allow grams update

//     if (newPrice && newStockStatus && newGrams) {
//         const productRef = doc(db, "products", productId);
//         try {
//             await updateDoc(productRef, {
//                 price: Number(newPrice),
//                 stock_status: newStockStatus,
//                 grams: Number(newGrams) // ✅ Update grams
//             });
//             showToast("✅ Product updated successfully!");
//             displayProducts();
//         } catch (error) {
//             console.error("❌ Error updating product:", error);
//             showToast("Error updating product: " + error.message);
//         }
//     }
// };
// window.editProduct = editProduct;



// const editProduct = async (productId) => {
//     const newPrice = prompt("Enter new price:");
//     const newStockStatus = prompt("Enter new stock status (visible/hidden):");
//     const newGrams = prompt("Enter new grams value:");
//     const newStock = prompt("Enter new stock value:"); // ✅ Allow stock update

//     if (newPrice && newStockStatus && newGrams && newStock) {
//         const productRef = doc(db, "products", productId);
//         try {
//             await updateDoc(productRef, {
//                 price: Number(newPrice),
//                 stock_status: newStockStatus,
//                 grams: Number(newGrams),
//                 stock: Number(newStock) // ✅ Update stock value
//             });
//             alert("✅ Product updated successfully!");
//             displayProducts();
//         } catch (error) {
//             console.error("❌ Error updating product:", error);
//             alert("Error updating product: " + error.message);
//         }
//     }
// };
// window.editProduct = editProduct;








const editProduct = async (productId) => {
    const productRef = doc(db, "products", productId);

    // Fetch the current product data to preserve existing values
    const productSnap = await getDoc(productRef);
    if (!productSnap.exists()) {
        alert("❌ Product not found!");
        return;
    }
    const productData = productSnap.data();

    // Prompt the user for updates (keeping previous values if left empty)
    const newPrice = prompt("Enter new price (leave empty to keep current):", productData.price);
    const newStockStatus = prompt("Enter new stock status (visible/hidden) (leave empty to keep current):", productData.stock_status);
    const newGrams = prompt("Enter new grams value (leave empty to keep current):", productData.grams);
    const newStock = prompt("Enter new stock value (leave empty to keep current):", productData.stock);

    // Create update object with only changed values
    let updateData = {};
    if (newPrice !== "" && newPrice !== null) updateData.price = Number(newPrice);
    if (newStockStatus !== "" && newStockStatus !== null) updateData.stock_status = newStockStatus;
    if (newGrams !== "" && newGrams !== null) updateData.grams = Number(newGrams);
    if (newStock !== "" && newStock !== null) updateData.stock = Number(newStock);

    // If no changes were made, exit early
    if (Object.keys(updateData).length === 0) {
        alert("ℹ️ No changes made.");
        return;
    }

    // Perform the update
    try {
        await updateDoc(productRef, updateData);
        alert("✅ Product updated successfully!");
        displayProducts();
    } catch (error) {
        console.error("❌ Error updating product:", error);
        alert("Error updating product: " + error.message);
    }
};
window.editProduct = editProduct;











// ✅ Toggle Product Status
const toggleStatus = async (productId, currentStatus) => {
    const newStatus = currentStatus === "visible" ? "hidden" : "visible";
    const productRef = doc(db, "products", productId);

    try {
        await updateDoc(productRef, { stock_status: newStatus });
        showToast(`✅ Product ${newStatus === "visible" ? "activated" : "deactivated"}!`);
        displayProducts();
    } catch (error) {
        console.error("❌ Error toggling product status:", error);
        showToast("Error toggling status: " + error.message);
    }
};
window.toggleStatus=toggleStatus;





// Toast Message
// Function to Show Toast Notifications
function showToast(message, type = "success") {
    const toastContainer = document.querySelector(".toast-container") || createToastContainer();
    const toast = document.createElement("div");

    toast.className = `toast ${type}`;
    toast.innerText = message;
    toastContainer.appendChild(toast);

    // Auto-hide after 3 seconds
    setTimeout(() => {
        toast.style.opacity = "0";
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

// Create Toast Container (if not exists)
function createToastContainer() {
    const container = document.createElement("div");
    container.className = "toast-container";
    document.body.appendChild(container);
    return container;
}
