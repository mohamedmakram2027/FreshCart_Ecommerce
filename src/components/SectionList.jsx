import React from 'react';

const SectionList = ({ selectedSections }) => {
  if (!selectedSections || selectedSections.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
        قم باختيار سكشن واحد على الأقل من القائمة المنسدلة لعرض المحتوى.
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <h3>السكاشن المختارة ({selectedSections.length}):</h3>
      {selectedSections.map((section) => (
        <div 
          key={section.value} 
          style={{
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '15px',
            backgroundColor: '#f9f9f9'
          }}
        >
          <h4 style={{ margin: '0 0 10px 0', color: '#007bff' }}>
            {section.label}
          </h4>
          <p style={{ margin: 0 }}>
            محتوى ودورات سكشن **{section.label}** تظهر هنا...
          </p>
        </div>
      ))}
    </div>
  );
};

export default SectionList;