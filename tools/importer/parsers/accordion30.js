/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion element within the given element
  const accordion = element.querySelector('.cmp-accordion');
  if (!accordion) return;

  // Prepare rows for the block table, with the required header
  const rows = [['Accordion']];

  // Find all accordion items directly under the accordion root
  const items = accordion.querySelectorAll(':scope > .cmp-accordion__item');
  items.forEach((item) => {
    // Find the accordion item title
    let titleText = '';
    const button = item.querySelector('.cmp-accordion__button');
    if (button) {
      const titleSpan = button.querySelector('.cmp-accordion__title');
      if (titleSpan) {
        titleText = titleSpan.textContent.trim();
      }
    }
    // Create a <p> element for the title (no markdown)
    const titleEl = document.createElement('p');
    titleEl.textContent = titleText;

    // Find the content panel
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    let contentCell = '';
    if (panel) {
      // Find .cmp-container (direct child of .container), but fallback to panel
      let contentContainer = panel.querySelector('.cmp-container, .container');
      if (contentContainer) {
        // If just one .cmp-text child, use it directly
        const textBlock = contentContainer.querySelector('.cmp-text');
        if (textBlock && contentContainer.children.length === 1) {
          contentCell = textBlock;
        } else {
          // Otherwise, put all significant children (i.e. skip empty text)
          contentCell = Array.from(contentContainer.childNodes).filter(node => {
            return !(node.nodeType === 3 && !node.textContent.trim());
          });
        }
      } else {
        // fallback: use panel children
        contentCell = Array.from(panel.childNodes).filter(node => {
          return !(node.nodeType === 3 && !node.textContent.trim());
        });
      }
    }
    // Avoid empty content arrays
    if (Array.isArray(contentCell) && contentCell.length === 1) {
      contentCell = contentCell[0];
    }
    rows.push([titleEl, contentCell]);
  });

  // Create the accordion block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original accordion with the new block table
  accordion.replaceWith(table);
}
