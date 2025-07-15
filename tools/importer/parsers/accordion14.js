/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main accordion block by its class
  const accordionOuter = element.querySelector('.accordion.panelcontainer');
  if (!accordionOuter) return;
  const cmpAccordion = accordionOuter.querySelector('.cmp-accordion');
  if (!cmpAccordion) return;

  // Find all accordion items (direct children of the accordion block)
  const items = cmpAccordion.querySelectorAll(':scope > .cmp-accordion__item');
  // Start the rows with the required single-cell header row
  const rows = [['Accordion']];

  // Process each accordion item
  items.forEach((item) => {
    // Extract the title: use the .cmp-accordion__title span
    let titleCell;
    const titleBtn = item.querySelector('.cmp-accordion__button');
    if (titleBtn) {
      const titleSpan = titleBtn.querySelector('.cmp-accordion__title');
      titleCell = titleSpan ? titleSpan : titleBtn;
    } else {
      // fallback - use heading element or whole item
      const heading = item.querySelector('h1,h2,h3,h4,h5,h6');
      titleCell = heading ? heading : '';
    }

    // Extract content: look for [data-cmp-hook-accordion="panel"]
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    let contentCell = '';
    if (panel) {
      // Usually the content is nested inside .container.responsivegrid > .cmp-container
      // We want to include the actual .text block or its children
      const container = panel.querySelector('.container.responsivegrid');
      // If found, process all cmp-container children
      if (container) {
        const cmpContainers = container.querySelectorAll(':scope > .cmp-container');
        const contentParts = [];
        cmpContainers.forEach(cc => {
          // For FAQ, usually only one .text block per answer, but we include all direct children
          Array.from(cc.children).forEach(child => contentParts.push(child));
        });
        contentCell = contentParts.length === 1 ? contentParts[0] : contentParts;
      } else {
        // fallback: if panel has content directly
        const panelContent = Array.from(panel.children).filter(el => el.nodeType === 1);
        contentCell = panelContent.length === 1 ? panelContent[0] : panelContent;
      }
    }

    rows.push([titleCell, contentCell]);
  });

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(rows, document);
  accordionOuter.replaceWith(block);
}
