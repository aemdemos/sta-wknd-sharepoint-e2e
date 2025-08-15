/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-teaser block within the element
  const teaser = element.querySelector('.cmp-teaser');

  let imgEl = null;
  let titleEl = null;

  if (teaser) {
    // Get image (if present)
    const imgContainer = teaser.querySelector('.cmp-teaser__image');
    if (imgContainer) {
      imgEl = imgContainer.querySelector('img');
    }
    // Get heading/title (if present)
    const contentContainer = teaser.querySelector('.cmp-teaser__content');
    if (contentContainer) {
      // Include the full heading node (not just innerText)
      titleEl = contentContainer.querySelector('h1, h2, h3, h4, h5, h6');
    }
  }

  // Compose the table rows according to the example: header, image, content
  const headerRow = ['Hero (hero11)'];
  const imageRow = [imgEl ? imgEl : ''];
  const contentRow = [titleEl ? titleEl : ''];

  const cells = [headerRow, imageRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
