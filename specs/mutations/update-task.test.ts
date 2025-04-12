import { updateTask } from "../../graphql/resolvers/mutations/update-task";
import { Task, User } from "../../mongoose/models";

jest.mock("../../mongoose/models", () => ({
  User: {
    findOne: jest.fn(),
  },
  Task: {
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  },
}));

describe("updateTask mutation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should update a task successfully", async () => {
    const taskId = "task123";
    const userId = "user123";
    const updateData = {
      taskId,
      userId,
      taskName: "Updated Task",
      priority: 2,
    };

    (User.findOne as jest.Mock).mockResolvedValue({ userId, name: "Test User" });

    (Task.findById as jest.Mock).mockResolvedValue({
      _id: taskId,
      taskName: "Original Task",
      description: "Original description",
      priority: 3,
      isDone: false,
      userId,
    });

    const updatedTask = {
      _id: taskId,
      taskName: "Updated Task",
      description: "Original description",
      priority: 2,
      isDone: false,
      userId,
      updatedAt: new Date(),
    };
    
    (Task.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedTask);

    const result = await updateTask(null, updateData);

    expect(User.findOne).toHaveBeenCalledWith({ userId });
    expect(Task.findById).toHaveBeenCalledWith(taskId);
    expect(Task.findByIdAndUpdate).toHaveBeenCalledWith(
      taskId,
      {
        taskName: "Updated Task",
        priority: 2,
        updatedAt: expect.any(Date),
      },
      { new: true, runValidators: true }
    );
    expect(result).toEqual(updatedTask);
  });

  it("should throw an error if user not found", async () => {
    const updateData = {
      taskId: "task123",
      userId: "nonexistent",
      taskName: "Updated Task",
    };

    (User.findOne as jest.Mock).mockResolvedValue(null);

    await expect(updateTask(null, updateData)).rejects.toThrow("User not found");
    expect(User.findOne).toHaveBeenCalledWith({ userId: "nonexistent" });
    expect(Task.findById).not.toHaveBeenCalled();
    expect(Task.findByIdAndUpdate).not.toHaveBeenCalled();
  });

  it("should throw an error if task not found", async () => {
    const updateData = {
      taskId: "nonexistent",
      userId: "user123",
      taskName: "Updated Task",
    };

    (User.findOne as jest.Mock).mockResolvedValue({ userId: "user123", name: "Test User" });

    (Task.findById as jest.Mock).mockResolvedValue(null);

    await expect(updateTask(null, updateData)).rejects.toThrow("Task not found");
    expect(User.findOne).toHaveBeenCalledWith({ userId: "user123" });
    expect(Task.findById).toHaveBeenCalledWith("nonexistent");
    expect(Task.findByIdAndUpdate).not.toHaveBeenCalled();
  });

  it("should throw an error if user doesn't own the task", async () => {
    const updateData = {
      taskId: "task123",
      userId: "user123",
      taskName: "Updated Task",
    };

    (User.findOne as jest.Mock).mockResolvedValue({ userId: "user123", name: "Test User" });

    (Task.findById as jest.Mock).mockResolvedValue({
      _id: "task123",
      taskName: "Original Task",
      description: "Original description",
      priority: 3,
      isDone: false,
      userId: "different-user",
    });

    await expect(updateTask(null, updateData)).rejects.toThrow("Unauthorized");
    expect(User.findOne).toHaveBeenCalledWith({ userId: "user123" });
    expect(Task.findById).toHaveBeenCalledWith("task123");
    expect(Task.findByIdAndUpdate).not.toHaveBeenCalled();
  });

  it("should handle validation errors during update", async () => {
    const updateData = {
      taskId: "task123",
      userId: "user123",
      priority: 10, 
    };

    (User.findOne as jest.Mock).mockResolvedValue({ userId: "user123", name: "Test User" });

    (Task.findById as jest.Mock).mockResolvedValue({
      _id: "task123",
      taskName: "Original Task",
      description: "Original description",
      priority: 3,
      isDone: false,
      userId: "user123",
    });

    (Task.findByIdAndUpdate as jest.Mock).mockRejectedValue(
      new Error("Validation failed: priority must be between 1 and 5")
    );

    await expect(updateTask(null, updateData)).rejects.toThrow("Validation failed");
    expect(User.findOne).toHaveBeenCalledWith({ userId: "user123" });
    expect(Task.findById).toHaveBeenCalledWith("task123");
    expect(Task.findByIdAndUpdate).toHaveBeenCalledWith(
      "task123",
      {
        priority: 10,
        updatedAt: expect.any(Date),
      },
      { new: true, runValidators: true }
    );
  });
}); 