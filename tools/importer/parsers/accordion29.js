/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main accordion block container (the one with class 'accordion panelcontainer')
  const accordion = element.querySelector('.accordion.panelcontainer');
  if (!accordion) return;

  // The actual accordion block is the .cmp-accordion inside .accordion.panelcontainer
  const cmpAccordion = accordion.querySelector('.cmp-accordion');
  if (!cmpAccordion) return;

  // Get all direct accordion items
  const items = cmpAccordion.querySelectorAll(':scope > .cmp-accordion__item');
  if (!items.length) return;

  // The header row as specified
  const tableRows = [['Accordion (accordion29)']];

  items.forEach(item => {
    // Title: <span class="cmp-accordion__title"> inside the button
    let titleSpan = item.querySelector('.cmp-accordion__title');
    let titleContent = titleSpan || '';

    // Content: the panel div (data-cmp-hook-accordion="panel")
    let panel = item.querySelector('.cmp-accordion__panel');
    let contentCell = '';
    if (panel) {
      // The content is typically inside .container > .cmp-container inside the panel
      let innerContainer = panel.querySelector('.cmp-container');
      if (innerContainer) {
        // If the inner container has a single child, use it; otherwise, use all together
        const children = Array.from(innerContainer.children);
        if (children.length === 1) {
          contentCell = children[0];
        } else if (children.length > 1) {
          // Use an array of elements so createTable can handle it
          contentCell = children;
        } else {
          // fallback to the whole container
          contentCell = innerContainer;
        }
      } else {
        // fallback to the panel itself if structure is different
        contentCell = panel;
      }
    }

    tableRows.push([
      titleContent,
      contentCell
    ]);
  });

  // Create the block table and replace the original accordion element
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  accordion.replaceWith(block);
}
