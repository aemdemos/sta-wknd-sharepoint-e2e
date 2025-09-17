/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the accordion block within the element
  const accordion = element.querySelector('.accordion .cmp-accordion');
  if (!accordion) return;

  // Table header row
  const headerRow = ['Accordion (accordion7)'];
  const rows = [headerRow];

  // Select all accordion items
  const items = accordion.querySelectorAll('.cmp-accordion__item');

  items.forEach((item) => {
    // Title cell: find the button with the title span
    let titleText = '';
    const button = item.querySelector('.cmp-accordion__button');
    if (button) {
      const titleSpan = button.querySelector('.cmp-accordion__title');
      if (titleSpan) {
        titleText = titleSpan.textContent.trim();
      }
    }
    // Defensive fallback
    if (!titleText) {
      titleText = 'Accordion Item';
    }
    // Create a <strong> for the title (matches visual style)
    const titleEl = document.createElement('strong');
    titleEl.textContent = titleText;

    // Content cell: find the panel and grab all its children
    const panel = item.querySelector('.cmp-accordion__panel');
    let contentEls = [];
    if (panel) {
      // Defensive: find the inner container, then all direct children
      // Panel may contain a responsivegrid/container/text
      const innerContainer = panel.querySelector('.cmp-container') || panel;
      // Grab all direct children of innerContainer
      const children = Array.from(innerContainer.children);
      // For each child, if it contains a .cmp-text, use that
      children.forEach((child) => {
        const text = child.querySelector('.cmp-text');
        if (text) {
          contentEls.push(text);
        } else {
          // If not, just push the child itself
          contentEls.push(child);
        }
      });
      // Defensive: flatten
      contentEls = contentEls.flat();
    }
    // Defensive: if no content found, use an empty string
    if (!contentEls.length) contentEls = [''];

    // Add row: [title, content]
    rows.push([titleEl, contentEls]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original accordion element with the block table
  accordion.replaceWith(table);
}
