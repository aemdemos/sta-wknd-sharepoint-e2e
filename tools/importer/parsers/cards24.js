/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract one card info from a section
  function extractCard(section) {
    // Image
    const img = section.querySelector('.image img');
    // Name (h3)
    const h3 = section.querySelector('h3');
    // Subtitle (h5)
    const h5 = section.querySelector('h5');
    // Social links (all <a.cmp-button> inside .cmp-buildingblock--btn-list)
    const btnRoot = section.querySelector('.cmp-buildingblock--btn-list');
    let socials = [];
    if (btnRoot) {
      socials = Array.from(btnRoot.querySelectorAll('a.cmp-button'));
    }
    // Compose text cell
    const textContent = [];
    if (h3) {
      const nameStrong = document.createElement('strong');
      nameStrong.textContent = h3.textContent;
      textContent.push(nameStrong);
    }
    if (h5) {
      textContent.push(document.createElement('br'));
      const subtitleDiv = document.createElement('div');
      subtitleDiv.textContent = h5.textContent;
      textContent.push(subtitleDiv);
    }
    if (socials.length) {
      textContent.push(document.createElement('br'));
      const nav = document.createElement('nav');
      socials.forEach(a => nav.appendChild(a));
      textContent.push(nav);
    }
    // Compose the two cells: [image, textContent]
    return [img, textContent];
  }

  // Find all contributor/guide cards (sections)
  const cardSections = Array.from(element.querySelectorAll('section.cmp-experience-fragment--contributor'));
  // The correct order: contributors (first 4), guides (next 3)
  // Contributors: first 4
  const contributorCards = cardSections.slice(0, 4).map(extractCard);
  // Guides: next 3
  const guidesCards = cardSections.slice(4, 7).map(extractCard);

  // Create block tables
  const headerRow = ['Cards (cards24)'];
  const contributorsTable = [headerRow, ...contributorCards];
  const guidesTable = [headerRow, ...guidesCards];

  // Find the Our Contributors and WKND Guides titles for insertion point
  const allTitles = Array.from(element.querySelectorAll('.cmp-title--underline .cmp-title__text'));
  const contributorsTitle = allTitles.find(el => el.textContent.trim() === 'Our Contributors');
  const guidesTitle = allTitles.find(el => el.textContent.trim() === 'WKND Guides');

  // Insert contributors block after the Our Contributors title
  if (contributorsTitle && contributorsTitle.parentNode.parentNode.parentNode) {
    const parent = contributorsTitle.parentNode.parentNode.parentNode;
    parent.parentNode.insertBefore(WebImporter.DOMUtils.createTable(contributorsTable, document), parent.nextSibling);
  }
  // Insert guides block after the WKND Guides title
  if (guidesTitle && guidesTitle.parentNode.parentNode.parentNode) {
    const parent = guidesTitle.parentNode.parentNode.parentNode;
    parent.parentNode.insertBefore(WebImporter.DOMUtils.createTable(guidesTable, document), parent.nextSibling);
  }
  // Remove the original card sections
  cardSections.forEach(section => {
    section.parentNode.removeChild(section);
  });
}
