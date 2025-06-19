/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion block inside the element
  const accordion = element.querySelector('.accordion .cmp-accordion');
  if (!accordion) return;

  // Table header must match block name exactly as specified
  const rows = [['Accordion (accordion7)']];

  // Find all accordion items
  const items = accordion.querySelectorAll(':scope > .cmp-accordion__item');
  items.forEach((item) => {
    // Title cell: extract the title text exactly as shown to the user (plain text only)
    let title = '';
    const btn = item.querySelector('.cmp-accordion__button');
    if (btn) {
      const titleSpan = btn.querySelector('.cmp-accordion__title');
      if (titleSpan) {
        title = titleSpan.textContent.trim();
      }
    }

    // Content cell: reference the panel's main content (the container inside panel)
    let contentCell = [];
    const panel = item.querySelector('.cmp-accordion__panel');
    if (panel) {
      // There might be a single main container inside the panel
      // We'll include all children inside the panel, referencing them directly
      // If it's a container, grab its children, otherwise use as is
      const topChildren = Array.from(panel.children);
      if (topChildren.length === 1 &&
          (topChildren[0].classList.contains('container') || topChildren[0].classList.contains('cmp-container'))) {
        // Find all cmp-text blocks inside for the content
        const allTexts = topChildren[0].querySelectorAll('.cmp-text');
        if (allTexts.length > 0) {
          contentCell = Array.from(allTexts);
        } else {
          contentCell = [topChildren[0]];
        }
      } else if (topChildren.length > 0) {
        contentCell = topChildren;
      } else {
        // If no children, fallback to the panel itself
        contentCell = [panel];
      }
    }

    // Add row: strictly 2 columns as per block definition
    rows.push([title, contentCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  accordion.replaceWith(table);
}
