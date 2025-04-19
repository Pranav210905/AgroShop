# 🥦 Bulk Vegetable/Fruit Ordering Platform

A full-stack web application that enables bulk ordering of vegetables and fruits, with dedicated features for buyers and admins.

---

## 🚀 Features

### 🛒 For Buyers

- **Browse Catalogue**  
  View a list of available vegetables and fruits with names and prices.  
  ➤ No stock tracking needed; all products are considered available.

- **Place Orders**  
  Bulk order vegetables/fruits by entering quantity and delivery details (name, contact number, address).

- **Track Orders**  
  Monitor order progress via 3 statuses:
  - `Pending` – Order received.
  - `In Progress` – Order is being packed.
  - `Delivered` – Order successfully delivered.

---

### 🛠️ For Admins

- **Admin Dashboard**  
  Log in to manage orders and inventory.  

  **Admin Login:**  
  - Email: `Pranav2105@gmail.com`

- **Order Management**  
  View all orders with customer details and update their statuses (`Pending → In Progress → Delivered`).

- **Inventory Management**  
  Add, edit, or delete fruits/vegetables from the catalogue.  
  ➤ No stock count required.

---

## 🗂️ Tech Stack

| Area       | Tech Used                    |
|------------|------------------------------|
| Frontend   | React.js, Tailwind |
| Backend    |  Firebase Functions  |
| Database   | Firebase |
| Deployment | Vercel (Frontend)            |
---

## 📦 Pages Overview

- `/` – Product Catalogue
- `/order` – Place a Bulk Order
- `/track-order` – Track Order Status
- `/admin` – Admin Dashboard (Requires login)

---

## 📡 API Endpoints

| Endpoint                 | Method | Description                        |
|--------------------------|--------|------------------------------------|
| `/api/products`          | GET    | Fetch product catalogue            |
| `/api/orders`            | POST   | Place a new order                  |




Admin login details:


email:Pranav2105@gmail.com


password:Pra@123


the admin can dynamically add products by manage inventory  in the website


to run locally use the npm run dev


Link of website:https://agro-shop-nu8r.vercel.app/

