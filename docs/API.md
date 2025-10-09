# AdminKit Pro - API Documentation

This document provides detailed information about the REST API endpoints available in the AdminKit Pro application.

## Authentication

All protected endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

### Login
**POST** `/api/auth/login`

Authenticate a user and receive a JWT token.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "token": "string",
  "user": {
    "id": "number",
    "name": "string",
    "email": "string",
    "role": "string"
  }
}
```

### Register
**POST** `/api/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "role": "string" // "CUSTOMER" | "ADMIN"
}
```

**Response:**
```json
{
  "id": "number",
  "name": "string",
  "email": "string",
  "role": "string",
  "created_at": "string"
}
```

## Users

### Get All Users
**GET** `/api/users`

Retrieve a list of all users.

**Query Parameters:**
- `page` (optional) - Page number for pagination
- `limit` (optional) - Number of items per page
- `search` (optional) - Search term to filter users by name or email

**Response:**
```json
{
  "users": [
    {
      "id": "number",
      "name": "string",
      "email": "string",
      "role": "string",
      "created_at": "string",
      "updated_at": "string"
    }
  ],
  "total": "number",
  "page": "number",
  "limit": "number"
}
```

### Create User
**POST** `/api/users`

Create a new user.

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "role": "string"
}
```

**Response:**
```json
{
  "id": "number",
  "name": "string",
  "email": "string",
  "role": "string",
  "created_at": "string",
  "updated_at": "string"
}
```

### Get User by ID
**GET** `/api/users/{id}`

Retrieve a specific user by ID.

**Response:**
```json
{
  "id": "number",
  "name": "string",
  "email": "string",
  "role": "string",
  "created_at": "string",
  "updated_at": "string"
}
```

### Update User
**PUT** `/api/users/{id}`

Update a user's information.

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "role": "string"
}
```

**Response:**
```json
{
  "id": "number",
  "name": "string",
  "email": "string",
  "role": "string",
  "created_at": "string",
  "updated_at": "string"
}
```

### Delete User
**DELETE** `/api/users/{id}`

Delete a user.

**Response:**
```json
{
  "message": "User deleted successfully"
}
```

## Products

### Get All Products
**GET** `/api/products`

Retrieve a list of all products.

**Query Parameters:**
- `page` (optional) - Page number for pagination
- `limit` (optional) - Number of items per page
- `search` (optional) - Search term to filter products by name or description

**Response:**
```json
{
  "products": [
    {
      "id": "number",
      "name": "string",
      "description": "string",
      "price": "number",
      "stock": "number",
      "image_url": "string",
      "created_at": "string",
      "updated_at": "string"
    }
  ],
  "total": "number",
  "page": "number",
  "limit": "number"
}
```

### Create Product
**POST** `/api/products`

Create a new product.

**Request Body:**
```json
{
  "name": "string",
  "description": "string",
  "price": "number",
  "stock": "number",
  "image_url": "string"
}
```

**Response:**
```json
{
  "id": "number",
  "name": "string",
  "description": "string",
  "price": "number",
  "stock": "number",
  "image_url": "string",
  "created_at": "string",
  "updated_at": "string"
}
```

### Get Product by ID
**GET** `/api/products/{id}`

Retrieve a specific product by ID.

**Response:**
```json
{
  "id": "number",
  "name": "string",
  "description": "string",
  "price": "number",
  "stock": "number",
  "image_url": "string",
  "created_at": "string",
  "updated_at": "string"
}
```

### Update Product
**PUT** `/api/products/{id}`

Update a product's information.

**Request Body:**
```json
{
  "name": "string",
  "description": "string",
  "price": "number",
  "stock": "number",
  "image_url": "string"
}
```

**Response:**
```json
{
  "id": "number",
  "name": "string",
  "description": "string",
  "price": "number",
  "stock": "number",
  "image_url": "string",
  "created_at": "string",
  "updated_at": "string"
}
```

### Delete Product
**DELETE** `/api/products/{id}`

Delete a product.

**Response:**
```json
{
  "message": "Product deleted successfully"
}
```

## Orders

### Get All Orders
**GET** `/api/orders`

Retrieve a list of all orders.

**Query Parameters:**
- `page` (optional) - Page number for pagination
- `limit` (optional) - Number of items per page
- `status` (optional) - Filter by order status

**Response:**
```json
{
  "orders": [
    {
      "id": "number",
      "user_id": "number",
      "total_amount": "number",
      "status": "string",
      "created_at": "string",
      "updated_at": "string",
      "user": {
        "id": "number",
        "name": "string",
        "email": "string"
      }
    }
  ],
  "total": "number",
  "page": "number",
  "limit": "number"
}
```

### Get Order by ID
**GET** `/api/orders/{id}`

Retrieve a specific order by ID with its items.

**Response:**
```json
{
  "id": "number",
  "user_id": "number",
  "total_amount": "number",
  "status": "string",
  "created_at": "string",
  "updated_at": "string",
  "user": {
    "id": "number",
    "name": "string",
    "email": "string"
  },
  "items": [
    {
      "id": "number",
      "order_id": "number",
      "product_id": "number",
      "quantity": "number",
      "price": "number",
      "product": {
        "id": "number",
        "name": "string",
        "price": "number"
      }
    }
  ]
}
```

### Update Order
**PUT** `/api/orders/{id}`

Update an order's status.

**Request Body:**
```json
{
  "status": "string" // "PENDING" | "PAID" | "SHIPPED" | "COMPLETED" | "CANCELLED"
}
```

**Response:**
```json
{
  "id": "number",
  "user_id": "number",
  "total_amount": "number",
  "status": "string",
  "created_at": "string",
  "updated_at": "string"
}
```

## Media

### Get All Media
**GET** `/api/media`

Retrieve a list of all media files.

**Query Parameters:**
- `page` (optional) - Page number for pagination
- `limit` (optional) - Number of items per page

**Response:**
```json
{
  "media": [
    {
      "id": "number",
      "filename": "string",
      "url": "string",
      "file_type": "string",
      "file_size": "number",
      "uploaded_by": "number",
      "created_at": "string"
    }
  ],
  "total": "number",
  "page": "number",
  "limit": "number"
}
```

### Upload Media
**POST** `/api/media`

Upload a new media file.

**Request Body (multipart/form-data):**
- `file` - The file to upload

**Response:**
```json
{
  "id": "number",
  "filename": "string",
  "url": "string",
  "file_type": "string",
  "file_size": "number",
  "uploaded_by": "number",
  "created_at": "string"
}
```

### Get Media by ID
**GET** `/api/media/{id}`

Retrieve a specific media file by ID.

**Response:**
```json
{
  "id": "number",
  "filename": "string",
  "url": "string",
  "file_type": "string",
  "file_size": "number",
  "uploaded_by": "number",
  "created_at": "string"
}
```

### Delete Media
**DELETE** `/api/media/{id}`

Delete a media file.

**Response:**
```json
{
  "message": "Media file deleted successfully"
}
```

## Settings

### Get All Settings
**GET** `/api/settings`

Retrieve all application settings.

**Response:**
```json
{
  "settings": [
    {
      "id": "number",
      "key_name": "string",
      "value": "string",
      "description": "string"
    }
  ]
}
```

### Update Setting
**PUT** `/api/settings`

Update a specific setting.

**Request Body:**
```json
{
  "key_name": "string",
  "value": "string"
}
```

**Response:**
```json
{
  "id": "number",
  "key_name": "string",
  "value": "string",
  "description": "string"
}
```

## Dashboard Stats

### Get Dashboard Statistics
**GET** `/api/dashboard/stats`

Retrieve dashboard statistics for the admin panel.

**Response:**
```json
{
  "totalUsers": "number",
  "totalProducts": "number",
  "totalOrders": "number",
  "totalRevenue": "number"
}
```

## Error Responses

All endpoints may return the following error responses:

**400 Bad Request**
```json
{
  "error": "string",
  "message": "string"
}
```

**401 Unauthorized**
```json
{
  "error": "Unauthorized",
  "message": "Authentication required"
}
```

**403 Forbidden**
```json
{
  "error": "Forbidden",
  "message": "Insufficient permissions"
}
```

**404 Not Found**
```json
{
  "error": "Not Found",
  "message": "Resource not found"
}
```

**500 Internal Server Error**
```json
{
  "error": "Internal Server Error",
  "message": "Something went wrong"
}
```