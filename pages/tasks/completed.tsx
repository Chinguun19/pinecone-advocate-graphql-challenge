import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import Layout from '@/components/Layout';
import TaskCard from '@/components/TaskCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import { GET_USER_DONE_TASKS } from '@/graphql/client/queries';
import { useUser } from '@/context/UserContext';

const CompletedTasksPage: React.FC = () => {
  const router = useRouter();
  const { userId, userName } = useUser();
  
  // If userId is not provided, redirect to home
  useEffect(() => {
    if (!userId && typeof window !== 'undefined') {
      router.push('/');
    }
  }, [userId, router]);
  
  // Query to get all completed tasks
  const { loading, error, data, refetch } = useQuery(GET_USER_DONE_TASKS, {
    variables: { userId },
    skip: !userId,
    fetchPolicy: 'network-only',
  });

  // If user is not loaded yet, show loading
  if (!userId) {
    return (
      <Layout title="Task Manager - Loading">
        <LoadingSpinner message="Loading user data..." />
      </Layout>
    );
  }

  // Loading state
  if (loading) {
    return (
      <Layout title="Task Manager - Loading">
        <LoadingSpinner message="Loading completed tasks..." />
      </Layout>
    );
  }

  // Error state
  if (error) {
    return (
      <Layout title="Task Manager - Error">
        <ErrorMessage 
          message={`Error loading completed tasks: ${error.message}`} 
          onRetry={() => refetch()}
        />
      </Layout>
    );
  }

  const completedTasks = data?.getUserDoneTasksLists || [];

  return (
    <Layout title="Task Manager - Completed Tasks">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Completed Tasks</h1>
            <p className="text-gray-500">User: {userName || 'User'}</p>
          </div>
          <button
            onClick={() => router.push(`/tasks`)}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
          >
            Back to Active Tasks
          </button>
        </div>
        
        {/* Tasks List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {completedTasks.length > 0 ? (
            completedTasks.map((task: any) => (
              <TaskCard
                key={task._id}
                {...task}
              />
            ))
          ) : (
            <div className="col-span-2 bg-white p-8 rounded-lg shadow text-center border border-gray-200">
              <p className="text-gray-600 mb-4">You haven't completed any tasks yet.</p>
              <button
                onClick={() => router.push(`/tasks`)}
                className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
              >
                Go Complete Some Tasks!
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CompletedTasksPage; 