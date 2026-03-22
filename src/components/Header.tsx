import React from 'react';
import { Briefcase } from 'lucide-react';

interface HeaderProps {
  onAddClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onAddClick }) => {
  return (
    <header className="header">
      <div className="logo">
        <Briefcase size={28} />
        <span>JobTrackr Pro</span>
      </div>
      <div>
        <button className="btn" onClick={onAddClick}>Add New Job</button>
      </div>
    </header>
  );
};
