/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero teaser block
  let heroTeaser = element.querySelector('.cmp-teaser--hero .cmp-teaser');

  // Prepare cells for the table
  const cells = [];

  // Header row
  cells.push(['Hero (hero6)']);

  // 2nd row: Background Image (optional)
  let bgImg = '';
  if (heroTeaser) {
    const imageDiv = heroTeaser.querySelector('.cmp-teaser__image .cmp-image');
    if (imageDiv) {
      const img = imageDiv.querySelector('img');
      if (img) {
        bgImg = img;
      }
    }
  }
  cells.push([bgImg ? bgImg : '']);

  // 3rd row: Title, Subheading, Call-to-Action, etc.
  let heroContent = '';
  if (heroTeaser) {
    const contentDiv = heroTeaser.querySelector('.cmp-teaser__content');
    if (contentDiv) {
      heroContent = contentDiv;
    }
  }
  cells.push([heroContent ? heroContent : '']);

  // Create and insert the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
