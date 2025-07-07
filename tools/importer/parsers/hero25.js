/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-container that has the hero teaser
  const heroContainer = element.querySelector('.cmp-container');
  if (!heroContainer) return;

  // Find the teaser (hero) block and its sub-components
  const teaser = heroContainer.querySelector('.cmp-teaser');
  if (!teaser) return;

  // Get the background image: .cmp-image inside .cmp-teaser__image
  let heroImg = null;
  const imageWrapper = teaser.querySelector('.cmp-teaser__image .cmp-image');
  if (imageWrapper) {
    heroImg = imageWrapper.querySelector('img');
  }

  // Get the title (headline)
  const title = teaser.querySelector('.cmp-teaser__title');

  // Prepare the cells for the table
  const rows = [];
  // Header row, as in example
  rows.push(['Hero (hero25)']);
  // Image row
  rows.push([heroImg ? heroImg : '']);
  // Content row - just the heading in this case
  const content = [];
  if (title) content.push(title);
  rows.push([content]);

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the heroContainer with the table
  heroContainer.replaceWith(table);
}
