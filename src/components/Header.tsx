import React from 'react';
import { Briefcase } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="logo">
        <Briefcase size={28} />
        <span>JobTrackr Pro</span>
      </div>
      <div>
        <button className="btn">Add New Job</button>
      </div>
    </header>
  );
};
