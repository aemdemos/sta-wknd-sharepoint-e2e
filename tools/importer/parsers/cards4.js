/* global WebImporter */
export default function parse(element, { document }) {
  // Find the 'All Articles' image-list block
  const imageList = element.querySelector('.image-list.list .cmp-image-list');
  if (!imageList) return;

  // Table header (as per example)
  const cells = [['Cards (cards4)']];

  // For each card (li), extract image (first cell) and full text content (second cell)
  imageList.querySelectorAll('li.cmp-image-list__item').forEach((li) => {
    // Image: reference the actual <img> element (do not clone)
    let imgEl = null;
    const imageDiv = li.querySelector('.cmp-image-list__item-image');
    if (imageDiv) {
      imgEl = imageDiv.querySelector('img');
    }

    // Text content: get title, description, and keep formatting
    const titleLink = li.querySelector('.cmp-image-list__item-title-link');
    const titleSpan = titleLink ? titleLink.querySelector('.cmp-image-list__item-title') : null;
    const description = li.querySelector('.cmp-image-list__item-description');
    const textEls = [];
    if (titleSpan) {
      // Use a <strong> element as per screenshot style
      const strong = document.createElement('strong');
      strong.textContent = titleSpan.textContent;
      textEls.push(strong);
    }
    if (description && description.textContent.trim()) {
      // Add a line break after title if description present
      if (textEls.length) {
        textEls.push(document.createElement('br'));
      }
      textEls.push(document.createTextNode(description.textContent.trim()));
    }
    cells.push([imgEl, textEls]);
  });

  // Replace element with block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
