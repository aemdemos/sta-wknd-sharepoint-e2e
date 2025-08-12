/* global WebImporter */
export default function parse(element, { document }) {
  // Find the first cmp-teaser--hero block (the hero section)
  const heroTeaser = element.querySelector('.cmp-teaser--hero, .teaser.cmp-teaser--hero');
  if (!heroTeaser) return;

  // Get the background image (optional)
  let imgEl = null;
  const imageContainer = heroTeaser.querySelector('.cmp-teaser__image');
  if (imageContainer) {
    imgEl = imageContainer.querySelector('img');
  }

  // Get the title (optional)
  let titleEl = null;
  const teaserContent = heroTeaser.querySelector('.cmp-teaser__content');
  if (teaserContent) {
    titleEl = teaserContent.querySelector('.cmp-teaser__title');
  }

  // Compose text cell contents (can be multiple items, but here only title exists)
  const textCell = [];
  if (titleEl) textCell.push(titleEl);

  // Table rows
  const rows = [];
  rows.push(['Hero (hero11)']); // Header row exactly as required
  rows.push([imgEl ? imgEl : '']); // Image row, empty string if missing
  rows.push([textCell.length ? textCell : '']); // Text row, empty string if missing

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
