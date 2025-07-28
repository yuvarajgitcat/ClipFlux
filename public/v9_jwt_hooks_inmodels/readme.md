# User and Video Model with Hooks and JWT  
### Notes from Chai aur Code – Nov 10, 2023

## Overview

This video covers modeling **User** and **Video** schemas for a MERN stack backend, focusing on advanced concepts like aggregation pipelines, plugin usage, password security (bcrypt), and authentication using JWT (JSON Web Tokens). The approach aims to resemble professional, production-grade codebases.

## 1. Project and File Structure

- The backend project is organized using best practices: models are in their own folder, each schema has its own file (e.g., \`user.model.js\` and \`video.model.js\`).
- Linked resources and code:  
  - All material is available on [GitHub](https://github.com/hiteshchoudhary/chai-backend).  
  - For communication and support: [Discord](https://hitesh.ai/discord), [WhatsApp](https://hitesh.ai/whatsapp).

## 2. User Model Schema (\`user.model.js\`)

### Core Fields

| Field         | Type       | Description                                                                                 |
|---------------|------------|--------------------------------------------------------------------------------------------|
| username      | String     | Required, unique, lowercase, trimmed, indexed for optimized searching.                     |
| email         | String     | Required, unique, lowercase, trimmed.                                                      |
| fullName      | String     | Required, trimmed, not unique. Can be indexed if searching by name is needed.              |
| avatar        | String     | Required. Stores only the URL (uploaded via a third-party service like Cloudinary).        |
| coverImage    | String     | Optional. URL field.                                                                       |
| watchHistory  | [ObjectId] | Array of Video references, keeping track of what a user has watched.                       |
| password      | String     | Required, **must be stored encrypted** (never in clear text, use bcrypt for hashing).      |
| refreshToken  | String     | Used for JWT-based authentication.                                                         |
| timestamps    | Date       | Automatically managed by Mongoose for created/updated info.                                |

#### Watch History 
- Each time a video is watched, its \`ObjectId\` is pushed to \`watchHistory\`, allowing the app to display a user’s video-watching history.

## 3. Video Model Schema (\`video.model.js\`)

### Core Fields

| Field        | Type      | Description                                                                                  |
|--------------|-----------|----------------------------------------------------------------------------------------------|
| videoFile    | String    | Required. URL from Cloudinary/S3 etc.                                                        |
| thumbnail    | String    | Required. Image URL for the video preview.                                                   |
| title        | String    | Required.                                                                                    |
| description  | String    | Optional.                                                                                    |
| duration     | Number    | Required, usually fetched from upload service metadata.                                      |
| views        | Number    | Starts at 0, updated programmatically.                                                       |
| isPublished  | Boolean   | Indicates public visibility; default is \`true\`.                                              |
| owner        | ObjectId  | Reference to the User who uploaded it.                                                       |
| timestamps   | Date      | Managed by Mongoose.                                                                         |

## 4. Plugins and Aggregation

- **Mongoose Aggregate Paginate v2**:  
  - Used to enable sophisticated aggregation queries, especially for handling watch histories and analytics.
  - Aggregation pipelines allow complex data transformations directly in MongoDB, beyond CRUD operations.
- Usage:  
  - Imported and used as a plugin in the video schema (\`videoSchema.plugin(aggregatePaginate)\`).

## 5. Authentication & Security

### Password Security with bcrypt

- **Plaintext passwords are never stored.**
- **bcrypt** is used to hash passwords.
  - When saving or updating, use a **pre-save middleware** hook to hash the password if it was modified.
  - Check if the \`password\` field was modified using \`this.isModified('password')\`.
  - Store a **custom error message** when password is required.

**Example middleware:**  
\`\`\`js
userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
\`\`\`

- **Password comparison** is done using bcrypt’s \`compare()\` method.
  - A schema method (e.g., \`isPasswordCorrect\`) can be added for convenience:  
\`\`\`js
userSchema.methods.isPasswordCorrect = async function(password) {
  return await bcrypt.compare(password, this.password);
};
\`\`\`

### JWT (JSON Web Token) Authentication

- **jwt** package is used to generate signed tokens for authentication.
- JWTs require:
  - A **secret** key (stored securely in environment variables).
  - The **payload** (usually contains user id/email).
  - Optional expiration time (also managed via config).
  - Structure: header, payload, signature. The signature uses the secret to prevent tampering.

**JWT tokens are bearer tokens:**  
Whoever presents a valid token is considered authenticated (so keep them secure).

## 6. Hooks and Middleware in Mongoose

- **Hooks** (middleware) allow you to execute code before or after certain Mongoose actions (\`pre\`, \`post\`).
  - E.g., use \`pre('save')\` to hash passwords before saving to the database.
  - **Function declaration vs arrow functions**:  
    - Use regular functions (not arrow) for hooks, so \`this\` references the model instance.

## 7. Environment Variables

- Secrets, token expiry, and other sensitive info should be kept in environment variables (not source code).
  - Example: \`ACCESS_TOKEN_SECRET\`, \`ACCESS_TOKEN_EXPIRY\`.

## 8. Best Practices & Recommendations

- Use lowercase, trimmed strings for search fields, and set indexes where high-performance search is needed.
- Never store sensitive data like passwords in plaintext.
- Always structure code with scalability in mind (separate models, plugins, config).
- Use plugins for advanced MongoDB capabilities (aggregation, pagination).
- Keep all private values (keys, secrets, expiry times) in environment configs.
- Comment your code and models thoroughly for maintainability.

## 9. Useful Packages

- **bcrypt** for password hashing/security.
- **jsonwebtoken (jwt)** for authentication.
- **mongoose-aggregate-paginate-v2** for advanced, production-grade Mongoose aggregations.

## 10. Key Takeaways

- Model design should anticipate **real-world, production-scale features**: history, ownership, media uploads, and advanced querying.
- **Secure authentication** and **password handling** are vital; never compromise on them.
- **Plugin and middleware usage** in Mongoose makes your codebase more robust and scalable.
- **JWT** is industry-standard for stateless, scalable authentication in MERN projects.
- **Aggregation pipelines** unlock a new level of power in MongoDB for analytics and multi-table relations, going far beyond basic CRUD.

*These notes are a comprehensive summary based on the referenced video and are suitable as a .md (Markdown) document for backend MERN stack learners and developers.*
