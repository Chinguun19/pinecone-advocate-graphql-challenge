import { Task, User } from "../../../mongoose/models";

interface GetUserDoneTasksListsArgs {
  userId: string;
}

export const getUserDoneTasksLists = async (_: any, args: GetUserDoneTasksListsArgs) => {
  try {
    const { userId } = args;

    const user = await User.findOne({ userId });
    if (!user) {
      throw new Error("User not found");
    }

    const doneTasks = await Task.find({ 
      userId, 
      isDone: true 
    }).sort({ updatedAt: -1 });

    return doneTasks;
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch completed tasks");
  }
}; 