import { Task, User } from "../../../mongoose/models";

interface UpdateTaskArgs {
  taskId: string;
  taskName?: string;
  description?: string;
  isDone?: boolean;
  priority?: number;
  tags?: string[];
  userId: string;
}

export const updateTask = async (_: any, args: UpdateTaskArgs) => {
  try {
    const { taskId, userId, ...updateData } = args;

    const user = await User.findOne({ userId });
    if (!user) {
      throw new Error("User not found");
    }

    const task = await Task.findById(taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    if (task.userId !== userId) {
      throw new Error("Unauthorized: You don't have permission to update this task");
    }

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      {
        ...updateData,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    return updatedTask;
  } catch (error: any) {
    throw new Error(error.message || "Failed to update task");
  }
}; 