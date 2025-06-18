/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main accordion block
  const accordion = element.querySelector('.cmp-accordion');
  if (!accordion) return;

  // Get all accordion items
  const items = accordion.querySelectorAll('.cmp-accordion__item');

  const cells = [];
  // Header - must match example exactly
  cells.push(['Accordion (accordion7)']);

  items.forEach(item => {
    // Title: The clickable button's text, prefer the button's span (not just text)
    let titleElem = item.querySelector('.cmp-accordion__button .cmp-accordion__title');
    if (!titleElem) {
      // fallback: try to find the button text
      const button = item.querySelector('.cmp-accordion__button');
      if (button) {
        titleElem = button;
      } else {
        titleElem = document.createTextNode(''); // If missing, blank
      }
    }

    // Body: The content shown when this accordion row is open
    // The structure is .cmp-accordion__panel > .container > .cmp-container > .text (or other content)
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    let content;
    if (panel) {
      // Try to find the most semantically meaningful child
      // Usually want everything inside the first .cmp-container in the panel
      const cmpContainer = panel.querySelector('.cmp-container');
      if (cmpContainer) {
        // If .cmp-container exists, include its children (not .cmp-container itself)
        const frag = document.createDocumentFragment();
        Array.from(cmpContainer.children).forEach(child => {
          frag.appendChild(child);
        });
        content = frag.childNodes.length > 1 ? Array.from(frag.childNodes) : frag.childNodes[0] || document.createTextNode('');
      } else {
        // fallback: use all children of panel
        const frag = document.createDocumentFragment();
        Array.from(panel.childNodes).forEach(child => {
          frag.appendChild(child);
        });
        content = frag.childNodes.length > 1 ? Array.from(frag.childNodes) : frag.childNodes[0] || document.createTextNode('');
      }
    } else {
      content = document.createTextNode('');
    }

    cells.push([titleElem, content]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.parentNode.replaceChild(table, element);
}
