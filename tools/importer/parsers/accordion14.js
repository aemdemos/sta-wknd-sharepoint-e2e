/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main accordion container
  const accordion = element.querySelector('.accordion .cmp-accordion');
  if (!accordion) return;

  // Block header row (must be exactly one column)
  const rows = [];
  rows.push(['Accordion (accordion14)', '']); // two columns, but second is empty

  // Get all accordion items
  const items = accordion.querySelectorAll(':scope > .cmp-accordion__item');

  items.forEach((item) => {
    // Title cell: get the text from the button's span.cmp-accordion__title
    const button = item.querySelector('.cmp-accordion__button .cmp-accordion__title');
    let title = '';
    if (button) {
      title = button.textContent.trim();
    }

    // Content cell: get the panel content (should only include the actual content, not wrappers)
    const panel = item.querySelector('.cmp-accordion__panel');
    let content = '';
    if (panel) {
      // Find the first .cmp-text inside the panel (which contains the actual FAQ answer)
      const textBlock = panel.querySelector('.cmp-text');
      if (textBlock) {
        // Use the children of .cmp-text (usually <p>, <h3>, etc.) as the content cell
        const frag = document.createDocumentFragment();
        Array.from(textBlock.childNodes).forEach((node) => {
          // Remove empty <h3> (e.g. <h3>&nbsp;</h3>)
          if (
            node.nodeType === Node.ELEMENT_NODE &&
            node.tagName === 'H3' &&
            node.textContent.replace(/\u00a0|\s/g, '') === ''
          ) {
            return;
          }
          frag.appendChild(node.cloneNode(true));
        });
        content = frag;
      } else {
        // Fallback: use the panel's text content
        content = panel.textContent.trim();
      }
    }

    // Defensive: if title or content is missing, skip
    if (!title || !content) return;
    rows.push([title, content]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
