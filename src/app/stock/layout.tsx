import React from 'react';

export default function StockLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container-wrapper">
      <div className="container">{children}</div>
    </div>
  );
}
