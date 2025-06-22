/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the hero teaser block
  // Try to get the most specific hero teaser (with cmp-teaser--hero first)
  let heroTeaser = element.querySelector('.cmp-teaser--hero');
  if (!heroTeaser) {
    // fallback just in case structure is different
    heroTeaser = element.querySelector('.cmp-teaser');
  }

  // 2. Extract the image element (if it exists)
  let imageEl = '';
  if (heroTeaser) {
    const teaserImage = heroTeaser.querySelector('.cmp-teaser__image img');
    if (teaserImage) {
      imageEl = teaserImage;
    }
  }

  // 3. Extract the text content (title, subheading, etc)
  let contentRows = '';
  if (heroTeaser) {
    const content = heroTeaser.querySelector('.cmp-teaser__content');
    if (content) {
      // All children (e.g. headings, subheading, paragraph, etc)
      const children = Array.from(content.children);
      if (children.length > 0) {
        contentRows = children;
      } else {
        contentRows = '';
      }
    }
  }

  // 4. Build the table. Header row must be exactly 'Hero' (no markdown)
  // Table is always 1 column, 3 rows, first row 'Hero',
  // second row: image (or empty string), third row: content (or empty string)
  const cells = [
    ['Hero'],
    [imageEl],
    [contentRows],
  ];
  const heroBlock = WebImporter.DOMUtils.createTable(cells, document);

  // 5. Replace the block
  element.replaceWith(heroBlock);
}
