/* global WebImporter */
export default function parse(element, { document }) {
  // Header must match exactly as in the component description
  const headerRow = ['Cards (cards27)'];
  const cells = [headerRow];

  // Defensive: Find the <ul> in the structure
  const ul = element.querySelector('ul.cmp-image-list');
  if (ul) {
    // Get all top-level <li> direct children
    const items = ul.querySelectorAll(':scope > li.cmp-image-list__item');
    items.forEach((li) => {
      // Get the image element (must be the <img> in the image link)
      const imageLink = li.querySelector('.cmp-image-list__item-image-link');
      let imgEl = null;
      if (imageLink) {
        imgEl = imageLink.querySelector('img');
      }

      // Compose the text cell, prioritizing existing elements
      const textCell = [];
      // Get title
      const titleLink = li.querySelector('.cmp-image-list__item-title-link');
      let titleText = '';
      if (titleLink) {
        const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
        if (titleSpan) titleText = titleSpan.textContent.trim();
      }
      if (titleText) {
        // Strong for the visual heading, link if present
        const strong = document.createElement('strong');
        strong.textContent = titleText;
        if (titleLink && titleLink.getAttribute('href')) {
          const a = document.createElement('a');
          a.href = titleLink.getAttribute('href');
          a.appendChild(strong);
          textCell.push(a);
        } else {
          textCell.push(strong);
        }
      }
      // Description
      const descriptionEl = li.querySelector('.cmp-image-list__item-description');
      if (descriptionEl && descriptionEl.textContent.trim()) {
        // Add line break only if title exists
        if (textCell.length > 0) {
          textCell.push(document.createElement('br'));
        }
        textCell.push(descriptionEl);
      }

      // Add row only if at least an image and some text content exists
      if (imgEl || textCell.length > 0) {
        cells.push([
          imgEl,
          textCell
        ]);
      }
    });
  }

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
