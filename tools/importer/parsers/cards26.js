/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards26)'];
  const rows = [headerRow];

  // Find all list items that are cards
  const items = element.querySelectorAll('ul.cmp-image-list > li.cmp-image-list__item');
  items.forEach((item) => {
    // First cell: image (reference the image component div if present)
    let imageCell = null;
    const imgEl = item.querySelector('img');
    if (imgEl) {
      // Prefer to use the outer image wrapper for robustness
      const imageWrapper = imgEl.closest('div[data-cmp-is="image"]');
      imageCell = imageWrapper || imgEl;
    }

    // Second cell: text content (title, optional link, description)
    const textContent = [];
    // Title (may be linked)
    const titleLink = item.querySelector('a.cmp-image-list__item-title-link');
    if (titleLink) {
      const spanTitle = titleLink.querySelector('.cmp-image-list__item-title');
      if (spanTitle) {
        // Use <strong> for heading style, preserve link if present
        const strong = document.createElement('strong');
        strong.textContent = spanTitle.textContent;
        if (titleLink.href && titleLink.href !== '#') {
          const a = document.createElement('a');
          a.href = titleLink.href;
          a.appendChild(strong);
          textContent.push(a);
        } else {
          textContent.push(strong);
        }
      }
    }
    // Description
    const desc = item.querySelector('.cmp-image-list__item-description');
    if (desc) {
      // Insert a <br> if there's also a title
      if (textContent.length > 0) {
        textContent.push(document.createElement('br'));
      }
      textContent.push(desc);
    }

    // If nothing found for text, add empty string for resilience
    if (textContent.length === 0) textContent.push('');
    // If no image, add empty string for resilience
    if (!imageCell) imageCell = '';
    rows.push([imageCell, textContent.length === 1 ? textContent[0] : textContent]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
