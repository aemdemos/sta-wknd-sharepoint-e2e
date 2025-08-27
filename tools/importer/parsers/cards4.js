/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row - must match example exactly
  const headerRow = ['Cards (cards4)'];
  const cells = [headerRow];

  // Locate the image-list block containing the cards
  const imageList = element.querySelector('.image-list.list ul.cmp-image-list');
  if (imageList) {
    const items = imageList.querySelectorAll(':scope > li');
    items.forEach((li) => {
      // First column: image (reference the <img> if exists)
      const img = li.querySelector('img');
      
      // Second column: card text content block
      // - Title (bold/heading)
      // - Description (paragraph)
      // - CTA (link), if present
      const textParts = [];
      
      // Title: Prefer the .cmp-image-list__item-title inside the link
      const titleLink = li.querySelector('a.cmp-image-list__item-title-link');
      const titleSpan = titleLink ? titleLink.querySelector('.cmp-image-list__item-title') : li.querySelector('.cmp-image-list__item-title');
      if (titleSpan && titleSpan.textContent.trim()) {
        const strong = document.createElement('strong');
        strong.textContent = titleSpan.textContent.trim();
        textParts.push(strong);
      }
      // Description: .cmp-image-list__item-description
      const desc = li.querySelector('.cmp-image-list__item-description');
      if (desc && desc.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = desc.textContent.trim();
        textParts.push(p);
      }
      // CTA: Use the title link if present; only add if it does not duplicate the main title text or is obviously a CTA
      // In this layout, usually there is no extra CTA, so skip unless structure changes in the future.
      const textCell = textParts;
      cells.push([img, textCell]);
    });
  }

  // Replace the original element with the table block
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
