/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion block
  const accordion = element.querySelector('.accordion .cmp-accordion');
  if (!accordion) return;

  // Table header row (must be single cell)
  const headerRow = ['Accordion (accordion7)'];
  const rows = [headerRow];

  // Get all accordion items
  const items = accordion.querySelectorAll('.cmp-accordion__item');
  items.forEach((item) => {
    // Title cell: use the span.cmp-accordion__title node directly
    const titleSpan = item.querySelector('.cmp-accordion__button .cmp-accordion__title');
    const titleCell = titleSpan ? titleSpan.cloneNode(true) : '';

    // Content cell: extract only the actual content inside the panel
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    let contentCell = '';
    if (panel) {
      // Find all .cmp-text elements inside the panel (these hold the real content)
      const texts = panel.querySelectorAll('.cmp-text');
      if (texts.length === 1) {
        contentCell = texts[0].cloneNode(true);
      } else if (texts.length > 1) {
        contentCell = Array.from(texts).map((t) => t.cloneNode(true));
      } else {
        // fallback: just use the panel's text content
        contentCell = panel.textContent.trim();
      }
    }
    rows.push([titleCell, contentCell]);
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
