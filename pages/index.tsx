import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useRouter } from 'next/router';
import { useUser } from '@/context/UserContext';

export default function Home() {
  const router = useRouter();
  const { setUser, userId, userName } = useUser();
  const [selectedUser, setSelectedUser] = useState('user1');
  const [selectedUserName, setSelectedUserName] = useState('Test User 1');
  
  const handleUserSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedUser(e.target.value);
    setSelectedUserName(
      e.target.value === 'user1' ? 'Test User 1' : 'Test User 2'
    );
  };
  
  const handleContinue = () => {
    setUser(selectedUser, selectedUserName);
    router.push(`/tasks?userId=${selectedUser}`);
  };

  return (
    <Layout title="Pinecone Task Manager - Home">
      <div className="max-w-3xl mx-auto py-8">
        {userId && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-center">
            <p className="text-green-800">
              You are currently logged in as <span className="font-semibold">{userName}</span>.
            </p>
          </div>
        )}
        <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-purple-700 mb-4">🌲 Pinecone Task Manager</h1>
            <p className="text-lg text-gray-600">
              A GraphQL-powered task management system built for the Pinecone Advocate Challenge
            </p>
          </div>
          
          <div className="mb-8 bg-purple-50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Getting Started</h2>
            <p className="text-gray-700 mb-4">
              This application allows you to manage your tasks with these features:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Create new tasks with priorities and tags</li>
              <li>Update existing tasks</li>
              <li>Mark tasks as complete</li>
              <li>View both active and completed tasks</li>
            </ul>
          </div>
          
          {!userId && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Select a User</h2>
              <div className="flex space-x-4 items-end">
                <div className="flex-grow">
                  <label htmlFor="userSelect" className="block text-sm font-medium text-gray-700 mb-1">
                    User
                  </label>
                  <select
                    id="userSelect"
                    value={selectedUser}
                    onChange={handleUserSelect}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="user1">Test User 1</option>
                    <option value="user2">Test User 2</option>
                  </select>
                </div>
                <button
                  onClick={handleContinue}
                  className="px-5 py-2 bg-purple-600 text-white font-medium rounded-md hover:bg-purple-700"
                >
                  Continue
                </button>
              </div>
            </div>
          )}
          
          <div className="border-t border-gray-200 pt-6 text-center">
            <p className="text-gray-600 text-sm">
              Built with Next.js, Apollo Client, and MongoDB for the Pinecone Advocate Challenge
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
