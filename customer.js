// customer.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

// TODO: Replace with your Firebase Config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT.firebaseio.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Check if shop is open or closed
const statusRef = ref(db, 'shopStatus/isOpen');
const menuContainer = document.getElementById('menu-container');
const closedMessage = document.getElementById('closed-message');

onValue(statusRef, (snapshot) => {
    const isOpen = snapshot.val();
    
    // If isOpen is exactly false, show the closed message
    if (isOpen === false) {
        menuContainer.style.display = 'none';
        closedMessage.style.display = 'block';
    } else {
        // Otherwise (true or null), keep the shop open
        menuContainer.style.display = 'block';
        closedMessage.style.display = 'none';
    }
});

// Sample Products
const products = [
    { id: 'p1', name: 'Fresh Apples (1kg)', price: 150 },
    { id: 'p2', name: 'Whole Wheat Bread', price: 60 },
    { id: 'p3', name: 'Milk (1 Liter)', price: 80 }
];

const productContainer = document.getElementById('product-list');
products.forEach(product => {
    productContainer.innerHTML += `
        <div class="product-item">
            <div class="product-info">
                <strong>${product.name}</strong><br>
                <span>৳${product.price}</span>
            </div>
            <input type="number" id="${product.id}" min="0" value="0" placeholder="Qty">
        </div>
    `;
});

document.getElementById('submit-order').addEventListener('click', () => {
    let orderItems = [];
    let total = 0;

    products.forEach(product => {
        let qty = parseInt(document.getElementById(product.id).value);
        if (qty > 0) {
            orderItems.push({ name: product.name, quantity: qty, price: product.price });
            total += (qty * product.price);
        }
    });

    if (orderItems.length === 0) {
        alert("Please select at least one item.");
        return;
    }

    const ordersRef = ref(db, 'orders');
    push(ordersRef, {
        items: orderItems,
        total: total,
        timestamp: new Date().toISOString(),
        status: 'pending'
    }).then(() => {
        alert("Order sent successfully! Please wait at the counter.");
        window.location.reload(); 
    }).catch(error => {
        alert("Error sending order: " + error.message);
    });
});
