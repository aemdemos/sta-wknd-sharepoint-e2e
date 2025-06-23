/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Given a card section, extract [image, text content]
  function extractCard(section) {
    // Find the first image in the card
    const img = section.querySelector('img');

    // Get all title blocks (names, roles, etc)
    const titles = Array.from(section.querySelectorAll('.title'));
    // Get all social button containers (buildingblock)
    const socials = Array.from(section.querySelectorAll('.buildingblock'));

    // Compose all text content in DOM order
    const textContent = [];
    titles.forEach((t, idx) => {
      // Only add if it contains visible text
      if (t.textContent && t.textContent.trim().length > 0) {
        textContent.push(t);
      }
    });
    socials.forEach((b, idx) => {
      // Only add if it actually contains links
      if (b.querySelector('a.cmp-button')) {
        textContent.push(b);
      }
    });

    // If there's more than one element, return as array
    let cellContent;
    if (textContent.length === 1) cellContent = textContent[0];
    else if (textContent.length > 1) cellContent = textContent;
    else cellContent = '';
    return [img, cellContent];
  }

  // Find all card sections (in visual order)
  const cardSections = Array.from(element.querySelectorAll('section.experiencefragment.cmp-experience-fragment--contributor'));

  // Build table rows
  const cells = [['Cards (cards24)']];
  cardSections.forEach((section) => {
    cells.push(extractCard(section));
  });

  // Create the block table and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
