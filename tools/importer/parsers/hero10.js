/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero teaser block
  const hero = element.querySelector('.teaser.cmp-teaser--hero, .cmp-teaser--hero');
  if (!hero) return;

  // Find the image inside the hero
  let imageEl = null;
  const imageContainer = hero.querySelector('.cmp-teaser__image [data-cmp-is="image"]');
  if (imageContainer) {
    const img = imageContainer.querySelector('img');
    if (img) imageEl = img;
  }

  // Find the heading/title inside the hero
  let headingEl = null;
  const content = hero.querySelector('.cmp-teaser__content');
  if (content) {
    headingEl = content.querySelector('h1, h2, h3, h4, h5, h6');
  }

  // Table header must match block name exactly
  const headerRow = ['Hero (hero10)'];
  // The image row (row 2)
  const imageRow = [imageEl ? imageEl : ''];
  // The content row (row 3) - must include heading, subheading, CTA if present
  const contentCell = document.createElement('div');
  if (headingEl) contentCell.appendChild(headingEl.cloneNode(true));
  // If there is a subheading or CTA, add them here (none present in this HTML)
  const contentRow = [contentCell.childNodes.length ? contentCell : ''];

  const cells = [headerRow, imageRow, contentRow];

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the hero block with the table
  hero.replaceWith(table);

  // Remove any <hr> elements that are not inside a Section Metadata table
  element.querySelectorAll('hr').forEach((hr) => {
    const table = hr.closest('table');
    let isSectionMetadata = false;
    if (table) {
      const firstCell = table.querySelector('tr:first-child td, tr:first-child th');
      if (firstCell && firstCell.textContent.trim().toLowerCase() === 'section metadata') {
        isSectionMetadata = true;
      }
    }
    if (!isSectionMetadata) hr.remove();
  });
}
