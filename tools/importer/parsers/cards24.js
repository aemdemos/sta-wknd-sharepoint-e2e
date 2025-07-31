/* global WebImporter */
export default function parse(element, { document }) {
  // Table header
  const headerRow = ['Cards (cards24)'];
  const tableRows = [headerRow];

  // Find all contributor/guide card sections
  const sections = element.querySelectorAll('section.cmp-experience-fragment--contributor');
  if (!sections.length) return;

  sections.forEach(section => {
    // Get image element
    const img = section.querySelector('.cmp-image__image');

    // Compose text content cell
    const contentEls = [];
    // Name (h3)
    const h3 = section.querySelector('h3');
    if (h3) contentEls.push(h3);
    // Role/Description (h5)
    const h5 = section.querySelector('h5');
    if (h5) contentEls.push(h5);

    // Add other visible text content (not in h3/h5/buttons)
    // For this source, the contributor/guide cards do not have extra paragraphs, but code is robust:
    Array.from(section.querySelectorAll('p')).forEach(p => {
      if (!p.closest('.cmp-button')) contentEls.push(p);
    });

    // Add all social buttons
    const buttonEls = Array.from(section.querySelectorAll('.cmp-button'));
    if (buttonEls.length) {
      const btnWrap = document.createElement('div');
      buttonEls.forEach(btn => btnWrap.appendChild(btn));
      contentEls.push(btnWrap);
    }
    
    // Always ensure something is in the text cell
    if (!contentEls.length) {
      const text = section.textContent.trim();
      if (text) contentEls.push(document.createTextNode(text));
    }

    tableRows.push([img, contentEls]);
  });

  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
