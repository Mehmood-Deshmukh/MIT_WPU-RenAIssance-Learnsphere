import React from 'react';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-column items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-lg mb-8">
        <svg viewBox="0 0 500 400" className="w-full">
          <rect x="0" y="200" width="500" height="200" fill="#f3f4f6" />
          <path d="M100,200 Q250,100 400,200" fill="none" stroke="#4f46e5" strokeWidth="4" />
          <path d="M200,150 L240,170 L220,190 Z" fill="#4f46e5" />
          <text x="150" y="300" fontSize="80" fontWeight="bold" fill="#1f2937">404</text>
          <rect x="340" y="260" width="60" height="20" fill="#4f46e5" />
          <rect x="350" y="240" width="60" height="20" fill="#6366f1" />
          <rect x="360" y="220" width="60" height="20" fill="#818cf8" />
        </svg>
      </div>

      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Page Not Found!
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-md">
          Oops! Looks like this page has gone on a coffee break. 
          Maybe it's studying for its own deadline? 📚
        </p>
        
        <div className="flex flex-column md:flex-row gap-4 justify-content-center">
          <Button
            label="Go to Dashboard"
            icon="pi pi-home"
            onClick={() => navigate('/home')}
            className="p-button-primary"
          />
          <Button
            label="Login"
            icon="pi pi-book"
            onClick={() => navigate('/login')}
            className="p-button-secondary"
          />
        </div>
      </div>

      {/* Fun Facts Tooltip */}
      <div className="mt-8 p-3 bg-blue-50 rounded-lg max-w-md text-center">
        <p className="text-sm text-blue-800">
          Did you know? The term "404" comes from the early days of the internet.
          It was literally room 404 at CERN where the first web servers were kept! 🤓
        </p>
      </div>
    </div>
  );
};

export default NotFound;