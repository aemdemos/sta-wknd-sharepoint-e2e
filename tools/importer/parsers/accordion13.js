/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion block inside the given element
  const accordionWrapper = element.querySelector('.accordion .cmp-accordion');
  if (!accordionWrapper) return;

  // Table header row as specified
  const cells = [
    ['Accordion (accordion13)']
  ];

  // Get all accordion items
  const items = accordionWrapper.querySelectorAll(':scope > .cmp-accordion__item');
  items.forEach(item => {
    // Get the title span element (not just text, to preserve strong formatting)
    const titleSpan = item.querySelector('.cmp-accordion__title');
    // Use existing span if possible for content, but wrap in <strong> to match typical accordion styling
    const titleElement = document.createElement('strong');
    titleElement.textContent = titleSpan ? titleSpan.textContent.trim() : '';

    // Get the panel content (the answer/expandable part)
    const panel = item.querySelector('.cmp-accordion__panel');
    let contentCell = '';
    if (panel) {
      // Often there is a .cmp-container inside panel, and then .cmp-text inside that
      // We'll collect all .cmp-text elements inside this panel
      const textEls = panel.querySelectorAll('.cmp-text');
      if (textEls.length > 0) {
        contentCell = Array.from(textEls);
      } else {
        // If no .cmp-text, use the innermost container or any direct children
        const container = panel.querySelector('.cmp-container') || panel;
        // Use all children of the container
        if (container.children.length > 0) {
          contentCell = Array.from(container.children);
        } else {
          // As a fallback, use panel text content
          contentCell = panel.textContent.trim();
        }
      }
    }
    // Add row for this item, referencing existing elements
    cells.push([
      titleElement,
      contentCell
    ]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the accordion wrapper with the block
  accordionWrapper.replaceWith(block);
}
