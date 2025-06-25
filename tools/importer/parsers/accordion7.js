/* global WebImporter */
export default function parse(element, { document }) {
  // Find the Accordion block root -- find the first .cmp-accordion descendant
  const accordionRoot = element.querySelector('.cmp-accordion');
  if (!accordionRoot) return;

  // Accordion items
  const items = Array.from(accordionRoot.querySelectorAll(':scope > .cmp-accordion__item'));
  if (items.length === 0) return;

  // Build table rows, header as first row
  const rows = [['Accordion']];

  items.forEach((item) => {
    // Title (left cell)
    let titleContent = '';
    const button = item.querySelector('.cmp-accordion__button');
    if (button) {
      // Instead of extracting text, use the button element as-is (preserves HTML, e.g. <span> with class)
      titleContent = button;
    }

    // Content (right cell)
    let contentCell = '';
    const panel = item.querySelector('.cmp-accordion__panel');
    if (panel) {
      // Find the first direct descendant (usually a .container or .cmp-container), reference it directly
      // Only include actual element children
      const panelContent = Array.from(panel.children).filter(el => el.nodeType === 1);
      if (panelContent.length === 1) {
        contentCell = panelContent[0];
      } else if (panelContent.length > 1) {
        contentCell = panelContent;
      } else {
        // fallback: panel itself
        contentCell = panel;
      }
    }
    rows.push([titleContent, contentCell]);
  });

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the accordion root in the DOM
  accordionRoot.replaceWith(table);
}
