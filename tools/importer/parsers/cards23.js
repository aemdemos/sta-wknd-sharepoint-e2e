/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card info from contributor fragments
  function extractCardInfo(section) {
    // Find image
    const img = section.querySelector('.cmp-image__image');
    // Find name/title (h3)
    const nameTitle = section.querySelector('h3');
    // Find subtitle (h5)
    const subtitle = section.querySelector('h5');
    // Find buttons (social links)
    const buttons = Array.from(section.querySelectorAll('.cmp-button'));
    // Compose text cell
    const textCell = document.createElement('div');
    if (nameTitle) textCell.appendChild(nameTitle.cloneNode(true));
    if (subtitle) textCell.appendChild(subtitle.cloneNode(true));
    // Defensive: add description if available (look for p, i, or span)
    const desc = section.querySelector('p, i, span');
    if (desc) textCell.appendChild(desc.cloneNode(true));
    if (buttons.length) {
      // Wrap buttons in a div for layout
      const btnDiv = document.createElement('div');
      buttons.forEach(btn => btnDiv.appendChild(btn.cloneNode(true)));
      textCell.appendChild(btnDiv);
    }
    return [img ? img.cloneNode(true) : '', textCell.childNodes.length ? Array.from(textCell.childNodes) : ''];
  }

  // Find all contributor sections
  const cardSections = Array.from(element.querySelectorAll('section.cmp-experience-fragment--contributor'));

  // Build table rows
  const rows = [];
  // Header row
  const headerRow = ['Cards (cards23)'];
  rows.push(headerRow);

  // For each contributor, add a row
  cardSections.forEach(section => {
    const [img, textCell] = extractCardInfo(section);
    // Defensive: Only add if image and text
    if (img && textCell && textCell.length) {
      rows.push([img, textCell]);
    }
  });

  // Create and replace block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
