/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the accordion block
  const accordion = element.querySelector('.cmp-accordion');
  if (!accordion) return;

  // Set up the header row
  const rows = [['Accordion']];

  // Get all accordion items
  const items = accordion.querySelectorAll(':scope > .cmp-accordion__item');
  items.forEach((item) => {
    // Title: clickable label (as element, preserving formatting)
    let titleCell;
    const btnTitle = item.querySelector('.cmp-accordion__button .cmp-accordion__title');
    if (btnTitle) {
      titleCell = btnTitle; // Use existing element
    } else {
      // Fallback: button text
      const btn = item.querySelector('.cmp-accordion__button');
      titleCell = btn ? document.createTextNode(btn.textContent.trim()) : document.createTextNode('');
    }
    // Content: the body (can be complex, grab .cmp-container if present, else full panel)
    let contentCell;
    const panel = item.querySelector('.cmp-accordion__panel');
    if (panel) {
      // prefer .cmp-container or .container inside panel if it exists, else panel
      const sub = panel.querySelector('.cmp-container, .container.responsivegrid');
      contentCell = sub ? sub : panel;
    } else {
      contentCell = document.createTextNode('');
    }
    rows.push([titleCell, contentCell]);
  });

  // Create and insert the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.parentNode.replaceChild(table, element);
}
