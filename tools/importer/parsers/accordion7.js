/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion block root element (div with class 'accordion panelcontainer')
  const accordion = element.querySelector('.accordion.panelcontainer');
  if (!accordion) return;

  // Get the accordion component inside
  const cmpAccordion = accordion.querySelector('.cmp-accordion');
  if (!cmpAccordion) return;

  // Gather all accordion items
  const items = cmpAccordion.querySelectorAll(':scope > .cmp-accordion__item');
  if (!items.length) return;

  const rows = [];
  // Header row
  rows.push(['Accordion (accordion7)']);

  items.forEach(item => {
    // Title: span.cmp-accordion__title inside the button
    let titleElem = item.querySelector('.cmp-accordion__button .cmp-accordion__title');
    if (!titleElem) {
      // fallback: use the button itself or heading
      titleElem = item.querySelector('.cmp-accordion__button') || item.querySelector('h3') || document.createTextNode('');
    }

    // Content: panel with data-cmp-hook-accordion="panel"
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    let contentCell;
    if (panel) {
      // Take all children except comments, script, style
      const contentNodes = Array.from(panel.childNodes).filter(n => {
        return n.nodeType !== Node.COMMENT_NODE &&
          (n.nodeType !== Node.ELEMENT_NODE || (n.tagName !== 'SCRIPT' && n.tagName !== 'STYLE'));
      });
      if (contentNodes.length === 1) {
        contentCell = contentNodes[0];
      } else if (contentNodes.length > 1) {
        contentCell = contentNodes;
      } else {
        contentCell = document.createTextNode('');
      }
    } else {
      contentCell = document.createTextNode('');
    }

    // Add row: [title cell, content cell]
    rows.push([titleElem, contentCell]);
  });

  // Build the accordion table and replace the original element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.parentNode.replaceChild(block, element);
}
