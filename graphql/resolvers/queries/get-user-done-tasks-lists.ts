import { Task, User } from "../../../mongoose/models";

interface GetUserDoneTasksListsArgs {
  userId: string;
}

export const getUserDoneTasksLists = async (_: any, args: GetUserDoneTasksListsArgs) => {
  try {
    const { userId } = args;

    // Check if user exists
    const user = await User.findOne({ userId });
    if (!user) {
      throw new Error("User not found");
    }

    // Get all completed tasks (isDone: true) for the user
    const doneTasks = await Task.find({ 
      userId, 
      isDone: true 
    }).sort({ updatedAt: -1 });

    return doneTasks;
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch completed tasks");
  }
}; 