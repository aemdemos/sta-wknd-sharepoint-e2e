/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the accordion block within the element
  const accordion = element.querySelector('.cmp-accordion');
  if (!accordion) return;

  // Prepare the block table header
  const table = [['Accordion']];

  // Gather all accordion items (each question/answer pair)
  const items = accordion.querySelectorAll(':scope > .cmp-accordion__item');

  items.forEach((item) => {
    // Get the title (question) text
    let title = '';
    const button = item.querySelector('.cmp-accordion__button');
    if (button) {
      const span = button.querySelector('.cmp-accordion__title');
      if (span) {
        title = span.textContent.trim();
      }
    }
    // Fallback to empty string if no title
    if (!title) title = '';

    // Get the answer/content
    let content = '';
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    if (panel) {
      // Try to find the innermost .cmp-container
      const innerContainer = panel.querySelector('.cmp-container');
      if (innerContainer) {
        // Gather all non-empty children (e.g., .text blocks)
        const contentEls = Array.from(innerContainer.children).filter((c) => c.textContent.trim() !== '');
        if (contentEls.length === 1) {
          content = contentEls[0];
        } else if (contentEls.length > 1) {
          content = contentEls;
        } else {
          content = '';
        }
      } else {
        // Fallback: use panel's children
        const contentEls = Array.from(panel.children).filter((c) => c.textContent.trim() !== '');
        if (contentEls.length === 1) {
          content = contentEls[0];
        } else if (contentEls.length > 1) {
          content = contentEls;
        } else {
          content = '';
        }
      }
    }
    // Add this item as a row [title, content]
    table.push([title, content]);
  });

  // Create and replace with the accordion block table
  const block = WebImporter.DOMUtils.createTable(table, document);
  accordion.replaceWith(block);
}
