/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion block inside the provided element
  let accordion = element.querySelector('.cmp-accordion');
  if (!accordion) return;

  // Set up the rows array for the block table, with header EXACTLY as given
  const rows = [['Accordion (accordion7)']];

  // Get all immediate accordion items
  const items = accordion.querySelectorAll(':scope > .cmp-accordion__item');
  items.forEach((item) => {
    // Title cell: use the .cmp-accordion__title span itself (preserves markup)
    let titleEl = item.querySelector('.cmp-accordion__button .cmp-accordion__title');
    if (!titleEl) {
      // Fallback: use the h3 (shouldn't occur, but robust)
      titleEl = item.querySelector('h3');
    }
    
    // Content cell: the .cmp-accordion__panel (all content inside, as element)
    let contentEl = item.querySelector('.cmp-accordion__panel');
    if (contentEl) {
      // We should reference the existing node, not clone it
      // But we should remove classes/attributes that would hide it
      contentEl.classList.remove('cmp-accordion__panel--hidden');
      contentEl.removeAttribute('aria-hidden');
    }
    // Add title and content to the row
    // If for some reason contentEl is null, fall back to an empty string
    rows.push([titleEl || '', contentEl || '']);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original accordion with the table
  accordion.replaceWith(table);
}
