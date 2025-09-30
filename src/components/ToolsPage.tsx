import React from 'react';
import FontGenerator from './FontGenerator';

interface ToolsPageProps {
  onNavigate?: (page: string) => void;
}

export default function ToolsPage({ onNavigate }: ToolsPageProps) {
  return (
    <div className="min-h-screen">
      <FontGenerator />
    </div>
  );
}
