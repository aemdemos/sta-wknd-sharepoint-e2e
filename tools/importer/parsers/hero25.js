/* global WebImporter */
export default function parse(element, { document }) {
  // Get the hero teaser block
  const heroTeaser = element.querySelector('.cmp-teaser--hero, .teaser.cmp-teaser--hero');

  // Find the image (background image)
  let imageEl = null;
  if (heroTeaser) {
    const teaserImage = heroTeaser.querySelector('.cmp-teaser__image');
    if (teaserImage) {
      imageEl = teaserImage.querySelector('img');
    }
  }

  // Find the headline/title (opt for highest-level heading, or .cmp-teaser__title)
  let titleEl = null;
  if (heroTeaser) {
    const content = heroTeaser.querySelector('.cmp-teaser__content');
    if (content) {
      // Prefer h1, then h2, then .cmp-teaser__title
      titleEl = content.querySelector('h1, h2, h3, .cmp-teaser__title');
    }
  }

  const cells = [
    ['Hero (hero25)'], // Must match example header row exactly
    [imageEl ? imageEl : ''],
    [titleEl ? titleEl : ''],
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
