/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion block within the given element
  const accordion = element.querySelector('.cmp-accordion');
  if (!accordion) return;

  // Build the header row for the accordion block
  const rows = [['Accordion (accordion13)']];

  // Select all immediate accordion item children
  const items = accordion.querySelectorAll(':scope > .cmp-accordion__item');
  items.forEach((item) => {
    // Title extraction: use the .cmp-accordion__title span as the cell (original element)
    let titleElem = null;
    const button = item.querySelector('.cmp-accordion__button');
    if (button) {
      const span = button.querySelector('.cmp-accordion__title');
      if (span) {
        titleElem = span;
      } else {
        // fallback: use the button as plain text if span is missing
        titleElem = document.createTextNode(button.textContent.trim());
      }
    }

    // Content extraction: always use the direct child container inside the panel
    let contentElem = null;
    const panel = item.querySelector('.cmp-accordion__panel');
    if (panel) {
      // Prefer a .container.responsivegrid or .cmp-container direct child (typical structure)
      let mainContent = null;
      const responsiveGrid = panel.querySelector(':scope > .container.responsivegrid');
      if (responsiveGrid) {
        mainContent = responsiveGrid;
      } else {
        // fallback: try any .cmp-container
        const cmpContainer = panel.querySelector(':scope > .cmp-container');
        if (cmpContainer) {
          mainContent = cmpContainer;
        } else if (panel.children.length === 1) {
          mainContent = panel.children[0];
        } else {
          // fallback: use the panel itself (should rarely happen)
          mainContent = panel;
        }
      }
      contentElem = mainContent;
    }
    // Add row for this accordion item
    rows.push([titleElem, contentElem]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the accordion in the DOM with the new block table
  accordion.replaceWith(block);
}
