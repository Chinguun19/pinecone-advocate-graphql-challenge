import { Task, User } from "../../../mongoose/models";

interface GetAllTasksArgs {
  userId: string;
}

export const getAllTasks = async (_: any, args: GetAllTasksArgs) => {
  try {
    const { userId } = args;
    console.log("Fetching tasks for userId:", userId); // Debug log

    const user = await User.findOne({ userId });
    console.log("User found:", user); // Debug log

    if (!user) {
      throw new Error("User not found");
    }

    const tasks = await Task.find({ userId, isDone: false }).sort({ updatedAt: -1 });
    return tasks;
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch tasks");
  }
};