# A Sveltekit Framework Template

This is a project template that prioritizes organization, useability and maintainability. To achieve code cleanliness and readability, this codebase leans heavily into a highly opinionated file and directory structure while running away from as much code abstraction as possible.

As a benefit the project is mutable because the majority of the logic is not abstracted in libraries.

The two largest contributions included are the custom validations library, and the integrated postgres Drizzle-ORM library.

Additionally, this project is designed to be developed inside of a container to ensure consistently reliable development environment and tools regardless of developer or machine.

# Getting started

## Clone this repository to your new project

```bash
git clone https://github.com/username/template-repo.git ./MY-NEW-PROJECT
```

# Application Structure

```
src---|---lib---|---client---| # Client side code
      |         |            |---components
      |         |            |---emailTemplates
      |         |            |---themes
      |         |            |---utils
      |         |
      |         |---server---| # Server side code
      |         |            |auth
      |         |            |boot # Application startup logic
      |         |            |database # Client, schemas, migrations
      |         |            |emails # Email messaging logic
      |         |            |logging
      |         |            |middleware
      |         |            |providers
      |         |            |requests
      |         |
      |         |---shared---| # Server and client-side code
      |                      |api
      |                      |constants
      |                      |data
      |                      |testing
      |                      |types
      |                      |validation
      |                      
      |---routes---|
                   |+layout.svelte
                   |+layout.server.ts
                   |---(admin)
                   |---(public)
                   |---api
```


# Validation


## Validator example

```
/** src/lib/shared/ **/

```

# API

## Overview

This template favors restful-like API endpoints over page loading functions. This is to reduce the amount of magic and increase reusability.

## Client facing API endpoints are user-centric.
This means API and operations and permissibility are based on context and resemble how individual users navigate and think about their data. This increases the number of endpoints while simplifying their scope and complexity.

### Admin facing API endpoints are database-centric. 
Meaning, admin API and operations and permissibility closely resemble the database structure where information can be managed in the simplest form available. This reduces the number of api endpoints while increasing their complexity.

### Why Use Both?

1. Separation of Concerns:

    - User-Centric Endpoints: Focus on providing a seamless and intuitive experience for end-users.

    - Database-Centric Endpoints: Focus on providing comprehensive control and management capabilities for administrators.

2. Security and Permissions:

    - User-Centric Endpoints: Can enforce user-specific permissions and context-based access control, ensuring users can only perform actions relevant to their own data.

    - Database-Centric Endpoints: Can enforce admin-specific permissions, allowing administrators to perform broader and more impactful operations.

3. Maintainability and Scalability:

    - User-Centric Endpoints: Easier to maintain and scale as they are focused on specific user actions and contexts.

    - Database-Centric Endpoints: Provide a stable and consistent interface for administrative tasks, reducing the need for frequent changes.