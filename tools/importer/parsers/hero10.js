/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero teaser
  const heroTeaser = element.querySelector('.cmp-teaser--hero') || element.querySelector('.cmp-teaser');
  let imgEl = '';
  let titleEl = '';

  if (heroTeaser) {
    // Get the image element - we must cloneNode so we don't move elements from original DOM
    const imgContainer = heroTeaser.querySelector('.cmp-teaser__image');
    if (imgContainer) {
      const foundImg = imgContainer.querySelector('img');
      if (foundImg) {
        imgEl = foundImg;
      }
    }
    // Get the heading element
    const content = heroTeaser.querySelector('.cmp-teaser__content');
    if (content) {
      const foundTitle = content.querySelector('h1, h2, h3');
      if (foundTitle) {
        titleEl = foundTitle;
      }
    }
  }

  // If not found, use '' to ensure proper cells
  const cells = [
    ['Hero'],
    [imgEl || ''],
    [titleEl || '']
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
