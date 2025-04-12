import { addTask } from "./mutations/add-task";
import { updateTask } from "./mutations/update-task";
import { getAllTasks } from "./queries/get-all-tasks";
import { getUserDoneTasksLists } from "./queries/get-user-done-tasks-lists";

export const resolvers = {
  Query: {
    getAllTasks,
    getUserDoneTasksLists,
  },
  Mutation: {
    addTask,
    updateTask,
  },
};
