/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion block root. It should be a descendant with both 'accordion' and 'cmp-accordion' classes
  const accordionBlock = element.querySelector('.accordion .cmp-accordion');
  if (!accordionBlock) return;

  // Prepare the header row exactly as required
  const rows = [['Accordion']];

  // Get all accordion items
  const items = accordionBlock.querySelectorAll(':scope > .cmp-accordion__item');
  items.forEach((item) => {
    // Title: .cmp-accordion__title inside the button
    let titleElem = item.querySelector('.cmp-accordion__title');
    let titleCell = titleElem ? titleElem : '';

    // Content: .cmp-accordion__panel contains the content, which itself contains cmp-container(s) with .text blocks
    const panel = item.querySelector('.cmp-accordion__panel');
    let contentCell = '';
    if (panel) {
      // Try to get all direct .cmp-container children (should be only one)
      const cmpContainers = panel.querySelectorAll(':scope > .container > .cmp-container');
      if (cmpContainers.length > 0) {
        // Each cmp-container may wrap a .text or other blocks
        const contents = [];
        cmpContainers.forEach((container) => {
          // Get all direct children of the cmp-container
          container.childNodes.forEach((child) => {
            if (child.nodeType === Node.ELEMENT_NODE) {
              contents.push(child);
            }
          });
        });
        if (contents.length === 1) {
          contentCell = contents[0];
        } else if (contents.length > 1) {
          contentCell = contents;
        }
      } else {
        // fallback to all content in panel (should be rare)
        // try to reference any direct children other than containers
        const fallbackContents = [];
        panel.childNodes.forEach((child) => {
          if (child.nodeType === Node.ELEMENT_NODE && !child.classList.contains('container')) {
            fallbackContents.push(child);
          }
        });
        if (fallbackContents.length === 1) {
          contentCell = fallbackContents[0];
        } else if (fallbackContents.length > 1) {
          contentCell = fallbackContents;
        } else {
          contentCell = panel;
        }
      }
    }
    rows.push([titleCell, contentCell]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the accordion block with the new table
  accordionBlock.parentElement.replaceWith(table);
}
