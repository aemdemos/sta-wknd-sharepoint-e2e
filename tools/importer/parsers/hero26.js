/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find main content and image containers
  const content = element.querySelector('.cmp-teaser__content');
  const imageContainer = element.querySelector('.cmp-teaser__image');

  // Defensive: Find image element (background image)
  let imgEl = null;
  if (imageContainer) {
    imgEl = imageContainer.querySelector('img');
  }

  // Defensive: Find title, description, and CTA
  let titleEl = null;
  let descEl = null;
  let ctaEl = null;
  if (content) {
    titleEl = content.querySelector('.cmp-teaser__title');
    descEl = content.querySelector('.cmp-teaser__description');
    ctaEl = content.querySelector('.cmp-teaser__action-link');
  }

  // Compose the text/cta cell
  const textCellContent = [];
  if (titleEl) textCellContent.push(titleEl);
  if (descEl) textCellContent.push(descEl);
  if (ctaEl) textCellContent.push(ctaEl);

  // Compose table rows
  const headerRow = ['Hero (hero26)'];
  const imageRow = [imgEl ? imgEl : ''];
  const textRow = [textCellContent.length ? textCellContent : ''];

  const cells = [headerRow, imageRow, textRow];

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
