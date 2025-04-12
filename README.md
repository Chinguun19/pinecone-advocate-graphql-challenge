# 🌲💼 Pinecone Advocate GraphQL Challenge 🚀

## 📋 Overview

Welcome to the **Pinecone Advocate GraphQL Challenge**! 🌟

In this challenge, you will:

- 🛠️ Learn how to write **GraphQL queries and mutations**
- 🧪 Test your code using **Jest** for unit tests

This guide will walk you through:

- ⚙️ Setting up your project
- 🖋️ Implementing GraphQL operations
- 🏃‍♂️ Running commands to test your solution

Let's dive in and make learning **GraphQL** fun and exciting! 😎

## ⚙️ Setup Instructions

Here's how to get started with the project:

1. **Install Dependencies**:

   If you're using **Yarn**:

   ```bash
   yarn install

   ```

   Or, if you prefer npm:

   ```bash
   npm install
   ```

2. **Add your MongoDB Connection URL to .env File**:

   ```bash
   MONGODB_URL=YOUR_MONGODB_URL
   ```

   1. Once you've added your MongoDB connection string, start the project. If the connection is successful, you'll see connection successful in the console. If there's an issue, it will show connection Failed.

## 🚀 Required Mutations and Queries to complete challenges

In this challenge, you'll need to implement the following GraphQL operations:

### 1. **Mutations**:

- **`addTask`**:

  - This mutation creates a new todo task.
  - **Required fields**:

    - `taskName` (String) => required
    - `description` (String) => required ( must be at least 10 characters long )
    - `isDone` (Boolean) => default to `false`
    - `priority` (Int) => required (values 1-5)
    - `tags` (Array of Strings) => optional, allows categorization
    - `createdAt` (Date)
    - `updatedAt` (Date)
    - `_id` (MongoDB Object Id)
    - `userId` (String) → required (owner of the task)
  - **Validation**:
    - `taskName` must be unique per user
    - `description` cannot be the same as taskName
    - `tags` length <= 5

- **`updateTask`**:
  - This mutation updates an existing task's details using its `taskId`.
  - `userId` must be provided to updateTask mutation.
    - ❌ If the user does not exist, return an error.
    - ❌ If the user does not own the task being updated, return an error indicating unauthorized.
  - **Fields to update**:
    - Only the task owner can update
    - `taskName` (String)
    - `description` (String)
    - `priority` (Int) => validate within range 1-5
    - `isDone` (Boolean)
    - `tags` (Array of Strings) => append or remove tags


### 2. **Queries**:

- **`getUserDoneTasksLists`**:

  - This query retrieves all tasks that have been marked as done by the specified user.
  - **Required arguments**:
    - userId (String) – the ID of the user whose completed tasks you want to retrieve.
  - ❗ If the user with the given userId does not exist, return an appropriate error (e.g., "User not found").
  - ✅ If the user exists, return all tasks where:
    - userId matches the provided ID
    - isDone is true


## ⚙️ Command Instructions

Here's how to run the project after implementing the GraphQL operations:

**Start the Project**:

To start the development server, run:

```bash
yarn dev
```

1. Then open [Apollo Studio Sandbox](https://studio.apollographql.com/sandbox/explorer) and add your local GraphQL endpoint (e.g., `http://localhost:3000/api/graphql`) to start testing your queries and mutations.

**Run Tests**:

To run your Jest tests and ensure everything works as expected, use:

```bash
yarn test
```

Good luck on the challenge! 🍀

Don't forget to read the **PDF file** for instructions on how to submit your challenge.

We hope you do great, and we look forward to seeing you in the **final interview**! 🎉

# Pinecone Advocate GraphQL Challenge

This repository contains the implementation for the Pinecone Advocate GraphQL Challenge. The challenge involves building a GraphQL-based task management system with specific mutations and queries, along with thorough testing.

## Implemented Features

### Mutations:
1. **addTask**: Creates a new todo task with validation.
2. **updateTask**: Updates an existing task's details with proper authorization.

### Queries:
1. **getUserDoneTasksLists**: Retrieves all completed tasks for a specific user.
2. **getAllTasks**: Fetches all active (non-completed) tasks for a specific user.

## Technical Requirements
- MongoDB database for storage
- GraphQL API with Apollo Server
- 100% test coverage for all resolvers

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- Yarn (or npm)
- MongoDB database (local or cloud-based)

### Installation
1. Clone this repository:
   ```sh
   git clone <repository-url>
   cd advocate-challenge
   ```

2. Install dependencies:
   ```sh
   yarn install
   # or
   npm install
   ```

3. Configure your environment:
   - Create a `.env` file in the root directory
   - Add your MongoDB connection string:
   ```
   MONGODB_URL=your_mongodb_connection_string
   ```

4. Start the development server:
   ```sh
   yarn dev
   # or
   npm run dev
   ```

5. Seed the database with sample data (optional):
   ```sh
   npx ts-node mongoose/seed.ts
   ```

### Testing
Run tests and generate coverage report:
```sh
yarn test
# or
npm test
```

Run tests in watch mode:
```sh
yarn test:watch
# or
npm run test:watch
```

## GraphQL Schema

### Task Type
```graphql
type Task {
  _id: ID!
  taskName: String!
  description: String!
  isDone: Boolean!
  priority: Int!
  tags: [String]
  createdAt: String!
  updatedAt: String!
  userId: String!
}
```

### Queries
```graphql
type Query {
  getAllTasks(userId: String!): [Task]!
  getUserDoneTasksLists(userId: String!): [Task]!
}
```

### Mutations
```graphql
type Mutation {
  addTask(
    taskName: String!
    description: String!
    isDone: Boolean
    priority: Int!
    tags: [String]
    userId: String!
  ): Task
  
  updateTask(
    taskId: ID!
    taskName: String
    description: String
    isDone: Boolean
    priority: Int
    tags: [String]
    userId: String!
  ): Task
}
```

## Validation Rules
- **taskName**: Must be unique per user
- **description**: Must be at least 10 characters long and different from the taskName
- **priority**: Must be between 1-5
- **tags**: Maximum 5 tags allowed

## Authorization Rules
- Only the task owner can update their tasks
- User existence is checked for all operations

## Sample Queries and Mutations

### Create a New Task
```graphql
mutation {
  addTask(
    taskName: "Learn GraphQL"
    description: "Study GraphQL schema design and resolver implementation"
    priority: 2
    tags: ["learning", "graphql"]
    userId: "user1"
  ) {
    _id
    taskName
    description
    isDone
    priority
    tags
    createdAt
    updatedAt
  }
}
```

### Update a Task
```graphql
mutation {
  updateTask(
    taskId: "task-id-here"
    taskName: "Updated Task Name"
    isDone: true
    userId: "user1"
  ) {
    _id
    taskName
    description
    isDone
    updatedAt
  }
}
```

### Get All Active Tasks
```graphql
query {
  getAllTasks(userId: "user1") {
    _id
    taskName
    description
    priority
    tags
    createdAt
  }
}
```

### Get Completed Tasks
```graphql
query {
  getUserDoneTasksLists(userId: "user1") {
    _id
    taskName
    description
    priority
    tags
    updatedAt
  }
}
```
