## Current Backend Technology

Your project's backend is built using **Node.js with the Express.js framework**.

*   **Framework:** **Express.js** is used for handling API routes, middleware, and overall server logic. This is confirmed by `const express = require("express");` and `app.use(express.json());` in your `server/app.js` file.
*   **Database:** The current database in use is **MySQL**, managed through the **Prisma ORM (Object-Relational Mapper)**. This is indicated by your `prisma/schema.prisma` file (which specifies `provider = "mysql"`) and the `DATABASE_URL` environment variable configured for MySQL.
*   **Structure:** The backend is organized with:
    *   `server/app.js`: The main entry point, setting up Express, middleware (logging, rate limiting, CORS), and routing.
    *   `server/routes`: Defines API endpoints (e.g., `productsRouter`, `categoryRouter`).
    *   `server/controllers`: Contains the business logic for each route, interacting with the database via Prisma Client.
    *   `prisma/schema.prisma`: Defines your database schema (models, relations) for Prisma.

## Plan to Migrate to MongoDB with Express.js and Prisma

You've expressed a desire to switch your database from MySQL to **MongoDB** while continuing to use an **Express.js** backend. This is a significant architectural change, primarily centered around updating your data layer. Here's a detailed plan:

### Step 1: Update Prisma Configuration to Use MongoDB

The first and most crucial step is to tell Prisma to connect to a MongoDB database instead of MySQL.

1.  **Modify `prisma/schema.prisma`:**
    *   Change the `provider` in your `datasource db` block from `"mysql"` to `"mongodb"`.

    ```prisma
    // Before:
    // datasource db {
    //   provider = "mysql"
    //   url      = env("DATABASE_URL")
    // }

    // After:
    datasource db {
      provider = "mongodb"
      url      = env("DATABASE_URL")
    }
    ```

2.  **Update `.env` Files (Project Root and `server/.env`):**
    *   Change the `DATABASE_URL` to a MongoDB connection string. This URL will point to your MongoDB instance.
    *   **Example MongoDB `DATABASE_URL`:**
        *   For a local MongoDB instance: `mongodb://localhost:27017/your_database_name`
        *   For MongoDB Atlas (cloud service): `mongodb+srv://<username>:<password>@<cluster-url>/your_database_name?retryWrites=true&w=majority`

### Step 2: Adapt Prisma Schema for MongoDB

MongoDB is a document database, and while Prisma bridges the gap, you'll need to make specific adjustments to your `schema.prisma` to correctly map to MongoDB collections and leverage its features.

1.  **ID Fields (`@id`, `@default`, `@map`, `@db.ObjectId`):**
    *   MongoDB uses `ObjectId` for its primary keys (`_id`). You'll need to update your `id` fields in each model.
    *   Ensure each model has an `id` field defined as `String` with `ObjectId` attributes.

    ```prisma
    model User {
      id          String    @id @default(auto()) @map("_id") @db.ObjectId
      email       String    @unique
      // ... other fields
    }

    model Product {
      id          String    @id @default(auto()) @map("_id") @db.ObjectId
      // ... other fields
    }
    ```

2.  **Relationships:**
    *   Prisma handles relationships for MongoDB differently than for relational databases. For one-to-many or many-to-many relationships, you will typically link documents by referencing their `ObjectId`s.
    *   If you had explicit `@relation(fields: [someId], references: [id])` directives, you might need to adjust them. Prisma will use the `_id` field of the related document.
    *   Consider **embedding** small, frequently accessed related data directly into a document (e.g., embedding category details directly into a product document if categories are simple and only associated with one product) to optimize queries and reduce joins (which are less native to MongoDB). This would mean removing the `Category` model if it's always embedded, or having a separate `Category` model and referencing its `ObjectId` in `Product`.

    ```prisma
    // Example: Product referencing a Category
    model Product {
      id          String    @id @default(auto()) @map("_id") @db.ObjectId
      // ...
      categoryId  String    @db.ObjectId // Reference to Category's ObjectId
      category    Category? @relation(fields: [categoryId], references: [id])
    }

    model Category {
      id          String    @id @default(auto()) @map("_id") @db.ObjectId
      // ...
      products    Product[] // A list of products in this category
    }
    ```

3.  **Generate New Prisma Client:**
    *   After modifying your `schema.prisma`, you *must* generate a new Prisma Client.

    ```bash
    npx prisma generate
    ```
    This command reads your updated schema and generates a new Prisma Client tailored for MongoDB.

### Step 3: Initialize and (Manually) Migrate Data

1.  **Apply Schema to MongoDB:**
    *   For development, you can use `prisma db push` to quickly create collections in your MongoDB database based on your `schema.prisma`.

    ```bash
    npx prisma db push
    ```
    *   **Important:** Unlike relational databases where `prisma migrate dev` tracks schema changes, for MongoDB, `prisma db push` is often used to *directly synchronize* your schema with the database. There isn't a traditional "migration" concept with version control for MongoDB in Prisma currently.

2.  **Data Migration (Crucial and Manual):**
    *   **This is the most critical part.** Your existing data in MySQL will **NOT** automatically transfer to MongoDB. You will need to perform a manual data migration:
        *   **Export Data from MySQL:** Use MySQL tools (e.g., `mysqldump`, MySQL Workbench, or custom scripts) to export your existing data.
        *   **Transform Data:** Write scripts (e.g., Node.js scripts) to read the exported MySQL data and transform it into the structure expected by your new MongoDB schema (e.g., converting IDs to `ObjectId` format, restructuring embedded documents).
        *   **Import Data into MongoDB:** Use MongoDB tools (e.g., `mongoimport` or custom scripts using MongoDB drivers) to import the transformed data into your new MongoDB collections.

### Step 4: Refactor Backend API Endpoints (if necessary)

*   **Controllers (`server/controllers`):** Most of your controller logic that interacts with `prisma.client` should continue to work. Prisma abstracts the underlying database.
*   **Schema-Specific Queries:** If you've made significant changes to your schema by embedding documents or altering relationships in a "MongoDB-native" way, you might need to adjust some queries in your controllers to reflect the new data structure. For example, if you embedded categories into products, you wouldn't query a separate `category` collection.

### Summary of Effort

Migrating from a relational database (MySQL) to a document database (MongoDB) is a **major undertaking**, especially when a project is already developed. It involves:
*   Updating configurations.
*   **Rethinking and adapting your entire database schema.**
*   **Manual, script-based data migration.**
*   Potentially adjusting backend logic to optimize for the new document structure.

While Express.js is already in use, the database switch requires significant development effort and careful testing.
