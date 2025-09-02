/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion block in the provided element
  const accordion = element.querySelector('.accordion .cmp-accordion');
  if (!accordion) return;

  // Table header: must match markdown example exactly
  const headerRow = ['Accordion (accordion15)'];
  const rows = [headerRow];

  // Get all accordion items
  const items = accordion.querySelectorAll('.cmp-accordion__item');
  items.forEach(item => {
    // Title: get the label, keep HTML structure, reference original span if possible
    const titleSpan = item.querySelector('.cmp-accordion__title');
    let titleContent = '';
    if (titleSpan) {
      // Reference the span's parent (the button contains the span and icon)
      // But to keep to the example, only reference the span.
      titleContent = titleSpan;
    }
    // Content: get the main content for the accordion panel
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    let contentContent = '';
    if (panel) {
      // Look for .cmp-text elements inside the panel, prioritizing referenced elements
      let textBlocks = Array.from(panel.querySelectorAll('.cmp-text'));
      if (textBlocks.length > 0) {
        // If there's only one, use as element; if multiple, array
        contentContent = textBlocks.length === 1 ? textBlocks[0] : textBlocks;
      } else {
        // If not, reference the panel itself (the whole block)
        contentContent = panel;
      }
    }
    rows.push([titleContent, contentContent]);
  });

  // Create and replace with the accordion block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  accordion.parentNode.replaceChild(block, accordion);
}
