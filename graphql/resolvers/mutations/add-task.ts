import { Task, User, ITask } from "../../../mongoose/models";
import { Document } from "mongoose";

interface AddTaskArgs {
  taskName: string;
  description: string;
  isDone?: boolean;
  priority: number;
  tags?: string[];
  userId: string;
}

interface TaskResponse extends Omit<ITask, keyof Document> {
  _id: string;
}

export const addTask = async (_: any, args: AddTaskArgs): Promise<any> => {
  try {
    const { taskName, description, isDone = false, priority, tags = [], userId } = args;

    // Check if user exists
    const user = await User.findOne({ userId });
    if (!user) {
      throw new Error("User not found");
    }
    
    // Create new task
    const newTask = new Task({
      taskName,
      description,
      isDone,
      priority,
      tags,
      userId,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Save and return the new task
    const savedTask = await newTask.save();
    return savedTask;
  } catch (error) {
    // Throw a meaningful error message
    const errorMessage = error instanceof Error ? error.message : "Failed to create task";
    throw new Error(errorMessage);
  }
}; 