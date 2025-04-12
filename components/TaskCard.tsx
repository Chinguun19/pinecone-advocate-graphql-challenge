import React from 'react';

export interface TaskProps {
  _id: string;
  taskName: string;
  description: string;
  isDone: boolean;
  priority: number;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  onMarkComplete?: (id: string) => void;
  onEdit?: (id: string) => void;
}

const TaskCard: React.FC<TaskProps> = ({
  _id,
  taskName,
  description,
  isDone,
  priority,
  tags = [],
  createdAt,
  onMarkComplete,
  onEdit
}) => {
  // Function to get priority color
  const getPriorityColor = () => {
    switch (priority) {
      case 1: return 'bg-red-500'; // Highest priority
      case 2: return 'bg-orange-500';
      case 3: return 'bg-yellow-500';
      case 4: return 'bg-blue-500';
      case 5: return 'bg-green-500'; // Lowest priority
      default: return 'bg-gray-500';
    }
  };

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className={`border rounded-lg p-4 shadow-md mb-4 ${isDone ? 'bg-gray-50' : 'bg-white'}`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className={`text-lg font-bold ${isDone ? 'line-through text-gray-500' : ''}`}>
          {taskName}
        </h3>
        <div className={`${getPriorityColor()} text-white rounded-full px-3 py-1 text-xs`}>
          Priority {priority}
        </div>
      </div>
      
      <p className="text-gray-700 mb-3">{description}</p>
      
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {tags.map((tag, index) => (
            <span key={index} className="bg-gray-200 rounded-full px-2 py-1 text-xs text-gray-700">
              {tag}
            </span>
          ))}
        </div>
      )}
      
      <div className="text-xs text-gray-500 mb-3">
        Created on {formatDate(createdAt)}
      </div>
      
      <div className="flex space-x-2 mt-2">
        {!isDone && onMarkComplete && (
          <button 
            onClick={() => onMarkComplete(_id)}
            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
          >
            Mark Complete
          </button>
        )}
        
        {onEdit && (
          <button 
            onClick={() => onEdit(_id)}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskCard; 