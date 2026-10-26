import React from 'react';
import FoundersSection from './FoundersSection';

export default function AboutSection({ onScrollToSection, onOpenSquadModal }) {
  return (
    <FoundersSection
      onScrollToSection={onScrollToSection}
      onOpenSquadModal={onOpenSquadModal}
    />
  );
}
