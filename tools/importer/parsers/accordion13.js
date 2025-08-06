/* global WebImporter */
export default function parse(element, { document }) {
  // Find all accordions within the element
  const accordions = element.querySelectorAll('.cmp-accordion');
  accordions.forEach((accordion) => {
    // Header row for the block
    const cells = [['Accordion (accordion13)']];
    // Get all accordion items
    const items = accordion.querySelectorAll('.cmp-accordion__item');
    items.forEach((item) => {
      // --- TITLE CELL ---
      // Extract the button (for semantics and to match active element structure)
      let titleEl = item.querySelector('.cmp-accordion__button');
      // If button is missing, fallback to empty string
      if (!titleEl) titleEl = document.createTextNode('');
      // --- CONTENT CELL ---
      // The panel holds the content
      let contentCell;
      const panel = item.querySelector('.cmp-accordion__panel');
      if (panel) {
        // Panel may contain a container.responsivegrid > cmp-container > .text, etc
        // We'll try to use the semantic content - i.e. the 'cmp-container' children
        // If structure is panel > container > cmp-container > content
        const mainContainers = panel.querySelectorAll(':scope > .container.responsivegrid > .cmp-container');
        if (mainContainers.length > 0) {
          // Collect all direct children of cmp-container (text, images, etc)
          const fragment = document.createDocumentFragment();
          mainContainers.forEach((cmpContainer) => {
            Array.from(cmpContainer.children).forEach(child => fragment.appendChild(child));
          });
          // If no children, fallback to cmp-container itself
          contentCell = fragment.childNodes.length ? Array.from(fragment.childNodes) : Array.from(mainContainers);
        } else {
          // If not matching above, use the panel's contents
          contentCell = Array.from(panel.childNodes);
        }
        // Remove empty text nodes from contentCell
        if (Array.isArray(contentCell)) {
          contentCell = contentCell.filter(n => {
            return !(n.nodeType === 3 && !n.nodeValue.trim());
          });
          if (contentCell.length === 1) contentCell = contentCell[0];
        }
      } else {
        contentCell = document.createTextNode('');
      }
      // Add the row to the block
      cells.push([titleEl, contentCell]);
    });
    // Create the accordion block table
    const block = WebImporter.DOMUtils.createTable(cells, document);
    // Replace the accordion in the DOM
    accordion.replaceWith(block);
  });
}
