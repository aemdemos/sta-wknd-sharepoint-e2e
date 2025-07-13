/* global WebImporter */
export default function parse(element, { document }) {
  // Get the hero/teaser container
  const teaser = element.querySelector('.cmp-teaser');

  let imageEl = null;
  let titleEl = null;

  if (teaser) {
    // Get the image element (if exists)
    const imageContainer = teaser.querySelector('.cmp-teaser__image');
    if (imageContainer) {
      const img = imageContainer.querySelector('img');
      if (img) {
        imageEl = img;
      }
    }
    // Get the title element (prefer h1, h2, h3, but fallback to .cmp-teaser__title)
    const contentContainer = teaser.querySelector('.cmp-teaser__content');
    if (contentContainer) {
      let heading = contentContainer.querySelector('h1, h2, h3');
      if (!heading) {
        heading = contentContainer.querySelector('.cmp-teaser__title');
      }
      if (heading) {
        titleEl = heading;
      }
    }
  }

  // Compose the table rows as per the requirements
  const headerRow = ['Hero (hero25)'];
  const bgImgRow = [imageEl ? imageEl : ''];
  const contentRow = [titleEl ? titleEl : ''];

  const cells = [headerRow, bgImgRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
