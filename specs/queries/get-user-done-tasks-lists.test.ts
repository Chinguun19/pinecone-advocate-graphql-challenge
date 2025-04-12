import { getUserDoneTasksLists } from "../../graphql/resolvers/queries/get-user-done-tasks-lists";
import { Task, User } from "../../mongoose/models";

jest.mock("../../mongoose/models", () => ({
  User: {
    findOne: jest.fn(),
  },
  Task: {
    find: jest.fn().mockReturnThis(),
    sort: jest.fn(),
  },
}));

describe("getUserDoneTasksLists query", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return all completed tasks for a user", async () => {
    const userId = "user123";
    const mockTasks = [
      {
        _id: "task1",
        taskName: "Completed Task 1",
        description: "Description 1",
        isDone: true,
        priority: 2,
        userId,
      },
      {
        _id: "task2",
        taskName: "Completed Task 2",
        description: "Description 2",
        isDone: true,
        priority: 3,
        userId,
      },
    ];

    (User.findOne as jest.Mock).mockResolvedValue({ userId, name: "Test User" });

    (Task.find as jest.Mock).mockReturnThis();
    (Task.sort as jest.Mock).mockResolvedValue(mockTasks);

    const result = await getUserDoneTasksLists(null, { userId });

    
    expect(User.findOne).toHaveBeenCalledWith({ userId });
    expect(Task.find).toHaveBeenCalledWith({ userId, isDone: true });
    expect(Task.sort).toHaveBeenCalledWith({ updatedAt: -1 });
    expect(result).toEqual(mockTasks);
  });

  it("should throw an error if user not found", async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);

    await expect(getUserDoneTasksLists(null, { userId: "nonexistent" })).rejects.toThrow("User not found");
    expect(User.findOne).toHaveBeenCalledWith({ userId: "nonexistent" });
    expect(Task.find).not.toHaveBeenCalled();
  });

  it("should return empty array if no completed tasks found", async () => {
    (User.findOne as jest.Mock).mockResolvedValue({ userId: "user123", name: "Test User" });

    (Task.find as jest.Mock).mockReturnThis();
    (Task.sort as jest.Mock).mockResolvedValue([]);

    const result = await getUserDoneTasksLists(null, { userId: "user123" });

    expect(User.findOne).toHaveBeenCalledWith({ userId: "user123" });
    expect(Task.find).toHaveBeenCalledWith({ userId: "user123", isDone: true });
    expect(Task.sort).toHaveBeenCalledWith({ updatedAt: -1 });
    expect(result).toEqual([]);
  });

  it("should handle database errors", async () => {
    (User.findOne as jest.Mock).mockResolvedValue({ userId: "user123", name: "Test User" });

    (Task.find as jest.Mock).mockReturnThis();
    (Task.sort as jest.Mock).mockRejectedValue(new Error("Database error"));

    await expect(getUserDoneTasksLists(null, { userId: "user123" })).rejects.toThrow("Database error");
    expect(User.findOne).toHaveBeenCalledWith({ userId: "user123" });
    expect(Task.find).toHaveBeenCalledWith({ userId: "user123", isDone: true });
    expect(Task.sort).toHaveBeenCalledWith({ updatedAt: -1 });
  });
}); 