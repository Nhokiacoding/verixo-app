// Navigation utilities for smooth scrolling and routing
import { navigateTo } from './router';

export const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  }
};

export const handleNavClick = (href) => {
  if (href.startsWith('#')) {
    // Handle anchor links for same page
    const sectionId = href.substring(1);
    scrollToSection(sectionId);
  } else {
    // Handle route navigation
    navigateTo(href);
  }
};
