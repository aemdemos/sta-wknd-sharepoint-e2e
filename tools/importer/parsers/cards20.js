/* global WebImporter */
export default function parse(element, { document }) {
  // Get the image list container
  const imageList = element.querySelector('.cmp-image-list');
  if (!imageList) return;

  const headerRow = ['Cards (cards20)'];
  const rows = [];

  const items = imageList.querySelectorAll(':scope > li.cmp-image-list__item');
  items.forEach((item) => {
    // First column: image element from the card
    let image = null;
    const imageLink = item.querySelector('.cmp-image-list__item-image-link');
    if (imageLink) {
      const img = imageLink.querySelector('img');
      if (img) {
        image = img;
      }
    }
    // Second column: text content with title and description
    const textContent = [];
    const title = item.querySelector('.cmp-image-list__item-title');
    const description = item.querySelector('.cmp-image-list__item-description');
    if (title) {
      const strong = document.createElement('strong');
      strong.textContent = title.textContent;
      textContent.push(strong);
      textContent.push(document.createElement('br'));
    }
    if (description) {
      textContent.push(document.createTextNode(description.textContent));
    }
    rows.push([image, textContent]);
  });

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);
  element.replaceWith(table);
}
