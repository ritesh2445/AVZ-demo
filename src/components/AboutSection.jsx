import React from 'react';
import FoundersSection from './FoundersSection';

function AboutSection({ onScrollToSection, onOpenSquadModal, cmsFounders }) {
  return (
    <FoundersSection
      onScrollToSection={onScrollToSection}
      onOpenSquadModal={onOpenSquadModal}
      cmsFounders={cmsFounders}
    />
  );
}


export default React.memo(AboutSection);
