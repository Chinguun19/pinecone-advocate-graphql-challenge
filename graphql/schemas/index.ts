import { gql } from "graphql-tag";

export const typeDefs = gql`
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

  type Query {
    helloQuery: String
    getAllTasks(userId: String!): [Task]!
    getUserDoneTasksLists(userId: String!): [Task]!
  }

  type Mutation {
    sayHello(name: String!): String
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
`;
