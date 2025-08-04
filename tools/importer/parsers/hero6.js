/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the hero teaser block with image and heading
  const heroTeaser = element.querySelector('.teaser.cmp-teaser--hero, .cmp-teaser--hero');

  // 2. Get background image (optional)
  let backgroundImg = '';
  if (heroTeaser) {
    const cmpImage = heroTeaser.querySelector('.cmp-teaser__image img');
    if (cmpImage) {
      backgroundImg = cmpImage;
    }
  }

  // 3. Get heading/title (optional), subheading (not present in this HTML), CTA (not present)
  let contentEls = [];
  if (heroTeaser) {
    const teaserContent = heroTeaser.querySelector('.cmp-teaser__content');
    if (teaserContent) {
      // Only the h2 title exists in this sample
      const title = teaserContent.querySelector('h2, h1, h3, h4, h5, h6');
      if (title) contentEls.push(title);
    }
  }

  // 4. Compose the rows
  const cells = [
    ['Hero (hero6)'],
    [backgroundImg || ''],
    [contentEls.length ? contentEls : ''],
  ];

  // 5. Create the table and replace original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
