// src/components/CardView.tsx

import React from 'react';

interface CardViewProps {
  title: string;
  content: string;
  content2: string;
  image?: string;
  className?: string;
}

const CardView: React.FC<CardViewProps> = ({ title, content, content2, image, className }) => {
  return (
    <div className={`bg-white shadow-lg rounded-lg overflow-hidden ${className}`}>
      {/* <img src={image} alt={title} className="w-full h-48 object-cover" /> */}
      <div className="p-6">
        <h2 className="text-xl font-bold mb-2">{title}</h2>
        <p>{content}</p>
        <p>{content2}</p>
      </div>
    </div>
  );
};

export default CardView;
