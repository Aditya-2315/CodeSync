import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-light-bg dark:bg-darkbg text-light-text-primary dark:text-dark-text-primary text-center p-4">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-6">Page Not Found</p>
      <Link
        to="/"
        className="px-4 py-2 bg-dark-accent dark:bg-light-accent text-white rounded-md hover:opacity-90 transition"
      >
        Go to Home
      </Link>
    </div>
  );
};

export default NotFound;