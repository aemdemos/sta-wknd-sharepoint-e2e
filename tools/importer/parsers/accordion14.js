/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion block
  const accordionEl = element.querySelector('.accordion .cmp-accordion');
  if (!accordionEl) return;
  
  // Build table header
  const rows = [['Accordion']];

  // Loop over all accordion items
  const items = accordionEl.querySelectorAll('.cmp-accordion__item');
  items.forEach((item) => {
    // Get title span from button
    const titleBtn = item.querySelector('.cmp-accordion__button');
    let titleCell = '';
    if (titleBtn) {
      const titleSpan = titleBtn.querySelector('.cmp-accordion__title');
      if (titleSpan) {
        // Use the original element by moving it temporarily out of the button
        // Instead of cloning, move it and replace after use
        // But moving out could affect the DOM, so safer to reference the text content inside a <p> or similar element
        // But the example expects to preserve formatting (bold/italic, links, etc), so let's just use the span as is
        titleCell = titleSpan;
      }
    }

    // Get content cell: the .cmp-accordion__panel, typically contains .cmp-text(s), may have other content
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    let contentCell = '';
    if (panel) {
      // Find all cmp-texts (usually a single one)
      const cmpTexts = panel.querySelectorAll('.cmp-text');
      if (cmpTexts.length > 0) {
        // If multiple, include all contents in one cell as array
        contentCell = Array.from(cmpTexts).map((cmpText) => {
          // If there's only one block element inside cmpText, use that (usually <p>), else use cmpText
          if (cmpText.children.length === 1) {
            return cmpText.children[0];
          }
          return cmpText;
        });
        // If only one, pass it as element, not array
        if (contentCell.length === 1) contentCell = contentCell[0];
      } else {
        // Otherwise, use all non-empty elements from the panel
        contentCell = Array.from(panel.childNodes)
          .filter(node => (node.nodeType === 1 && node.textContent.trim()) || (node.nodeType === 3 && node.textContent.trim()));
        if (contentCell.length === 1) contentCell = contentCell[0];
      }
    }
    rows.push([titleCell, contentCell]);
  });

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
