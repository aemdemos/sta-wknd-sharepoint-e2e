/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion block
  const accordion = element.querySelector('.accordion .cmp-accordion');
  if (!accordion) return;

  // Table header row: exact match per requirements
  const headerRow = ['Accordion (accordion3)'];
  const rows = [headerRow];

  // Find all accordion items
  const items = accordion.querySelectorAll('.cmp-accordion__item');
  items.forEach(item => {
    // Title cell: get text from .cmp-accordion__title, preserve semantics (strong for FAQ)
    let titleElem = null;
    const button = item.querySelector('.cmp-accordion__button');
    if (button) {
      const titleSpan = button.querySelector('.cmp-accordion__title');
      if (titleSpan) {
        // Use an existing span if possible, otherwise wrap in <strong>
        titleElem = document.createElement('strong');
        titleElem.textContent = titleSpan.textContent.trim();
      } else {
        // fallback: whole button text
        titleElem = document.createElement('strong');
        titleElem.textContent = button.textContent.trim();
      }
    } else {
      // fallback: missing button
      titleElem = document.createElement('strong');
      titleElem.textContent = '';
    }

    // Content cell: get the main content from the panel
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    let contentElem = null;
    if (panel) {
      // Try to get the deepest .cmp-text in the panel
      let textElem = panel.querySelector('.cmp-container .text .cmp-text');
      if (textElem) {
        contentElem = textElem;
      } else {
        // fallback to the cmp-container itself
        let containerElem = panel.querySelector('.cmp-container');
        if (containerElem) {
          contentElem = containerElem;
        } else {
          // fallback to panel (should never happen for this HTML)
          contentElem = panel;
        }
      }
    } else {
      // fallback: missing panel
      contentElem = document.createElement('div');
    }

    rows.push([titleElem, contentElem]);
  });

  // Create the block table using referenced elements
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
