## Product Management Logic for Administrators

This section details how an administrator can add, modify, and delete products within the application.

### 1. Adding a New Product

*   **Navigation:** An administrator accesses the product creation page by navigating to `/admin/products/new` in the admin dashboard.
*   **User Interface:** This page presents a form where the administrator inputs various details for the new product. Key fields typically include:
    *   `title`: The name of the product.
    *   `slug`: A URL-friendly identifier for the product (often auto-generated from the title).
    *   `price`: The selling price of the product.
    *   `manufacturer`: The brand or manufacturer of the product.
    *   `description`: A detailed text description of the product.
    *   `mainImage`: The primary image for the product.
    *   `inStock`: The current stock quantity.
    *   `categoryId`: The category the product belongs to (selected from a list of existing categories).
    *   `merchantId`: The merchant associated with the product (selected from a list of existing merchants).
*   **Client-Side Logic (`app/(dashboard)/admin/products/new/page.tsx`):**
    *   The component manages the form state using `useState`.
    *   Upon form submission, an `addProduct` function is triggered.
    *   This function performs client-side validation to ensure all required fields are filled and meet basic criteria (e.g., title is not empty, price is a number).
    *   It then constructs a product object from the form data.
    *   It makes an asynchronous `POST` request to the backend API endpoint `/api/products` using `apiClient.post()`, sending the product data in the request body.
    *   If the API call is successful, a success notification (`toast.success`) is displayed, and the form fields are typically reset.
    *   If the API call fails (e.g., due to server-side validation errors or a network issue), an error notification (`toast.error`) is shown to the administrator.

### 2. Modifying an Existing Produc&t

*   **Navigation:** An administrator can typically reach the product editing page by clicking on a product in the product listing (e.g., at `/admin/products`). This navigates them to a dynamic route like `/admin/products/[id]`, where `[id]` is the unique identifier of the product.
*   **User Interface:** The editing page presents a form pre-filled with the existing product's details.
*   **Client-Side Logic (`app/(dashboard)/admin/products/[id]/page.tsx`):**
    *   When the page loads, an `useEffect` hook (or similar mechanism) fetches the current product data from the backend using a `GET` request to `/api/products/:id`.
    *   The `useState` hook then populates the form fields with this data.
    *   The administrator modifies the desired fields in the form.
    *   Upon saving changes, an `updateProduct` function is triggered.
    *   This function performs client-side validation.
    *   It constructs an updated product object.
    *   It makes an asynchronous `PUT` request to the backend API endpoint `/api/products/:id` using `apiClient.put()`, sending the updated product data.
    *   On success, a success notification is displayed.
    *   On failure, an error notification is shown.

### 3. Deleting a Product

*   **Initiation:** From the product details/editing page (`/admin/products/[id]`), there is typically a button to delete the product.
*   **Client-Side Logic (`app/(dashboard)/admin/products/[id]/page.tsx`):**
    *   Clicking the delete button triggers a `deleteProduct` function.
    *   This function makes an asynchronous `DELETE` request to the backend API endpoint `/api/products/:id` using `apiClient.delete()`.
    *   The code includes error handling for potential database constraints (e.g., "Cannot delete the product because of foreign key constraint"), meaning that if the product is linked to other data (like order items), it might need to be unlinked or those related items deleted first.
    *   On successful deletion, a success notification is shown, and the administrator is redirected to the main product listing page (`/admin/products`).
    *   On failure, an error notification is displayed.

## Data Storage with MongoDB

The current project uses **MySQL** as its database, managed through **Prisma ORM**. Switching to **MongoDB** (a NoSQL document database) is a significant architectural change and not a simple drop-in replacement. It involves several complex steps:

1.  **Prisma Configuration Adjustment:**
    *   You would need to modify your `prisma/schema.prisma` file to change the `datasource db` provider from `"mysql"` to `"mongodb"`.
    *   The `DATABASE_URL` in your `.env` file would need to be updated to a MongoDB connection string (e.g., `mongodb://localhost:27017/your_database_name` or a URL for a cloud-hosted MongoDB service like MongoDB Atlas).

2.  **Schema Re-evaluation for Document Model:**
    *   While Prisma allows defining a schema for MongoDB, you should fundamentally rethink your data model to best utilize MongoDB's document-oriented nature. This might involve:
        *   **Embedding** related data directly within documents (e.g., embedding a product's category details directly into the product document if categories are small and always accessed with products) instead of always using separate collections and strict relational joins.
        *   Adjusting ID types: MongoDB uses `ObjectId` for primary keys. Your `id` fields in `schema.prisma` would need `@id @default(auto()) @map("_id") @db.ObjectId`.
        *   Handling relationships: Relational concepts like one-to-many or many-to-many are typically managed either by embedding (for one-to-few), linking by `ObjectId` (for one-to-many/many-to-many), or using reference arrays.

3.  **Database Migration (Manual Process):**
    *   After changing your Prisma schema to MongoDB, running `npx prisma db push` or `npx prisma migrate dev` would create *new collections* in your MongoDB database based on the new schema.
    *   **Crucially, existing data from your MySQL database will NOT be automatically transferred.** You would need a separate process to:
        *   Export your data from MySQL.
        *   Transform that data to fit your new MongoDB document schema.
        *   Import the transformed data into your MongoDB collections.

4.  **Backend Logic Review:**
    *   If you significantly alter your schema to be more "MongoDB-native" (e.g., embedding), you might need to adjust some of your backend data access logic (how you query, create, update, and delete data) in your API routes and services, although Prisma's API often remains consistent regardless of the underlying database.

**Conclusion on MongoDB:**
Switching from MySQL to MongoDB is a **significant architectural change** for this project. It requires careful planning, schema redesign, and a manual data migration process. It is not a trivial task and would require substantial development effort beyond simple configuration updates.
