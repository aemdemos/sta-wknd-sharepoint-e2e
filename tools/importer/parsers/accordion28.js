/* global WebImporter */
export default function parse(element, { document }) {
  // Find the Accordion block in the element
  const accordion = element.querySelector('.accordion.panelcontainer .cmp-accordion');
  if (!accordion) return;

  // Prepare the table rows
  const cells = [];
  // Header row as specified in the block guidelines
  cells.push(['Accordion']);

  // Find all accordion items
  const items = Array.from(
    accordion.querySelectorAll(':scope > .cmp-accordion__item')
  );

  // For each item, extract title and content
  items.forEach((item) => {
    // Title
    let title = '';
    const btn = item.querySelector('.cmp-accordion__button');
    const titleSpan = btn && btn.querySelector('.cmp-accordion__title');
    if (titleSpan) {
      title = titleSpan.textContent.trim();
    } else if (btn) {
      title = btn.textContent.trim();
    }

    // Content (the panel area; use the first container child, if any, else the panel itself)
    let contentElem = null;
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    if (panel) {
      const panelContainer = panel.querySelector(':scope > .container, :scope > .cmp-container');
      contentElem = panelContainer ? panelContainer : panel;
    }
    // Defensive: fallback to an empty div if no content found
    if (!contentElem) {
      contentElem = document.createElement('div');
    }
    cells.push([title, contentElem]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the accordion element with the table
  accordion.replaceWith(table);
}
