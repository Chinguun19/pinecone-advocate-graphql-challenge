import { getAllTasks } from "../../graphql/resolvers/queries/get-all-tasks";
import { Task, User } from "../../mongoose/models";

// Mock the User and Task models
jest.mock("../../mongoose/models", () => ({
  User: {
    findOne: jest.fn(),
  },
  Task: {
    find: jest.fn().mockReturnThis(),
    sort: jest.fn(),
  },
}));

describe("getAllTasks query", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return all non-completed tasks for a user", async () => {
    // Mock data
    const userId = "user123";
    const mockTasks = [
      {
        _id: "task1",
        taskName: "Task 1",
        description: "Description 1",
        isDone: false,
        priority: 2,
        userId,
      },
      {
        _id: "task2",
        taskName: "Task 2",
        description: "Description 2",
        isDone: false,
        priority: 3,
        userId,
      },
    ];

    // Mock user exists
    (User.findOne as jest.Mock).mockResolvedValue({ userId, name: "Test User" });

    // Mock tasks query
    (Task.find as jest.Mock).mockReturnThis();
    (Task.sort as jest.Mock).mockResolvedValue(mockTasks);

    // Execute the resolver
    const result = await getAllTasks(null, { userId });

    // Assertions
    expect(User.findOne).toHaveBeenCalledWith({ userId });
    expect(Task.find).toHaveBeenCalledWith({ userId, isDone: false });
    expect(Task.sort).toHaveBeenCalledWith({ updatedAt: -1 });
    expect(result).toEqual(mockTasks);
  });

  it("should throw an error if user not found", async () => {
    // Mock user does not exist
    (User.findOne as jest.Mock).mockResolvedValue(null);

    // Execute resolver and expect error
    await expect(getAllTasks(null, { userId: "nonexistent" })).rejects.toThrow("User not found");
    expect(User.findOne).toHaveBeenCalledWith({ userId: "nonexistent" });
    expect(Task.find).not.toHaveBeenCalled();
  });

  it("should return empty array if no tasks found", async () => {
    // Mock user exists
    (User.findOne as jest.Mock).mockResolvedValue({ userId: "user123", name: "Test User" });

    // Mock no tasks found
    (Task.find as jest.Mock).mockReturnThis();
    (Task.sort as jest.Mock).mockResolvedValue([]);

    // Execute the resolver
    const result = await getAllTasks(null, { userId: "user123" });

    // Assertions
    expect(User.findOne).toHaveBeenCalledWith({ userId: "user123" });
    expect(Task.find).toHaveBeenCalledWith({ userId: "user123", isDone: false });
    expect(Task.sort).toHaveBeenCalledWith({ updatedAt: -1 });
    expect(result).toEqual([]);
  });

  it("should handle database errors", async () => {
    // Mock user exists
    (User.findOne as jest.Mock).mockResolvedValue({ userId: "user123", name: "Test User" });

    // Mock database error
    (Task.find as jest.Mock).mockReturnThis();
    (Task.sort as jest.Mock).mockRejectedValue(new Error("Database error"));

    // Execute resolver and expect error
    await expect(getAllTasks(null, { userId: "user123" })).rejects.toThrow("Database error");
    expect(User.findOne).toHaveBeenCalledWith({ userId: "user123" });
    expect(Task.find).toHaveBeenCalledWith({ userId: "user123", isDone: false });
    expect(Task.sort).toHaveBeenCalledWith({ updatedAt: -1 });
  });
}); 