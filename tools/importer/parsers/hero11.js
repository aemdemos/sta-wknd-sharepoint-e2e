/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the hero block (teaser cmp-teaser--hero)
  let heroTeaser = element.querySelector('.teaser.cmp-teaser--hero');
  if (!heroTeaser) {
    // Fallback: look for .cmp-teaser inside any container
    const containers = element.querySelectorAll('.cmp-container');
    for (const container of containers) {
      const teaser = container.querySelector('.teaser.cmp-teaser--hero');
      if (teaser) {
        heroTeaser = teaser;
        break;
      }
    }
  }
  if (!heroTeaser) return;

  // 2. Get the background image as a reference to the image block/div
  let imageBlock = heroTeaser.querySelector('.cmp-teaser__image .cmp-image');
  // If no .cmp-image div, fallback to first image inside .cmp-teaser__image
  if (!imageBlock) {
    const imageDiv = heroTeaser.querySelector('.cmp-teaser__image');
    if (imageDiv) {
      imageBlock = imageDiv.querySelector('img');
    }
  }

  // 3. Get the headline/title text, prefer heading elements
  let contentBlock = heroTeaser.querySelector('.cmp-teaser__content');
  let headline = null;
  if (contentBlock) {
    headline = contentBlock.querySelector('h1, h2, h3, h4, h5, h6');
  }

  // 4. Build table rows
  // Header row (must match example exactly)
  const headerRow = ['Hero (hero11)'];
  // Second row: image (background)
  const imageRow = imageBlock ? [imageBlock] : [''];
  // Third row: headline
  const headlineRow = headline ? [headline] : [''];

  // 5. Compose only rows for which content exists (except header, always present)
  const rows = [headerRow];
  // Always add imageRow (background image is always present in example)
  rows.push(imageRow);
  // Only add headline if present (optional)
  if (headlineRow[0] !== '') {
    rows.push(headlineRow);
  }

  // 6. Create and replace table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
