/* global WebImporter */
export default function parse(element, { document }) {
  // Find all contributor and guide sections
  const sections = Array.from(element.querySelectorAll('section.cmp-experience-fragment--contributor'));

  const headerRow = ['Cards (cards3)'];
  const rows = [headerRow];

  sections.forEach(section => {
    // Image
    const img = section.querySelector('.cmp-image__image');
    let imageCell = '';
    if (img) {
      imageCell = img.cloneNode(true);
      if (imageCell.src && imageCell.src.startsWith('/')) {
        imageCell.src = 'https://wknd.site' + imageCell.src;
      }
    }
    // Text content
    const textParts = [];
    // Get name
    const name = section.querySelector('h3');
    if (name) textParts.push(name.cloneNode(true));
    // Get subtitle
    const subtitle = section.querySelector('h5');
    if (subtitle) textParts.push(subtitle.cloneNode(true));
    // Get description (look for p or i or any text under the section)
    // Try to find a description below the name/subtitle
    let desc = null;
    // Look for a p tag inside the section that is not inside .cmp-title
    const possiblePs = Array.from(section.querySelectorAll('p'));
    desc = possiblePs.find(p => !p.closest('.cmp-title'));
    if (!desc) {
      // Try to find any text node that's not part of the h3/h5
      const containers = Array.from(section.querySelectorAll('.cmp-title'));
      const allTextNodes = Array.from(section.childNodes).filter(n => n.nodeType === 3 && n.textContent.trim());
      if (allTextNodes.length) {
        const span = document.createElement('span');
        span.textContent = allTextNodes.map(n => n.textContent.trim()).join(' ');
        desc = span;
      }
    }
    if (desc) textParts.push(desc.cloneNode(true));
    // Social buttons
    const btns = Array.from(section.querySelectorAll('.cmp-button'));
    if (btns.length) {
      const btnDiv = document.createElement('div');
      btns.forEach(btn => btnDiv.appendChild(btn.cloneNode(true)));
      textParts.push(btnDiv);
    }
    rows.push([imageCell, textParts]);
  });

  // Replace element with table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
