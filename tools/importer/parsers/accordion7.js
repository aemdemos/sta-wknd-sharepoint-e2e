/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion block
  const accordion = element.querySelector('.cmp-accordion');
  if (!accordion) return;

  // Table header as in the spec
  const cells = [['Accordion']];

  // Each accordion item is a row
  const items = accordion.querySelectorAll('.cmp-accordion__item');
  items.forEach((item) => {
    // Title cell: keep original markup for semantic meaning
    let titleCell;
    const button = item.querySelector('.cmp-accordion__button');
    if (button) {
      // The button may contain the .cmp-accordion__title (usually a span)
      const titleSpan = button.querySelector('.cmp-accordion__title');
      titleCell = titleSpan ? titleSpan : button;
    } else {
      // Defensive fallback for missing title
      titleCell = document.createElement('span');
      titleCell.textContent = 'Untitled';
    }

    // Content cell: reference real, semantically meaningful content
    let contentCell;
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    if (panel) {
      // Usually: panel > container.responsivegrid > cmp-container > [content blocks]
      // We'll try to grab the .cmp-container inside .responsivegrid, or as fallback the panel contents
      const responsivegrid = panel.querySelector('.responsivegrid');
      let cmpContainer = responsivegrid && responsivegrid.querySelector(':scope > .cmp-container');
      if (!cmpContainer) cmpContainer = panel.querySelector('.cmp-container');
      if (cmpContainer) {
        // Collect all direct children that are not empty
        const blocks = Array.from(cmpContainer.children).filter(child => child.textContent.trim().length > 0 || child.querySelector('img'));
        // If only one block, use directly; else as array; fallback to cmpContainer itself if empty
        if (blocks.length === 1) {
          contentCell = blocks[0];
        } else if (blocks.length > 1) {
          contentCell = blocks;
        } else {
          contentCell = cmpContainer;
        }
      } else {
        // fallback: just use what is in the panel
        const blocks = Array.from(panel.children).filter(child => child.textContent.trim().length > 0 || child.querySelector('img'));
        contentCell = blocks.length === 1 ? blocks[0] : (blocks.length > 1 ? blocks : panel);
      }
    } else {
      // Defensive: empty div
      contentCell = document.createElement('div');
    }

    cells.push([
      titleCell,
      contentCell
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  accordion.replaceWith(table);
}
