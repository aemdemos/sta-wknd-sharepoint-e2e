/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion block - match on .cmp-accordion (Accordion)
  const accordion = element.querySelector('.cmp-accordion');
  if (!accordion) return;
  
  // Build the header row for the Accordion block
  const rows = [['Accordion']];

  // Get all accordion items
  const items = accordion.querySelectorAll('.cmp-accordion__item');
  items.forEach(item => {
    // Title cell: get title span, but reference it from DOM
    let titleContent = '';
    const button = item.querySelector('.cmp-accordion__button');
    if (button) {
      const titleSpan = button.querySelector('.cmp-accordion__title');
      if (titleSpan) {
        titleContent = titleSpan;
      } else {
        titleContent = button;
      }
    } else {
      // fallback to header text
      const heading = item.querySelector('h2, h3, h4, h5, h6');
      if (heading) {
        titleContent = heading;
      }
    }
    // Content cell: typically a .cmp-text inside .cmp-container inside panel
    let contentCell = '';
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    if (panel) {
      // If there is a .cmp-container, prefer its first .cmp-text if present, else entire container
      const cmpContainer = panel.querySelector('.cmp-container');
      if (cmpContainer) {
        const text = cmpContainer.querySelector('.cmp-text');
        if (text) {
          contentCell = text;
        } else {
          contentCell = cmpContainer;
        }
      } else {
        // If there's not, just use all panel children
        contentCell = Array.from(panel.childNodes).filter(n => n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim())).map(n => n);
        // If only one, use that directly
        if (Array.isArray(contentCell) && contentCell.length === 1) {
          contentCell = contentCell[0];
        }
      }
    }
    rows.push([titleContent, contentCell]);
  });

  // Create the Accordion block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace accordion with the new block table
  accordion.replaceWith(table);
}
