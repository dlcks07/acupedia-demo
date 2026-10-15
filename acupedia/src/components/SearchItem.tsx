import React from 'react';

interface SearchProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

function SearchItem({ title, subtitle, children }: SearchProps) {
  return (
    <>
      <div className="subLeft__header">
        <div className="subLeft__titleBox">
          <p className="subLeft__title">{title}</p>
          <p className="subLeft__subtitle">{subtitle}</p>
        </div>        
      </div>
      <div className="subLeft__viewer">{children}</div>
    </>  
  );
}

export default SearchItem;


