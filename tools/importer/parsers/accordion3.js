/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main accordion block container within the provided element
  const accordion = element.querySelector('.cmp-accordion');
  if (!accordion) return;

  // Get all accordion items directly under this accordion
  const items = accordion.querySelectorAll(':scope > .cmp-accordion__item');

  // Compose the cells array for createTable
  const cells = [];
  const headerRow = ['Accordion (accordion3)'];
  cells.push(headerRow);

  items.forEach(item => {
    // Title cell (mandatory) – the clickable title or label for the accordion item.
    let titleContent = '';
    const spanTitle = item.querySelector('.cmp-accordion__title');
    if (spanTitle) {
      titleContent = spanTitle.textContent.trim();
    }
    // Use a <div> to preserve any formatting or structure, but reference the real child span.
    let titleElem;
    if (spanTitle) {
      // Reference the span directly, not a clone
      titleElem = spanTitle;
    } else {
      titleElem = document.createTextNode(titleContent);
    }

    // Content cell (mandatory) – the body text, media, or any additional elements that will appear when expanded.
    // Reference the innermost .cmp-container (if available) so we get only the real accordion panel content.
    let contentElem = null;
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    if (panel) {
      let cmpContainer = panel.querySelector('.cmp-container');
      if (cmpContainer) {
        contentElem = cmpContainer;
      } else {
        // fallback: just use the panel's content
        contentElem = panel;
      }
    }
    cells.push([
      titleElem,
      contentElem
    ]);
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
