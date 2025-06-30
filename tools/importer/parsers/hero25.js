/* global WebImporter */
export default function parse(element, { document }) {
  // Find the first .cmp-teaser--hero (Hero block)
  const teaserHero = element.querySelector('.cmp-teaser--hero');
  let imageEl = null;
  let titleEl = null;

  if (teaserHero) {
    // Find the image element inside the teaser
    const teaserImageWrapper = teaserHero.querySelector('.cmp-teaser__image .cmp-image');
    if (teaserImageWrapper) {
      imageEl = teaserImageWrapper.querySelector('img');
    }
    // Find the heading (title) element inside the teaser
    const teaserContent = teaserHero.querySelector('.cmp-teaser__content');
    if (teaserContent) {
      // Accept any heading tag as the title
      titleEl = teaserContent.querySelector('h1, h2, h3, h4, h5, h6');
    }
  }

  // Build the table cells array
  // (Always 1 column, 3 rows: header, image, text)
  const cells = [
    ['Hero (hero25)'],
    [imageEl ? imageEl : ''],
    [titleEl ? titleEl : '']
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
