/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the image list block for cards
  const cardList = element.querySelector('.image-list.list');
  if (!cardList) return;
  const ul = cardList.querySelector('ul.cmp-image-list');
  if (!ul) return;

  // Header row: Must match the example exactly
  const cells = [['Cards (cards4)']];

  // Process each card
  ul.querySelectorAll(':scope > li.cmp-image-list__item').forEach(li => {
    // --- Image (first <img> as is) ---
    let imgEl = null;
    const imgContainer = li.querySelector('.cmp-image-list__item-image');
    if (imgContainer) {
      imgEl = imgContainer.querySelector('img');
    }

    // --- Right cell: structure to match the example ---
    // We want: <strong>Title</strong>\nDescription (if present)
    // No CTA/Link as per example markdown for this block
    const rightContent = [];
    // Title (from a.cmp-image-list__item-title-link > span, or .cmp-image-list__item-title)
    const titleLink = li.querySelector('.cmp-image-list__item-title-link');
    let titleText = '';
    if (titleLink) {
      const tSpan = titleLink.querySelector('.cmp-image-list__item-title');
      titleText = tSpan ? tSpan.textContent.trim() : titleLink.textContent.trim();
    } else {
      const tSpan = li.querySelector('.cmp-image-list__item-title');
      if (tSpan) {
        titleText = tSpan.textContent.trim();
      }
    }
    if (titleText) {
      const strong = document.createElement('strong');
      strong.textContent = titleText;
      rightContent.push(strong);
    }
    // Description
    const descSpan = li.querySelector('.cmp-image-list__item-description');
    if (descSpan && descSpan.textContent.trim()) {
      rightContent.push(document.createElement('br'));
      rightContent.push(document.createTextNode(descSpan.textContent.trim()));
    }
    // Defensive: ensure at least one entry
    if (!rightContent.length) rightContent.push('');

    cells.push([imgEl, rightContent]);
  });

  // Create table and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
