/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the accordion block within the provided element
  const accordion = Array.from(element.querySelectorAll(':scope .accordion, :scope .cmp-accordion')).find(el => el.classList.contains('cmp-accordion'));
  if (!accordion) return;

  // Table header row as required
  const headerRow = ['Accordion (accordion7)'];
  const rows = [headerRow];

  // Get all accordion items
  const items = accordion.querySelectorAll(':scope > .cmp-accordion__item');
  items.forEach(item => {
    // Title cell: find the button with the title span
    let titleCell;
    const button = item.querySelector('.cmp-accordion__button');
    if (button) {
      // Defensive: get the title span, fallback to button text
      const titleSpan = button.querySelector('.cmp-accordion__title');
      if (titleSpan) {
        // Use a strong element for visual emphasis, as in screenshot
        const strong = document.createElement('strong');
        strong.textContent = titleSpan.textContent.trim();
        titleCell = strong;
      } else {
        titleCell = button.textContent.trim();
      }
    } else {
      // Fallback: use first heading or text
      const h3 = item.querySelector('h3');
      titleCell = h3 ? h3.textContent.trim() : '';
    }

    // Content cell: find the panel and include all its content
    let contentCell;
    const panel = item.querySelector('.cmp-accordion__panel');
    if (panel) {
      // Defensive: get all direct children of the panel
      // Usually a container > cmp-container > text, but may vary
      // We'll grab all children of panel, flattening containers
      let contentElements = [];
      // Find all .cmp-text elements inside the panel
      const texts = panel.querySelectorAll('.cmp-text');
      if (texts.length) {
        texts.forEach(textEl => {
          contentElements.push(textEl);
        });
      } else {
        // Fallback: use all children
        contentElements = Array.from(panel.children);
      }
      // If only one element, use it directly; else, use array
      contentCell = contentElements.length === 1 ? contentElements[0] : contentElements;
    } else {
      contentCell = '';
    }

    rows.push([titleCell, contentCell]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original accordion element with the block table
  accordion.replaceWith(table);
}
