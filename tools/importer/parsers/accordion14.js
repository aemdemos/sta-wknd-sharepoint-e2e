/* global WebImporter */
export default function parse(element, { document }) {
  // Find the *first* Accordion block inside the given element
  const accordionBlock = element.querySelector('.accordion.panelcontainer .cmp-accordion');
  if (!accordionBlock) return;

  const items = Array.from(accordionBlock.querySelectorAll(':scope > .cmp-accordion__item'));
  // Prepare header row as in example
  const rows = [['Accordion']];

  items.forEach(item => {
    // Title cell: get the .cmp-accordion__title span (contains the heading/question)
    let titleCell = item.querySelector('.cmp-accordion__title');
    if (!titleCell) {
      // fallback: just use the button text
      const button = item.querySelector('.cmp-accordion__button');
      titleCell = button ? document.createTextNode(button.textContent.trim()) : document.createTextNode('');
    }

    // Content cell: get all contents inside the .cmp-accordion__panel, but only the actual answer (not the wrapping elements)
    const panel = item.querySelector('.cmp-accordion__panel');
    let contentCell = document.createElement('div');
    if (panel) {
      // Get all direct .cmp-container children, or fallback to panel's children
      const containers = Array.from(panel.querySelectorAll(':scope > .container, :scope > .cmp-container'));
      if (containers.length > 0) {
        // If there are multiple, add all
        containers.forEach(container => {
          // Add all children of container (usually <div class="text">)
          Array.from(container.children).forEach(child => {
            contentCell.appendChild(child);
          });
        });
      } else {
        // Fallback: just use all children of panel
        Array.from(panel.children).forEach(child => {
          contentCell.appendChild(child);
        });
      }
      // If nothing was appended, fallback to panel text
      if (!contentCell.hasChildNodes()) {
        contentCell.textContent = panel.textContent.trim();
      }
    }
    rows.push([titleCell, contentCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  accordionBlock.replaceWith(table);
}
