// dashboard.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getDatabase, ref, onValue, remove, set } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

// TODO: Replace with your Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyDLyMcQX-mTkuIvbRW9FhytOu1O7ArIgcU",
    authDomain: "orderlist-ef379.firebaseapp.com",
    databaseURL: "https://orderlist-ef379-default-rtdb.firebaseio.com",
    projectId: "orderlist-ef379",
    storageBucket: "orderlist-ef379.firebasestorage.app",
    messagingSenderId: "582459554056",
    appId: "1:582459554056:web:8af59dd8f3ead69f6d54bd",
    measurementId: "G-K2F238NLTB"
  };

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// --- Shop Status Toggle Logic ---
const statusRef = ref(db, 'shopStatus/isOpen');
const shopToggleBtn = document.getElementById('shop-toggle');
let isShopOpen = true; // Default

// Listen for status changes
onValue(statusRef, (snapshot) => {
    isShopOpen = snapshot.val() !== false; // Will be true if null or true
    
    if (isShopOpen) {
        shopToggleBtn.innerText = "Shop is OPEN (Tap to Close)";
        shopToggleBtn.className = "shop-open-btn";
    } else {
        shopToggleBtn.innerText = "Shop is CLOSED (Tap to Open)";
        shopToggleBtn.className = "shop-closed-btn";
    }
});

// Change status when button is clicked
shopToggleBtn.addEventListener('click', () => {
    set(statusRef, !isShopOpen);
});


// --- Live Orders Logic ---
const ordersContainer = document.getElementById('orders-container');
const ordersRef = ref(db, 'orders');

onValue(ordersRef, (snapshot) => {
    ordersContainer.innerHTML = ''; 
    const data = snapshot.val();

    if (!data) {
        ordersContainer.innerHTML = '<p style="text-align: center;">No pending orders.</p>';
        return;
    }

    Object.keys(data).forEach(orderId => {
        const order = data[orderId];
        
        let itemsHtml = order.items.map(item => 
            `<li>${item.quantity}x ${item.name}</li>`
        ).join('');

        let time = new Date(order.timestamp).toLocaleTimeString();

        ordersContainer.innerHTML += `
            <div class="order-card">
                <strong>Order Time: ${time}</strong>
                <ul class="order-items">${itemsHtml}</ul>
                <h3 style="margin-top: 10px;">Total: ৳${order.total}</h3>
                <button class="complete-btn" onclick="completeOrder('${orderId}')">Mark as Completed</button>
            </div>
        `;
    });
});

window.completeOrder = function(orderId) {
    if(confirm("Are you sure you have completed this order?")) {
        const orderToRemove = ref(db, 'orders/' + orderId);
        remove(orderToRemove);
    }
  };
  // --- NEW: Generate QR Code automatically ---
// This creates the QR code pointing exactly to your customer menu URL
new QRCode(document.getElementById("qrcode"), {
    text: "https://github.com/muhitmd128-ui/Product-send.io/menu.html",
    width: 150,
    height: 150,
    colorDark : "#000000",
    colorLight : "#ffffff",
    correctLevel : QRCode.CorrectLevel.H
});

