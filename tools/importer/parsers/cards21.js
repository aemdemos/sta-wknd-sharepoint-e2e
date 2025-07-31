/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as specified in the block description
  const cells = [['Cards (cards21)']];

  // Find the image list
  const imageList = element.querySelector('ul.cmp-image-list');
  if (imageList) {
    const items = imageList.querySelectorAll(':scope > li.cmp-image-list__item');
    items.forEach((item) => {
      // First cell: image
      let imageCell = null;
      const imgLink = item.querySelector('.cmp-image-list__item-image-link');
      if (imgLink) {
        // The image is inside the link
        const img = imgLink.querySelector('img');
        if (img) {
          imageCell = img;
        } else {
          // fallback, include the link (shouldn't really happen)
          imageCell = imgLink;
        }
      }
      // Second cell: text content (title and description)
      const titleLink = item.querySelector('.cmp-image-list__item-title-link');
      const titleSpan = titleLink ? titleLink.querySelector('.cmp-image-list__item-title') : null;
      const descSpan = item.querySelector('.cmp-image-list__item-description');

      const contentFrag = document.createDocumentFragment();
      if (titleSpan) {
        const strong = document.createElement('strong');
        strong.textContent = titleSpan.textContent;
        contentFrag.appendChild(strong);
        contentFrag.appendChild(document.createElement('br'));
      }
      if (descSpan) {
        // Use the actual span from the DOM if possible, not a clone
        contentFrag.appendChild(descSpan);
      }
      cells.push([imageCell, contentFrag]);
    });
  }
  // Replace the original element with the new block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
