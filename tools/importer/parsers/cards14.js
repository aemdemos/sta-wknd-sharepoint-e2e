/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row exactly as required
  const headerRow = ['Cards (cards14)'];
  const cells = [headerRow];

  // 2. Find all card items
  const list = element.querySelector('ul.cmp-image-list');
  if (list) {
    const items = list.querySelectorAll('li.cmp-image-list__item');
    items.forEach((item) => {
      // Find image (first cell)
      let img = null;
      const imgContainer = item.querySelector('.cmp-image-list__item-image');
      if (imgContainer) {
        img = imgContainer.querySelector('img');
      }

      // Compose text cell (second cell)
      const textCell = document.createElement('div');
      // Title: always bold (as in markdown, so use <strong>)
      let title = '';
      const titleLink = item.querySelector('.cmp-image-list__item-title-link');
      if (titleLink) {
        const titleSpan = titleLink.querySelector('.cmp-image-list__item-title');
        if (titleSpan && titleSpan.textContent.trim()) {
          title = titleSpan.textContent.trim();
          const strong = document.createElement('strong');
          strong.textContent = title;
          textCell.appendChild(strong);
        }
      }
      // Description (if any)
      const descSpan = item.querySelector('.cmp-image-list__item-description');
      if (descSpan && descSpan.textContent.trim()) {
        // add line break if there was a title
        if (title) textCell.appendChild(document.createElement('br'));
        // Use a plain span for description
        const desc = document.createElement('span');
        desc.textContent = descSpan.textContent.trim();
        textCell.appendChild(desc);
      }
      // No call-to-action in this HTML (all links are to title and image)

      // 3. Reference source image and text cell (do not clone)
      cells.push([img, textCell]);
    });
  }

  // 4. Create and replace table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
