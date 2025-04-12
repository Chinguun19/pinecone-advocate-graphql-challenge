import mongoose, { Document, Schema } from 'mongoose';

// User interface
export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  userId: string;
  name: string;
}

// Task interface
export interface ITask extends Document {
  _id: mongoose.Types.ObjectId;
  taskName: string;
  description: string;
  isDone: boolean;
  priority: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

// User schema
const UserSchema = new Schema<IUser>({
  userId: { type: String, required: true, unique: true },
  name: { type: String, required: true }
});

// Task schema
const TaskSchema = new Schema<ITask>({
  taskName: { 
    type: String, 
    required: true,
    validate: {
      validator: async function(this: ITask, value: string) {
        // Find existing tasks with same name for this user
        const Task = mongoose.model<ITask>('Task');
        const existingTask = await Task.findOne({ 
          taskName: value, 
          userId: this.userId,
          _id: { $ne: this._id } // Exclude current document when updating
        });
        return !existingTask;
      },
      message: 'Task name must be unique per user'
    }
  },
  description: { 
    type: String, 
    required: true,
    validate: [
      {
        validator: function(this: ITask, value: string) {
          return value && value.length >= 10;
        },
        message: 'Description must be at least 10 characters long'
      },
      {
        validator: function(this: ITask, value: string) {
          return value !== this.taskName;
        },
        message: 'Description cannot be the same as taskName'
      }
    ]
  },
  isDone: { type: Boolean, default: false },
  priority: { 
    type: Number, 
    required: true,
    min: [1, 'Priority must be between 1 and 5'],
    max: [5, 'Priority must be between 1 and 5']
  },
  tags: { 
    type: [String],
    validate: {
      validator: function(tags: string[]) {
        return tags.length <= 5;
      },
      message: 'A maximum of 5 tags are allowed'
    }
  },
  userId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create models if they don't exist
export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export const Task = mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema); 