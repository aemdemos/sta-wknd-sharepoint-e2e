/* global WebImporter */
export default function parse(element, { document }) {
  // Find all .cmp-text elements (the bios for contributors/guides)
  const textBlocks = Array.from(element.querySelectorAll('.cmp-text'));
  // Find all card sections in order
  const cardSections = Array.from(element.querySelectorAll('section.experiencefragment.cmp-experience-fragment--contributor'));

  // Map cards to their bio based on HTML structure
  // 4 contributors get bio 0, next 3 get bio 1
  let bioMap = [];
  let bioIdx = 0;
  for (let i = 0; i < cardSections.length; i++) {
    if (i === 4) bioIdx = 1;
    bioMap[i] = textBlocks[bioIdx]?.querySelector('p') || textBlocks[bioIdx] || null;
  }

  function extractTextContent(cardRoot, introText) {
    const parts = [];
    // All .cmp-title__text elements
    cardRoot.querySelectorAll('.cmp-title__text').forEach(e => parts.push(e));
    // Add the intro text (bio/description) before the buttons, if present
    if (introText && !parts.includes(introText)) parts.push(introText);
    // Social links/buttons
    const buttonLinks = Array.from(cardRoot.querySelectorAll('a.cmp-button'));
    if (buttonLinks.length > 0) {
      const buttonDiv = document.createElement('div');
      buttonLinks.forEach(btn => buttonDiv.appendChild(btn));
      parts.push(buttonDiv);
    }
    return parts;
  }

  const cells = [['Cards (cards3)']];
  cardSections.forEach((section, idx) => {
    // Find the deepest .cmp-container inside the section
    let cardRoot = section;
    const containers = section.querySelectorAll('.cmp-container');
    if (containers.length) cardRoot = containers[containers.length - 1];
    // Image
    const image = cardRoot.querySelector('.cmp-image img');
    // The mapped intro/bio
    const introText = bioMap[idx];
    // Compose text cell
    const textContent = extractTextContent(cardRoot, introText);
    if (image && textContent.length > 0) {
      cells.push([image, textContent]);
    }
  });
  if (cells.length > 1) {
    const block = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(block);
  }
}
