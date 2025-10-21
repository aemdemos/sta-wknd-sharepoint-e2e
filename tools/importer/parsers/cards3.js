/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card info from a contributor/guide section
  function extractCards(section) {
    const cards = [];
    // Each card is a section with class 'experiencefragment cmp-experience-fragment--contributor'
    const cardSections = section.querySelectorAll('section.experiencefragment.cmp-experience-fragment--contributor');
    cardSections.forEach((cardSection) => {
      // Image: find first img inside .image
      const img = cardSection.querySelector('.image img');
      // Card text content
      const textParts = [];
      // Name (h3)
      const name = cardSection.querySelector('.title h3');
      if (name) textParts.push(name.cloneNode(true));
      // Subtitle/role (h5)
      const subtitle = cardSection.querySelector('.title h5');
      if (subtitle) textParts.push(subtitle.cloneNode(true));
      // Social buttons (all .button a)
      const socialBtns = Array.from(cardSection.querySelectorAll('.button a'));
      if (socialBtns.length) {
        const btnDiv = document.createElement('div');
        socialBtns.forEach(btn => btnDiv.appendChild(btn.cloneNode(true)));
        textParts.push(btnDiv);
      }
      // Assemble row: [image, text content]
      cards.push([img ? img.cloneNode(true) : '', textParts]);
    });
    return cards;
  }

  // Utility to extract heading and description from a section
  function extractIntro(section, headingSelector, descSelector) {
    const intro = [];
    const heading = section.querySelector(headingSelector);
    if (heading) intro.push(heading.cloneNode(true));
    const desc = section.querySelector(descSelector);
    if (desc) {
      let p = desc.closest('p');
      if (p) {
        intro.push(p.cloneNode(true));
      } else {
        const pElem = document.createElement('p');
        pElem.appendChild(desc.cloneNode(true));
        intro.push(pElem);
      }
    }
    return intro;
  }

  // Find the main container
  const mainContainer = element;
  const children = Array.from(mainContainer.children);

  // Find the two main card sections by locating the h2 headings
  let contributorSection = null;
  let guidesSection = null;
  children.forEach((child) => {
    const h2 = child.querySelector && child.querySelector('h2.cmp-title__text');
    if (h2) {
      if (h2.textContent.trim() === 'Our Contributors') contributorSection = child;
      if (h2.textContent.trim() === 'WKND Guides') guidesSection = child;
    }
  });

  // Extract About Us heading and description
  const aboutUsIntro = extractIntro(mainContainer, 'h1.cmp-title__text', '.cmp-text i, .cmp-text p i');

  // Extract Contributors heading and description
  const contributorsIntro = contributorSection ? extractIntro(contributorSection, 'h2.cmp-title__text', '.cmp-text i, .cmp-text p i') : [];
  // Extract Guides heading and description
  const guidesIntro = guidesSection ? extractIntro(guidesSection, 'h2.cmp-title__text', '.cmp-text i, .cmp-text p i') : [];

  // Extract cards for each section
  const contributorCards = contributorSection ? extractCards(contributorSection) : [];
  const guidesCards = guidesSection ? extractCards(guidesSection) : [];

  // Build tables for each card section
  const headerRow = ['Cards (cards3)'];
  const contributorTable = contributorCards.length ? WebImporter.DOMUtils.createTable([headerRow, ...contributorCards], document) : null;
  const guidesTable = guidesCards.length ? WebImporter.DOMUtils.createTable([headerRow, ...guidesCards], document) : null;

  // Insert all content in correct order
  let insertBefore = element;
  aboutUsIntro.forEach(node => {
    element.parentNode.insertBefore(node, insertBefore);
    insertBefore = node;
  });
  if (contributorsIntro.length) {
    contributorsIntro.forEach(node => {
      element.parentNode.insertBefore(node, insertBefore.nextSibling);
      insertBefore = node;
    });
  }
  if (contributorTable) {
    element.parentNode.insertBefore(contributorTable, insertBefore.nextSibling);
    insertBefore = contributorTable;
  }
  if (guidesIntro.length) {
    guidesIntro.forEach(node => {
      element.parentNode.insertBefore(node, insertBefore.nextSibling);
      insertBefore = node;
    });
  }
  if (guidesTable) {
    element.parentNode.insertBefore(guidesTable, insertBefore.nextSibling);
    insertBefore = guidesTable;
  }

  // Remove the original element
  element.remove();
}
