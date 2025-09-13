# Professional Backend Project Setup — Notes

---

## Table of Contents

1. [Introduction](#introduction)
2. [Project Vision and Approach](#project-vision-and-approach)
3. [Planning and Design Phase](#planning-and-design-phase)
4. [Data Modeling](#data-modeling)
5. [Initial Code & Repository Setup](#initial-code--repository-setup)
6. [Recommended Project Structure (Explained)](#recommended-project-structure-explained)
7. [Version Control & .gitignore](#version-control--gitignore)
8. [Environment Variables Management](#environment-variables-management)
9. [Essential Tooling: Nodemon and Prettier](#essential-tooling-nodemon-and-prettier)
10. [Summary & Next Steps](#summary--next-steps)

---

## Introduction

This README provides a guide for setting up a professional backend project, focusing on maintainability, scalability, and industry standards. It summarizes best practices and a standardized folder structure for robust teamwork and future growth.

---

## Project Vision and Approach

- **Goal:** Build backends using patterns and structures favored in top companies.
- **Mindset:** Avoid shortcuts; focus on thoughtful, production-ready decisions.
- **Collaboration:** Prepare for real-world scenarios, including collaboration with frontend and other teams.

---

## Planning and Design Phase

- **Separation of Concerns:** UI/UX design is handled by designers; backend teams receive finalized UI/UX assets (such as Figma files) to understand required APIs and data.
- **APIs & Data:** Backend focuses on data modeling and serving well-documented, secure APIs.

---

## Data Modeling

- **Begin by listing core data entities** (users, videos, etc.).
- **Models should reflect real use cases**: For example, a user might have arrays for liked videos and watch history.
- **Adaptability:** Don't hardcode for a single situation—plan for future changes and feature additions.

---

## Initial Code & Repository Setup

1. **Start with an Empty Project Folder**
    - Open in your IDE (like VS Code).
2. **Initialize NPM and Git**
    - Run `npm init` and fill out relevant fields.
    - Run `git init`, commit initial files, and connect to a remote repository if desired.
3. **Write a Clear README**
    - Document project purpose, tech stack, and useful resources.

---

## Recommended Project Structure (Explained)

Organize your project with these main directories and files:

- **public/**  
  _For static files and uploads. May include a_ `public/temp/` _subfolder for temporary files._  
  _To keep empty folders in git, add a blank file named `.keep` in them._

- **src/**  
  _Main source code lives here; split into logical modules to support separation of concerns:_
  - **src/constants/** — For shared constants (e.g. error messages, enums)
  - **src/controllers/** — Route handler logic (“controller” functions)
  - **src/db/** — Database setup and connection files
  - **src/middlewares/** — Custom Express middlewares (e.g. authentication, error handling)
  - **src/models/** — Data models/schemas (e.g. Mongoose schemas)
  - **src/routes/** — Route definitions, organized by entity
  - **src/utils/** — Helper functions (e.g., email sender, token generator)

- **.gitignore**  
  _Exclude files/folders like `node_modules`, `.env`, logs, etc. Use a template from [gitignore.io](https://www.toptal.com/developers/gitignore)._

- **.env**  
  _Environment variables. Should NOT be committed. See below._

- **.env.sample**  
  _Template for teammates: Show all required environment variable names, but leave values blank or generic._

- **README.md**  
  _Project documentation (this file)._

- **package.json / package-lock.json**  
  _Package definitions._

**Sample structure in words:**
- At your project root, have: `.gitignore`, `.env`, `.env.sample`, `README.md`, `package.json`, `public/` folder, and `src/` folder.
- Inside `public/`, you may have a subfolder for temp or uploads, with placeholder files as needed.
- Inside `src/`, create folders: `constants`, `controllers`, `db`, `middlewares`, `models`, `routes`, `utils`.
- use `mkdir foldername1, foldername2` to make new folders and use `ni filename` to make new files (new-item).

---

## Version Control & .gitignore

- **Keep .env and sensitive files out of git.**
- **Track empty folders** by adding a file named `.keep` inside them.
- **Standard .gitignore** should include:
    ```
    node_modules/
    .env
    logs/
    *.log
    public/temp/
    ```

---

## Environment Variables Management

- **Never commit your `.env` file!**
- Share a **`.env.sample`** with variable names (`DB_URL=`, `PORT=`, etc.) for collaborators.
- **Access variables in code** with packages like `dotenv` (load early in your app).

---

## Essential Tooling: Nodemon and Prettier

- **Nodemon:**  
  _Hot-reloads your backend server while developing._  
  Install as dev dependency:  
  `npm i --save-dev nodemon`  
  Add a script to your package.json:  
  `"dev": "nodemon src/index.js"`
- **Prettier:**  
  _Code formatter for consistent style._  
  Install as dev dependency:  
  `npm i --save-dev prettier`  
  Add a `.prettierrc` file (for configuration) and `.prettierignore` to exclude files.

---

## Summary & Next Steps

- Your project is now ready for serious development, with emphasis on maintainability, collaboration, and professionalism.
- Next, start implementing your application logic—models, controllers, routes, and robust error handling.
- Always keep the structure clean; create new folders/files as your project grows, using the patterns above.

---

**References:**
- [Chai aur Code — How to setup a professional backend project](https://youtu.be/9B4CvtzXRpc?si=RL0xnPcgRQGGMpNL)
- [Chai aur Code YouTube](https://www.youtube.com/@chaiaurcode)
