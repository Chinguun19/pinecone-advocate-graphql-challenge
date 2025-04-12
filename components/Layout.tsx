import React, { ReactNode } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useUser } from '@/context/UserContext';

type LayoutProps = {
  children: ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title = 'Task Management App' }) => {
  const router = useRouter();
  const { userId, userName, clearUser } = useUser();

  const handleLogout = () => {
    clearUser();
    router.push('/');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      
      <header className="bg-purple-700 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">🌲 Pinecone Tasks</h1>
          <nav className="flex items-center space-x-4">
            <Link href="/" className="hover:underline">
              Home
            </Link>
            {userId && (
              <>
                <Link href="/tasks" className="hover:underline">
                  Active Tasks
                </Link>
                <Link href="/tasks/completed" className="hover:underline">
                  Completed Tasks
                </Link>
                <div className="ml-4 pl-4 border-l border-purple-500 flex items-center">
                  <span className="text-white text-sm mr-2">
                    {userName || 'User'}
                  </span>
                  <button 
                    onClick={handleLogout}
                    className="bg-purple-800 text-white text-sm px-3 py-1 rounded hover:bg-purple-900"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
          </nav>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto p-4">
        {children}
      </main>
      
      <footer className="bg-gray-100 p-4 text-center text-gray-600 border-t">
        <div className="container mx-auto">
          <p>Pinecone Advocate Challenge - Task Management App</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 