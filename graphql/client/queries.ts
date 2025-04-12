import { gql } from '@apollo/client';

// Query to get all active tasks for a user
export const GET_ALL_TASKS = gql`
  query GetAllTasks($userId: String!) {
    getAllTasks(userId: $userId) {
      _id
      taskName
      description
      isDone
      priority
      tags
      createdAt
      updatedAt
      userId
    }
  }
`;

// Query to get all completed tasks for a user
export const GET_USER_DONE_TASKS = gql`
  query GetUserDoneTasksLists($userId: String!) {
    getUserDoneTasksLists(userId: $userId) {
      _id
      taskName
      description
      isDone
      priority
      tags
      createdAt
      updatedAt
      userId
    }
  }
`;

// Mutation to add a new task
export const ADD_TASK = gql`
  mutation AddTask(
    $taskName: String!
    $description: String!
    $isDone: Boolean
    $priority: Int!
    $tags: [String]
    $userId: String!
  ) {
    addTask(
      taskName: $taskName
      description: $description
      isDone: $isDone
      priority: $priority
      tags: $tags
      userId: $userId
    ) {
      _id
      taskName
      description
      isDone
      priority
      tags
      createdAt
      updatedAt
      userId
    }
  }
`;

// Mutation to update an existing task
export const UPDATE_TASK = gql`
  mutation UpdateTask(
    $taskId: ID!
    $taskName: String
    $description: String
    $isDone: Boolean
    $priority: Int
    $tags: [String]
    $userId: String!
  ) {
    updateTask(
      taskId: $taskId
      taskName: $taskName
      description: $description
      isDone: $isDone
      priority: $priority
      tags: $tags
      userId: $userId
    ) {
      _id
      taskName
      description
      isDone
      priority
      tags
      createdAt
      updatedAt
      userId
    }
  }
`; 