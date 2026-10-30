import React from 'react';
import FoundersSection from './FoundersSection';

export default function AboutSection({ onScrollToSection, onOpenSquadModal, cmsFounders }) {
  return (
    <FoundersSection
      onScrollToSection={onScrollToSection}
      onOpenSquadModal={onOpenSquadModal}
      cmsFounders={cmsFounders}
    />
  );
}
