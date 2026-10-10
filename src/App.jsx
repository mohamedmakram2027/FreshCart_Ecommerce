import React, { useState } from 'react';
import SectionDropdown from './components/SectionDropdown';
import SectionList from './components/SectionList';

function App() {
  // حالة تخزين السكاشن المختارة (مصفوفة)
  const [selectedSections, setSelectedSections] = useState([]);

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>لوحة إدارة السكاشن</h2>
      
      {/* مكون اختيار السكاشن */}
      <SectionDropdown selectedSections="{selectedSections}" setSelectedSections="{setSelectedSections}"/>

      {/* مكون عرض السكاشن المختارة */}
      <SectionList selectedSections="{selectedSections}"/>
    </div>
  );
}

export default App;