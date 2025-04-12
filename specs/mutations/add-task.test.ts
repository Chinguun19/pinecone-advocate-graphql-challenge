import { addTask } from "../../graphql/resolvers/mutations/add-task";
import { Task, User } from "../../mongoose/models";

// Mock the User and Task models
jest.mock("../../mongoose/models", () => ({
  User: {
    findOne: jest.fn(),
  },
  Task: jest.fn().mockImplementation(() => ({
    save: jest.fn(),
  })),
}));

describe("addTask mutation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a new task successfully", async () => {
    // Mock data
    const taskData = {
      taskName: "Test Task",
      description: "This is a test task description",
      priority: 3,
      tags: ["test", "important"],
      userId: "user123",
    };

    // Mock user exists
    (User.findOne as jest.Mock).mockResolvedValue({ userId: "user123", name: "Test User" });

    // Mock task save
    const mockSavedTask = {
      _id: "task123",
      ...taskData,
      isDone: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const saveMethod = jest.fn().mockResolvedValue(mockSavedTask);
    (Task as jest.Mock).mockImplementation(() => ({
      save: saveMethod,
    }));

    // Execute the resolver
    const result = await addTask(null, taskData);

    // Assertions
    expect(User.findOne).toHaveBeenCalledWith({ userId: "user123" });
    expect(Task).toHaveBeenCalledWith({
      ...taskData,
      isDone: false,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
    expect(saveMethod).toHaveBeenCalled();
    expect(result).toEqual(mockSavedTask);
  });

  it("should throw an error if user not found", async () => {
    // Mock data
    const taskData = {
      taskName: "Test Task",
      description: "This is a test task description",
      priority: 3,
      userId: "nonexistent",
    };

    // Mock user does not exist
    (User.findOne as jest.Mock).mockResolvedValue(null);

    // Execute resolver and expect error
    await expect(addTask(null, taskData)).rejects.toThrow("User not found");
    expect(User.findOne).toHaveBeenCalledWith({ userId: "nonexistent" });
    expect(Task).not.toHaveBeenCalled();
  });

  it("should handle validation errors", async () => {
    // Mock data
    const taskData = {
      taskName: "Test Task",
      description: "This is a test task description",
      priority: 3,
      userId: "user123",
    };

    // Mock user exists
    (User.findOne as jest.Mock).mockResolvedValue({ userId: "user123", name: "Test User" });

    // Mock task save throws validation error
    const saveMethod = jest.fn().mockRejectedValue(new Error("Task validation failed"));
    (Task as jest.Mock).mockImplementation(() => ({
      save: saveMethod,
    }));

    // Execute resolver and expect error
    await expect(addTask(null, taskData)).rejects.toThrow("Task validation failed");
    expect(User.findOne).toHaveBeenCalledWith({ userId: "user123" });
    expect(Task).toHaveBeenCalled();
    expect(saveMethod).toHaveBeenCalled();
  });
}); 