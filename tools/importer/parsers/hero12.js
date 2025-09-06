/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero teaser block
  const heroTeaser = element.querySelector('.teaser.cmp-teaser--hero');
  if (!heroTeaser) return;

  // Find the image element inside the hero teaser
  const imageWrapper = heroTeaser.querySelector('.cmp-teaser__image .cmp-image');
  let imageEl = null;
  if (imageWrapper) {
    imageEl = imageWrapper.querySelector('img');
  }

  // Find the heading/title inside the hero teaser
  const content = heroTeaser.querySelector('.cmp-teaser__content');
  let headingEl = null;
  if (content) {
    headingEl = content.querySelector('.cmp-teaser__title, h1, h2, h3, h4, h5, h6');
  }

  // Table header row
  const headerRow = ['Hero (hero12)'];

  // Second row: image (background image)
  const imageRow = [imageEl ? imageEl : ''];

  // Third row: title, subheading, call-to-action (all in one cell)
  const textCell = [];
  if (headingEl) textCell.push(headingEl);
  // If there were subheading or CTA, they would be added here
  const thirdRow = [textCell.length ? textCell : ''];

  // Compose table cells: header, image, third row (title/subheading/cta)
  const cells = [
    headerRow,
    imageRow,
    thirdRow,
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block
  element.replaceWith(block);
}
