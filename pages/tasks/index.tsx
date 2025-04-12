import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useQuery, useMutation } from '@apollo/client';
import Layout from '@/components/Layout';
import TaskCard from '@/components/TaskCard';
import TaskForm, { TaskFormData } from '@/components/TaskForm';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import { GET_ALL_TASKS, ADD_TASK, UPDATE_TASK } from '@/graphql/client/queries';
import { useUser } from '@/context/UserContext';

const TasksPage: React.FC = () => {
  const router = useRouter();
  const { userId, userName } = useUser();
  const [isAdding, setIsAdding] = useState(false);
  const [editingTask, setEditingTask] = useState<string | null>(null);
  

  useEffect(() => {
    if (!userId && typeof window !== 'undefined') {
      router.push('/');
    }
  }, [userId, router]);


  const { loading, error, data, refetch } = useQuery(GET_ALL_TASKS, {
    variables: { userId },
    skip: !userId,
    fetchPolicy: 'network-only',
  });


  const [addTask, { loading: addLoading }] = useMutation(ADD_TASK, {
    onCompleted: () => {
      setIsAdding(false);
      refetch();
    },
    onError: (error) => {
      console.error('Error adding task:', error);
    }
  });


  const [updateTask, { loading: updateLoading }] = useMutation(UPDATE_TASK, {
    onCompleted: () => {
      setEditingTask(null);
      refetch();
    },
    onError: (error) => {
      console.error('Error updating task:', error);
    }
  });


  const handleAddTask = (formData: TaskFormData) => {
    if (!userId) return;
    
    addTask({
      variables: {
        ...formData,
        isDone: false,
        userId
      }
    });
  };


  const handleUpdateTask = (formData: TaskFormData) => {
    if (!editingTask || !userId) return;
    
    updateTask({
      variables: {
        taskId: editingTask,
        ...formData,
        userId
      }
    });
  };


  const handleMarkComplete = (taskId: string) => {
    if (!userId) return;
    
    updateTask({
      variables: {
        taskId,
        isDone: true,
        userId
      }
    });
  };


  const handleEdit = (taskId: string) => {
    setEditingTask(taskId);
 
    setTimeout(() => {
      document.getElementById('edit-form')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };


  const getEditingTaskData = (): TaskFormData | undefined => {
    if (!editingTask || !data?.getAllTasks) return undefined;
    
    const task = data.getAllTasks.find((t: any) => t._id === editingTask);
    if (!task) return undefined;
    
    return {
      taskName: task.taskName,
      description: task.description,
      priority: task.priority,
      tags: task.tags || [],
    };
  };


  if (!userId) {
    return (
      <Layout title="Task Manager - Loading">
        <LoadingSpinner message="Loading user data..." />
      </Layout>
    );
  }


  if (loading) {
    return (
      <Layout title="Task Manager - Loading">
        <LoadingSpinner message="Loading tasks..." />
      </Layout>
    );
  }


  if (error) {
    return (
      <Layout title="Task Manager - Error">
        <ErrorMessage 
          message={`Error loading tasks: ${error.message}`} 
          onRetry={() => refetch()}
        />
      </Layout>
    );
  }

  const tasks = data?.getAllTasks || [];

  return (
    <Layout title="Task Manager - Active Tasks">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Active Tasks</h1>
            <p className="text-gray-500">Welcome, {userName || 'User'}</p>
          </div>
          <button
            onClick={() => {
              setEditingTask(null);
              setIsAdding(!isAdding);
            }}
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
          >
            {isAdding ? 'Cancel' : 'Add New Task'}
          </button>
        </div>

   
        {isAdding && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Add New Task</h2>
            <TaskForm onSubmit={handleAddTask} />
          </div>
        )}

   
        {editingTask && (
          <div id="edit-form" className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Edit Task</h2>
              <button
                onClick={() => setEditingTask(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            </div>
            <TaskForm 
              initialData={getEditingTaskData()} 
              onSubmit={handleUpdateTask} 
              isEditing={true}
            />
          </div>
        )}


        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tasks.length > 0 ? (
            tasks.map((task: any) => (
              <TaskCard
                key={task._id}
                {...task}
                onMarkComplete={handleMarkComplete}
                onEdit={handleEdit}
              />
            ))
          ) : (
            <div className="col-span-2 bg-white p-8 rounded-lg shadow text-center border border-gray-200">
              <p className="text-gray-600 mb-4">No active tasks found.</p>
              {!isAdding && (
                <button
                  onClick={() => setIsAdding(true)}
                  className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
                >
                  Create Your First Task
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default TasksPage; 