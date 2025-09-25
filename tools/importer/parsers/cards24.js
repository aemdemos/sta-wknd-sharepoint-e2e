/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card info from a contributor fragment
  function extractCardInfo(section) {
    // Find image
    const img = section.querySelector('img');
    // Find name/title (h3)
    let name = section.querySelector('h3');
    // Find role (h5)
    let role = section.querySelector('h5');
    // Find all social buttons
    const buttons = Array.from(section.querySelectorAll('.cmp-button'));
    // Compose text cell: name (heading), role (below), buttons (below)
    const textContent = document.createElement('div');
    if (name) {
      const h = document.createElement('h3');
      h.textContent = name.textContent;
      textContent.appendChild(h);
    }
    if (role) {
      const r = document.createElement('div');
      r.textContent = role.textContent;
      textContent.appendChild(r);
    }
    if (buttons.length > 0) {
      const btnDiv = document.createElement('div');
      buttons.forEach(btn => {
        btnDiv.appendChild(btn.cloneNode(true));
      });
      textContent.appendChild(btnDiv);
    }
    return [img ? img.cloneNode(true) : '', textContent.childNodes.length ? Array.from(textContent.childNodes) : ''];
  }

  // Find all sections that are contributor cards
  const cardSections = Array.from(element.querySelectorAll('section.experiencefragment.cmp-experience-fragment--contributor'));

  // Build table rows for all cards
  const cardRows = cardSections.map(section => extractCardInfo(section));

  // Table header
  const headerRow = ['Cards (cards24)'];

  // Compose table data
  const tableData = [headerRow, ...cardRows];

  // Create table
  const table = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace original element
  element.replaceWith(table);
}
