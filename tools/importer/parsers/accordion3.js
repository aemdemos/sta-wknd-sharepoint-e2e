/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main accordion block inside the passed element
  const accordion = element.querySelector('.accordion .cmp-accordion');
  if (!accordion) return;

  // Prepare the table cells, header as in the example
  const cells = [['Accordion (accordion3)']];

  // Select all accordion items
  const items = accordion.querySelectorAll('.cmp-accordion__item');

  items.forEach(item => {
    // Title cell: the visible title comes from the .cmp-accordion__title span
    let titleNode = item.querySelector('.cmp-accordion__title');
    let titleCellContent = '';
    if (titleNode) {
      // Use a <p> like in the markdown example (for resilience), but reference existing text
      const p = document.createElement('p');
      p.textContent = titleNode.textContent.trim();
      titleCellContent = p;
    }
    
    // Content cell: looks for the main answer/content, usually in .cmp-text
    let contentCell = null;
    const panel = item.querySelector('.cmp-accordion__panel');
    if (panel) {
      // If there are one or more cmp-text blocks in the panel, use them
      const textBlocks = [...panel.querySelectorAll('.cmp-text')];
      if (textBlocks.length > 0) {
        // If just one, use the element directly
        // If multiple, use them in an array (spread for multiple paragraphs, etc)
        contentCell = textBlocks.length === 1 ? textBlocks[0] : textBlocks;
      } else {
        // Fallback: use the entire panel content (could include images or other blocks)
        // But avoid including the panel container (with ARIA, etc) -- just its children
        contentCell = Array.from(panel.childNodes).filter(n => n.nodeType === 1);
        if (contentCell.length === 1) {
          contentCell = contentCell[0];
        } else if (contentCell.length === 0) {
          // fallback: use the panel itself
          contentCell = panel;
        }
      }
    }
    // Only add row if at least the title is present
    if (titleCellContent && contentCell) {
      cells.push([titleCellContent, contentCell]);
    }
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace original accordion with the table
  accordion.parentNode.replaceChild(block, accordion);
}
