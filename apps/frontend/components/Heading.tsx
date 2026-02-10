// *********************
// Role of the component: Simple H2 heading component for sections
// Name of the component: Heading.tsx
// Developer: Aleksandar Kuzmanovic (Updated by Gemini for TALLEL TEXTILE)
// Version: 2.0
// Component call: <Heading title={title} />
// Input parameters: { title: string }
// Output: A centered h2 heading with brand styles.
// *********************

import React from 'react'

const Heading = ({ title, subtitle }: { title: string; subtitle?: string }) => {
  return (
    <div className="mb-8 md:mb-12">
      <h2 className="section-title">{title}</h2>
      {subtitle && <p className="section-subtitle">{subtitle}</p>}
    </div>
  );
};

export default Heading