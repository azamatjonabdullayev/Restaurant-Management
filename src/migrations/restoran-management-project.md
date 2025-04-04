# Restoran Boshqaruv Tizimi Loyihasi

## Loyiha haqida

Ushbu loyiha kichik va o'rta restoranlar uchun buyurtmalarni qayd etish va boshqarish tizimini yaratishni maqsad qiladi. Tizim orqali restoranlar o'z menyu tarkibini boshqarishi, buyurtmalarni qabul qilishi va mijozlar haqida ma'lumotlarni saqlashi mumkin. Loyiha Express.js, PostgreSQL va JWT autentifikatsiya bilan ishlab chiqiladi.

## Database Schema (PostgreSQL)

### 1. Users jadval:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'waiter', -- admin, manager, waiter
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Categories jadval:

```sql
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Menu Items jadval:

```sql
CREATE TABLE menu_items (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category_id INTEGER REFERENCES categories(id),
  image_url VARCHAR(255),
  available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4. Orders jadval:

```sql
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  table_number INTEGER NOT NULL,
  customer_name VARCHAR(100),
  waiter_id INTEGER REFERENCES users(id),
  status VARCHAR(20) DEFAULT 'new', -- new, preparing, ready, served, paid
  total_amount DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 5. Order Items jadval:

```sql
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id INTEGER REFERENCES menu_items(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Endpointlar

### 1. Authentication

#### Register (Ro'yxatdan o'tish)

- **Endpoint:** `POST /api/auth/register`
- **Request Body:**

```json
{
  "fullName": "string",
  "email": "string",
  "password": "string"
}
```

- **Response (201):**

```json
{
  "status": "success",
  "message": "User registered successfully",
  "data": {
    "id": "number",
    "fullName": "string",
    "email": "string",
    "role": "string",
    "createdAt": "timestamp"
  }
}
```

#### Login (Tizimga kirish)

- **Endpoint:** `POST /api/auth/login`
- **Request Body:**

```json
{
  "email": "string",
  "password": "string"
}
```

- **Response (200):**

```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "token": "string",
    "user": {
      "id": "number",
      "fullName": "string",
      "email": "string",
      "role": "string"
    }
  }
}
```

### 2. Menu Items

#### Create Menu Item

- **Endpoint:** `POST /api/menu`
- **Headers:** `Authorization: Bearer {token}`
- **Request Body:**

```json
{
  "name": "string",
  "description": "string",
  "price": "number",
  "categoryId": "number",
  "imageUrl": "string (optional)",
  "available": "boolean (default: true)"
}
```

- **Response (201):**

```json
{
  "status": "success",
  "message": "Menu item created successfully",
  "data": {
    "id": "number",
    "name": "string",
    "description": "string",
    "price": "number",
    "categoryId": "number",
    "imageUrl": "string",
    "available": "boolean",
    "createdAt": "timestamp"
  }
}
```

#### Get All Menu Items

- **Endpoint:** `GET /api/menu`
- **Query Parameters:**
  - `categoryId` (ixtiёriy)
  - `available` (ixtiёriy, boolean)
- **Response (200):**

```json
{
  "status": "success",
  "data": [
    {
      "id": "number",
      "name": "string",
      "description": "string",
      "price": "number",
      "categoryId": "number",
      "category": {
        "id": "number",
        "name": "string"
      },
      "imageUrl": "string",
      "available": "boolean",
      "createdAt": "timestamp"
    }
  ]
}
```

### 3. Orders

#### Create Order

- **Endpoint:** `POST /api/orders`
- **Headers:** `Authorization: Bearer {token}`
- **Request Body:**

```json
{
  "tableNumber": "number",
  "customerName": "string (optional)",
  "items": [
    {
      "menuItemId": "number",
      "quantity": "number",
      "notes": "string (optional)"
    }
  ]
}
```

- **Response (201):**

```json
{
  "status": "success",
  "message": "Order created successfully"
}
```

#### Update Order Status

- **Endpoint:** `PATCH /api/orders/:id/status`
- **Headers:** `Authorization: Bearer {token}`
- **Params:** `id`
- **Request Body:**

```json
{
  "status": "string" // new, preparing, ready, served, paid
}
```

- **Response (200):**

```json
{
  "status": "success",
  "message": "Order status updated successfully",
  "data": {
    "id": "number",
    "tableNumber": "number",
    "status": "string",
    "updatedAt": "timestamp"
  }
}
```
