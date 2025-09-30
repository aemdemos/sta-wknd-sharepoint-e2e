/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card info from a contributor fragment
  function extractCard(section) {
    // Find image
    const img = section.querySelector('.cmp-image img');
    // Find name/title (h3)
    const nameTitle = section.querySelector('h3');
    // Find subtitle (h5)
    const subtitle = section.querySelector('h5');
    // Find description (optional: look for .cmp-title__text in h3/h5, but also any p or span)
    // Try to find any extra descriptive text
    let description = null;
    // Look for a paragraph or span after the h3/h5
    const possibleDesc = section.querySelectorAll('p, span');
    for (const el of possibleDesc) {
      // Only include if not inside a button
      if (!el.closest('.cmp-button')) {
        description = el;
        break;
      }
    }
    // Find social buttons
    const buttons = Array.from(section.querySelectorAll('.cmp-button'));
    // Compose text cell
    const textCellContent = [];
    if (nameTitle) textCellContent.push(nameTitle);
    if (subtitle) textCellContent.push(subtitle);
    if (description) textCellContent.push(description);
    if (buttons.length) {
      // Wrap buttons in a div for layout
      const btnDiv = document.createElement('div');
      btnDiv.style.display = 'flex';
      btnDiv.style.gap = '8px';
      buttons.forEach(btn => btnDiv.appendChild(btn));
      textCellContent.push(btnDiv);
    }
    return [img, textCellContent];
  }

  // Find all contributor and guide sections
  const sections = Array.from(element.querySelectorAll('section.experiencefragment.cmp-experience-fragment--contributor'));

  // Build table rows
  const headerRow = ['Cards (cards3)'];
  const rows = [headerRow];
  sections.forEach(section => {
    rows.push(extractCard(section));
  });

  // Create and replace block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
