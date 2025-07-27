/* global WebImporter */
export default function parse(element, { document }) {
  // Table header
  const headerRow = ['Cards (cards24)'];
  const rows = [headerRow];

  // Find all contributor/guide card sections
  const cardSections = element.querySelectorAll('.experiencefragment.cmp-experience-fragment--contributor');

  cardSections.forEach(section => {
    // 1. Image cell (mandatory)
    const img = section.querySelector('img');

    // 2. Text cell: gather all text content, including titles, subtitles, paragraphs, and social buttons
    const cellContent = [];

    // All title elements (h3, h5, etc)
    section.querySelectorAll('.cmp-title__text').forEach(node => {
      cellContent.push(node);
    });

    // All paragraphs (inside this section, not already added)
    section.querySelectorAll('p').forEach(p => {
      // Only add if not already present
      if (!cellContent.includes(p)) {
        cellContent.push(p);
      }
    });

    // Social buttons (all a.cmp-button)
    const buttons = section.querySelectorAll('a.cmp-button');
    if (buttons.length > 0) {
      const btnDiv = document.createElement('div');
      buttons.forEach(btn => btnDiv.appendChild(btn));
      cellContent.push(btnDiv);
    }

    if (img && cellContent.length > 0) {
      rows.push([img, cellContent]);
    }
  });

  if (rows.length > 1) {
    const block = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(block);
  }
}
