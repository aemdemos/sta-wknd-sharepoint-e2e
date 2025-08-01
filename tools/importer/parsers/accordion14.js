/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion block inside the given element
  const accordion = element.querySelector('.cmp-accordion');
  if (!accordion) {
    return; // nothing to do
  }

  const headerRow = ['Accordion (accordion14)'];
  const rows = [headerRow];

  // get all accordion items
  const items = accordion.querySelectorAll(':scope > .cmp-accordion__item');

  items.forEach((item) => {
    // Find the title (button -> span.cmp-accordion__title)
    let titleCell = '';
    const button = item.querySelector('.cmp-accordion__button');
    if (button) {
      const titleSpan = button.querySelector('.cmp-accordion__title');
      if (titleSpan) {
        titleCell = titleSpan;
      }
    }

    // Find the content cell: panel
    let contentCell = '';
    const panel = item.querySelector('.cmp-accordion__panel');
    if (panel) {
      // The panel typically has a .container > .cmp-container > .text structure
      // We'll reference all ELEMENT children of the deepest .cmp-container
      let foundContent = null;
      const container = panel.querySelector(':scope > .container');
      if (container) {
        const cmpContainer = container.querySelector(':scope > .cmp-container');
        if (cmpContainer) {
          // Get all non-empty element children (e.g. .text blocks)
          const contents = Array.from(cmpContainer.children).filter(el => el.textContent.trim() !== '' || el.children.length > 0);
          if (contents.length > 0) {
            foundContent = contents.length === 1 ? contents[0] : contents;
          } else {
            foundContent = cmpContainer;
          }
        } else {
          foundContent = container;
        }
      } else {
        // Sometimes content can be direct children
        const elems = Array.from(panel.children).filter(el => el.textContent.trim() !== '' || el.children.length > 0);
        if (elems.length > 0) {
          foundContent = elems.length === 1 ? elems[0] : elems;
        } else {
          foundContent = panel;
        }
      }
      contentCell = foundContent;
    }

    rows.push([titleCell, contentCell]);
  });

  // Build the table and replace the accordion
  const table = WebImporter.DOMUtils.createTable(rows, document);
  accordion.replaceWith(table);
}
