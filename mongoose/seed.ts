import mongoose from 'mongoose';
import { User, Task } from './models';
import { connectMongoose } from './mongoose-connection';

// Sample users
const users = [
  {
    userId: 'user1',
    name: 'Test User 1'
  },
  {
    userId: 'user2',
    name: 'Test User 2'
  }
];

// Sample tasks for user1
const user1Tasks = [
  {
    taskName: 'Complete GraphQL Challenge',
    description: 'Implement mutations and queries for the Pinecone Advocate Challenge',
    isDone: false,
    priority: 1,
    tags: ['graphql', 'pinecone', 'challenge'],
    userId: 'user1',
  },
  {
    taskName: 'Write Tests',
    description: 'Ensure 100% test coverage for the GraphQL resolvers',
    isDone: false,
    priority: 2,
    tags: ['testing', 'jest'],
    userId: 'user1',
  },
  {
    taskName: 'Submit Challenge',
    description: 'Create a pull request with the completed challenge',
    isDone: false,
    priority: 3,
    userId: 'user1',
  },
  {
    taskName: 'Previous Task',
    description: 'This task has been completed already',
    isDone: true,
    priority: 4,
    tags: ['done', 'completed'],
    userId: 'user1',
  }
];

// Sample tasks for user2
const user2Tasks = [
  {
    taskName: 'Learn GraphQL',
    description: 'Study GraphQL fundamentals and best practices',
    isDone: false,
    priority: 2,
    tags: ['learning', 'graphql'],
    userId: 'user2',
  },
  {
    taskName: 'Practice Testing',
    description: 'Improve testing skills with Jest and GraphQL',
    isDone: true,
    priority: 3,
    userId: 'user2',
  }
];

/**
 * Seed the database with sample data
 */
export const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await connectMongoose();
    
    // Clear existing data
    await User.deleteMany({});
    await Task.deleteMany({});
    
    // Insert users
    const createdUsers = await User.insertMany(users);
    console.log(`${createdUsers.length} users created.`);
    
    // Insert tasks
    const allTasks = [...user1Tasks, ...user2Tasks];
    const createdTasks = await Task.insertMany(allTasks);
    console.log(`${createdTasks.length} tasks created.`);
    
    console.log('Database seeded successfully!');
    
    // Close the connection
    await mongoose.connection.close();
    
    return { users: createdUsers, tasks: createdTasks };
  } catch (error) {
    console.error('Error seeding database:', error);
    // Close the connection on error
    await mongoose.connection.close();
    throw error;
  }
};

// Run the seed function if this script is executed directly
const isMain = () => {
  // In Node.js, this check determines if file is being run directly
  try {
    return require.main === module;
  } catch {
    return false;
  }
};

const exitProcess = (code: number) => {
  try {
    // Only exit if process is available (Node.js environment)
    process.exit(code);
  } catch {
    // Do nothing if not in Node.js environment
  }
};

if (isMain()) {
  seedDatabase()
    .then(() => {
      console.log('Seeding completed. Exiting...');
      exitProcess(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      exitProcess(1);
    });
} 