import { Task, User, ITask } from "../../../mongoose/models";
import { Document } from "mongoose";

type  AddTaskArgs = {
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

    const user = await User.findOne({ userId });
    if (!user) {
      throw new Error("User not found");
    }
    
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

    const savedTask = await newTask.save();
    return savedTask;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to create task";
    throw new Error(errorMessage);
  }
}; 