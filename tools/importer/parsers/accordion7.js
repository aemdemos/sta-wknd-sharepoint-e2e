/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the accordion block within the provided element
  const accordion = Array.from(element.querySelectorAll('.accordion, .cmp-accordion')).find(el => el.classList.contains('cmp-accordion'));
  if (!accordion) return;

  // Header row as specified
  const headerRow = ['Accordion (accordion7)'];
  const rows = [headerRow];

  // Get all accordion items
  const items = accordion.querySelectorAll('.cmp-accordion__item');
  items.forEach(item => {
    // Title cell: get the text from the button title span
    const button = item.querySelector('.cmp-accordion__button .cmp-accordion__title');
    let titleText = '';
    if (button) {
      titleText = button.textContent.trim();
    } else {
      // Fallback: try to get from data-cmp-data-layer
      const dataLayer = item.getAttribute('data-cmp-data-layer');
      if (dataLayer) {
        try {
          const dlObj = JSON.parse(dataLayer.replace(/&quot;/g, '"'));
          const key = Object.keys(dlObj)[0];
          titleText = dlObj[key]?.['dc:title'] || '';
        } catch (e) {
          titleText = '';
        }
      }
    }
    // Defensive: always create a strong element for the title
    const titleEl = document.createElement('strong');
    titleEl.textContent = titleText;

    // Content cell: get the panel content
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    let contentEls = [];
    if (panel) {
      // Find all direct children with actual content
      // Defensive: flatten nested containers
      let contentContainer = panel;
      // If there's a .cmp-container inside, use its children
      const cmpContainer = panel.querySelector('.cmp-container');
      if (cmpContainer) {
        contentContainer = cmpContainer;
      }
      // Find all .text blocks inside
      const textBlocks = contentContainer.querySelectorAll('.cmp-text');
      if (textBlocks.length > 0) {
        contentEls = Array.from(textBlocks);
      } else {
        // Fallback: use all children
        contentEls = Array.from(contentContainer.children);
      }
    }
    // Defensive: if no content, use empty string
    if (contentEls.length === 0) contentEls = [''];

    rows.push([titleEl, contentEls]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original accordion element with the block table
  accordion.replaceWith(block);
}
