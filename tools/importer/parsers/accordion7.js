/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content grid (most content is inside)
  const mainGrid = element.querySelector('.aem-Grid');
  if (!mainGrid) return;

  // Find the left column (contains title, image, text, accordion)
  const leftCol = Array.from(mainGrid.children).find(
    el => el.classList.contains('aem-GridColumn--default--8')
  );
  if (!leftCol) return;

  // Find the accordion block
  const accordionContainer = leftCol.querySelector('.accordion.panelcontainer');
  if (!accordionContainer) return;

  // Find the actual accordion element
  const accordion = accordionContainer.querySelector('.cmp-accordion');
  if (!accordion) return;

  // Get all accordion items
  const items = accordion.querySelectorAll(':scope > .cmp-accordion__item');

  // Build table rows
  const rows = [];
  // Always use this header row
  const headerRow = ['Accordion (accordion7)'];
  rows.push(headerRow);

  items.forEach(item => {
    // Title cell: get the button text
    const button = item.querySelector('.cmp-accordion__button');
    let titleText = '';
    if (button) {
      const titleSpan = button.querySelector('.cmp-accordion__title');
      if (titleSpan) {
        titleText = titleSpan.textContent.trim();
      } else {
        titleText = button.textContent.trim();
      }
    }
    // Always use a <strong> for the title for visual parity
    const titleEl = document.createElement('strong');
    titleEl.textContent = titleText;

    // Content cell: get the panel content
    const panel = item.querySelector('.cmp-accordion__panel');
    let contentEls = [];
    if (panel) {
      // Defensive: find all .cmp-text blocks inside the panel
      const textBlocks = panel.querySelectorAll('.cmp-text');
      if (textBlocks.length > 0) {
        contentEls = Array.from(textBlocks);
      } else {
        // If no .cmp-text, use all children
        contentEls = Array.from(panel.children);
      }
    }
    // Defensive: if no content, use empty string
    if (contentEls.length === 0) contentEls = [''];

    rows.push([titleEl, contentEls]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the accordion container with the table
  accordionContainer.replaceWith(table);

  // Remove any <hr> that is not immediately followed by a Section Metadata table
  // (per requirements: no <hr> unless there is a Section Metadata table)
  const hrs = element.querySelectorAll('hr');
  hrs.forEach(hr => {
    let next = hr.nextElementSibling;
    // skip whitespace text nodes
    while (next && next.nodeType === Node.TEXT_NODE && !next.textContent.trim()) {
      next = next.nextElementSibling;
    }
    if (!(next && next.tagName === 'TABLE' && next.querySelector('th') && next.querySelector('th').textContent.trim().toLowerCase() === 'section metadata')) {
      hr.remove();
    }
  });
}
