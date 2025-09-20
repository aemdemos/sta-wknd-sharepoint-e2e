/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero block container
  const heroContainer = element.querySelector('.cmp-container .teaser.cmp-teaser--hero');
  if (!heroContainer) return;

  // Find the background image element
  let imageEl = null;
  const imageWrap = heroContainer.querySelector('.cmp-teaser__image .cmp-image');
  if (imageWrap) {
    imageEl = imageWrap.querySelector('img');
  }

  // Find the headline/title element
  let titleEl = null;
  const contentWrap = heroContainer.querySelector('.cmp-teaser__content');
  if (contentWrap) {
    titleEl = contentWrap.querySelector('h1, h2, h3, h4');
  }

  // Compose table with exactly three rows: header, image, content
  const headerRow = ['Hero (hero6)'];
  const imageRow = [imageEl ? imageEl : ''];
  const contentRow = [titleEl ? titleEl : ''];

  const cells = [
    headerRow,
    imageRow,
    contentRow,
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  element.replaceWith(block);
}
