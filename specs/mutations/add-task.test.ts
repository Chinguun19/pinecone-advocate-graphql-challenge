import { addTask } from "../../graphql/resolvers/mutations/add-task";
import { Task, User } from "../../mongoose/models";

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
    const taskData = {
      taskName: "Test Task",
      description: "This is a test task description",
      priority: 3,
      tags: ["test", "important"],
      userId: "user123",
    };

    (User.findOne as jest.Mock).mockResolvedValue({ userId: "user123", name: "Test User" });

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

    const result = await addTask(null, taskData);

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
    const taskData = {
      taskName: "Test Task",
      description: "This is a test task description",
      priority: 3,
      userId: "nonexistent",
    };

    (User.findOne as jest.Mock).mockResolvedValue(null);

    await expect(addTask(null, taskData)).rejects.toThrow("User not found");
    expect(User.findOne).toHaveBeenCalledWith({ userId: "nonexistent" });
    expect(Task).not.toHaveBeenCalled();
  });

  it("should handle validation errors", async () => {
    const taskData = {
      taskName: "Test Task",
      description: "This is a test task description",
      priority: 3,
      userId: "user123",
    };

    (User.findOne as jest.Mock).mockResolvedValue({ userId: "user123", name: "Test User" });

    const saveMethod = jest.fn().mockRejectedValue(new Error("Task validation failed"));
    (Task as jest.Mock).mockImplementation(() => ({
      save: saveMethod,
    }));

    await expect(addTask(null, taskData)).rejects.toThrow("Task validation failed");
    expect(User.findOne).toHaveBeenCalledWith({ userId: "user123" });
    expect(Task).toHaveBeenCalled();
    expect(saveMethod).toHaveBeenCalled();
  });
}); 