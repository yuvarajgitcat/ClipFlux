
# User and Video Model with Hooks, JWT, and Advanced Features  
### Notes  – Nov 10, 2023 (Consolidated)

# User and Video Model with Hooks and JWT  
### Notes  – Nov 10, 2023


## Overview

This guide covers designing **User** and **Video** Mongoose models for a MERN stack backend, incorporating:

- Advanced schema design with references and indexing  
- Secure password handling with **bcrypt** and hooks  
- JWT-based stateless authentication (access and refresh tokens)  
- Use of plugins like mongoose-aggregate-paginate-v2 for powerful aggregation queries  
- Best practices in environment variable management and project structure  

These notes synthesize both conceptual explanations and actual code snippets from the referenced video to serve as a practical resource.

---

## 1. Project and File Structure

- Backend organized with clear separation:  
  - Each schema in its own file (e.g., ``user.model.js``, ``video.model.js``) under a ``models/`` directory  
- Use of **environment variables** (``.env``) for secrets like JWT keys and expiry settings  
- Integration with third-party services for media (e.g., Cloudinary for avatars and video files)  
- Encouragement to use plugins and middleware for scalability and maintainability  

---

## 2. User Model Schema (``user.model.js``)

### Key Fields

| Field         | Type       | Description                                                                                 |
|---------------|------------|--------------------------------------------------------------------------------------------|
| ``username``    | String     | Required, unique, lowercase, trimmed, indexed for search performance                       |
| ``email``       | String     | Required, unique, lowercase, trimmed                                                      |
| ``fullName``    | String     | Required, trimmed; can be indexed for search                                              |
| ``avatar``      | String     | Required URL from external service                                                        |
| ``coverImage``  | String     | Optional URL for user's cover image                                                       |
| ``watchHistory``| [ObjectId] | Array referencing Video documents representing user's watched videos                      |
| ``password``    | String     | Required; stores bcrypt-hashed password                                                   |
| ``refreshToken``| String     | Stores JWT refresh token for session management                                           |
| timestamps    | Date       | Auto-managed fields for creation/update                                                  |

### Code (Complete Model with Hooks and Methods)

``````js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
    trim: true,
    lowercase: true,
    index: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
  },
  fullName: {
    type: String,
    required: [true, "Full name is required"],
    trim: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  coverImage: String,
  watchHistory: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
    },
  ],
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  refreshToken: String,
}, {
  timestamps: true,
});

// Pre-save hook: Hash password if modified
userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to verify password
userSchema.methods.isPasswordCorrect = async function(inputPassword) {
  return await bcrypt.compare(inputPassword, this.password);
};

// Generate JWT Access Token
userSchema.methods.generateAccessToken = function() {
  const payload = { userId: this._id, email: this.email };
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
};

// Generate JWT Refresh Token
userSchema.methods.generateRefreshToken = function() {
  const payload = { userId: this._id };
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY });
};

const User = mongoose.model("User", userSchema);
module.exports = User;
``````

---

## 3. Video Model Schema (``video.model.js``)

### Key Fields

| Field        | Type      | Description                                                                                  |
|--------------|-----------|----------------------------------------------------------------------------------------------|
| ``videoFile``  | String    | Required URL for stored video (Cloudinary, AWS S3, etc.)                                    |
| ``thumbnail``  | String    | Required image URL serving as video preview                                                 |
| ``title``      | String    | Required title of the video                                                                 |
| ``description``| String    | Optional description                                                                        |
| ``duration``   | Number    | Required duration (seconds or ms), from metadata                                           |
| ``views``      | Number    | Count of views, initialized at 0                                                            |
| ``isPublished``| Boolean   | Indicates if video is public; default: ``true``                                              |
| ``owner``      | ObjectId  | Reference to the User who uploaded the video                                                |
| timestamps   | Date      | Auto-managed creation and update timestamps                                                |

### Code (with Aggregation Plugin Applied)

``````js
const mongoose = require("mongoose");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const videoSchema = new mongoose.Schema({
  videoFile: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: String,
  duration: {
    type: Number,
    required: true,
  },
  views: { 
    type: Number, 
    default: 0 
  },
  isPublished: {
    type: Boolean,
    default: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }
}, {
  timestamps: true,
});

// Plugin to enable paginated aggregate queries
videoSchema.plugin(aggregatePaginate);

const Video = mongoose.model("Video", videoSchema);
module.exports = Video;
``````

---

## 4. Authentication & Security

### Password Security with bcrypt

- Always hash passwords **before saving** using a ``pre("save")`` hook.  
- Use a sufficiently strong salt round count (e.g., 10).  
- Never store plaintext passwords or transmit them insecurely.  

#### Example Pre-save Hook

arrow func is not used inside pre because arr fun do not have ```this``` access to access like ```this.password```
``````js
userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
``````

### Password Verification

- Compare entered password with hashed using bcrypt’s ``compare()`` method wrapped as a schema method:

``````js
userSchema.methods.isPasswordCorrect = async function(password) {
  return await bcrypt.compare(password, this.password);
};
``````

### JWT Authentication

- Generate **access** and **refresh tokens** with ``jsonwebtoken``.  
- Store secrets and expiry durations in environment variables:

  - ``ACCESS_TOKEN_SECRET`` and ``ACCESS_TOKEN_EXPIRY`` (e.g., "15m")  
  - ``REFRESH_TOKEN_SECRET`` and ``REFRESH_TOKEN_EXPIRY`` (e.g., "7d")

- Signed tokens include user id and other relevant claims to authenticate users serverlessly.

---

## 5. Mongoose Hooks and Middleware

- Use **``pre``** and **``post``** hooks for side effects (e.g., hashing, logging).  
- Use **function declarations** (not arrow functions) inside hooks to reference Mongoose document with ``this``.  
- Structure hooks to verify if fields changed (``this.isModified("field")``) before expensive operations.

---

## 6. Environment Variables Best Practices

- Never hardcode sensitive keys or secrets in code.  
- Store all private keys (``ACCESS_TOKEN_SECRET`` etc.) in **``.env``** file or secure vault.  
- Load environment variables early in app initialization.

---

## 7. Additional Best Practices

- Use **lowercase** and **trimmed** strings for searchable fields.  
- Apply **indexes** on commonly searched and unique fields.  
- Structure modular, layered code design for scalability (models, plugins, configs separated).  
- Use aggregation pipelines and plugins like **aggregatePaginate** to enable analytics and complex queries.  
- Always validate inputs and sanitize data.

---

## 8. Useful Packages

| Package                  | Purpose                                   |
|--------------------------|-------------------------------------------|
| ``bcrypt``                 | Password hashing and verification         |
| ``jsonwebtoken`` (jwt)     | Token generation and verification         |
| ``mongoose-aggregate-paginate-v2`` | Advanced aggregation with pagination     |

---

## 9. Key Takeaways

- Designing schemas with **references** enables rich relationships (e.g., user watch history).  
- Securing credentials must include **hashed passwords** and **JWT token** management.  
- Leveraging Mongoose **middleware/hooks** and **plugins** can simplify and harden your codebase.  
- JWT allows stateless, scalable authentication in RESTful MERN apps.  
- Aggregation pipelines unlock powerful querying beyond CRUD, suitable for analytics.  
- Keeping secrets in environment variables ensures safety and flexibility.  

---

*These notes represent a thorough synthesis of important coding patterns, security practices, and MongoDB/Mongoose capabilities presented in the reference Chai aur Code video, optimized for backend MERN stack development.*

---
