import React, { useState, useEffect } from 'react';

export type TaskFormData = {
  taskName: string;
  description: string;
  priority: number;
  tags: string[];
  isDone?: boolean;
}

type TaskFormProps = {
  initialData?: TaskFormData;
  onSubmit: (data: TaskFormData) => void;
  isEditing?: boolean;
}

const DEFAULT_FORM_STATE: TaskFormData = {
  taskName: '',
  description: '',
  priority: 3,
  tags: [],
};

const TaskForm: React.FC<TaskFormProps> = ({ 
  initialData = DEFAULT_FORM_STATE, 
  onSubmit,
  isEditing = false
}) => {
  const [formData, setFormData] = useState<TaskFormData>(initialData);
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'priority' ? parseInt(value, 10) : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && formData.tags.length < 5) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const validate = (): boolean => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.taskName.trim()) {
      newErrors.taskName = 'Task name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters long';
    } else if (formData.description.trim() === formData.taskName.trim()) {
      newErrors.description = 'Description cannot be the same as task name';
    }
    
    if (formData.priority < 1 || formData.priority > 5) {
      newErrors.priority = 'Priority must be between 1 and 5';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="taskName" className="block text-sm font-medium text-gray-700 mb-1">
          Task Name*
        </label>
        <input
          type="text"
          id="taskName"
          name="taskName"
          value={formData.taskName}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md ${errors.taskName ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="Enter task name"
        />
        {errors.taskName && <p className="mt-1 text-sm text-red-500">{errors.taskName}</p>}
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description* (min 10 characters)
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className={`w-full px-3 py-2 border rounded-md ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="Enter detailed description"
        />
        {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
      </div>
      
      <div>
        <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
          Priority* (1-Highest, 5-Lowest)
        </label>
        <select
          id="priority"
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md ${errors.priority ? 'border-red-500' : 'border-gray-300'}`}
        >
          <option value={1}>1 - Highest</option>
          <option value={2}>2 - High</option>
          <option value={3}>3 - Medium</option>
          <option value={4}>4 - Low</option>
          <option value={5}>5 - Lowest</option>
        </select>
        {errors.priority && <p className="mt-1 text-sm text-red-500">{errors.priority}</p>}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tags (max 5)
        </label>
        <div className="flex space-x-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            className="flex-grow px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Add a tag"
            disabled={formData.tags.length >= 5}
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-400"
            disabled={!tagInput.trim() || formData.tags.length >= 5}
          >
            Add
          </button>
        </div>
        
        {formData.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {formData.tags.map((tag, index) => (
              <div key={index} className="bg-gray-200 rounded-full px-3 py-1 text-sm flex items-center">
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(index)}
                  className="ml-2 text-gray-600 hover:text-red-600"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        <p className="mt-1 text-xs text-gray-500">
          {formData.tags.length}/5 tags added
        </p>
      </div>
      
      <div className="pt-4">
        <button
          type="submit"
          className="w-full px-4 py-2 bg-purple-600 text-white font-medium rounded-md hover:bg-purple-700"
        >
          {isEditing ? 'Update Task' : 'Create Task'}
        </button>
      </div>
    </form>
  );
};

export default TaskForm; 