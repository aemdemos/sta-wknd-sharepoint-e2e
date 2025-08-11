/* global WebImporter */
export default function parse(element, { document }) {
  // Block Name Header EXACTLY matching example
  const headerRow = ['Carousel (carousel27)'];

  // Extract image from teaser block
  const imgEl = element.querySelector('.cmp-image__image');

  // Compose text content for the second cell
  const contentCell = [];
  // Title: styled heading (use as-is, retain h2)
  const titleEl = element.querySelector('.cmp-teaser__title');
  if (titleEl) {
    contentCell.push(titleEl);
  }
  // Description: plain div (add after title)
  const descEl = element.querySelector('.cmp-teaser__description');
  if (descEl) {
    contentCell.push(descEl);
  }
  // CTA link: at bottom
  const ctaEl = element.querySelector('.cmp-teaser__action-link');
  if (ctaEl) {
    contentCell.push(ctaEl);
  }

  // Edge case: if NO img found, use empty cell
  const imgCell = (imgEl) ? imgEl : '';
  // Edge case: if contentCell is empty, use empty cell
  const textCell = (contentCell.length > 0) ? contentCell : '';

  // Table rows: header, and one slide row (image + text)
  const cells = [headerRow, [imgCell, textCell]];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original block element with this table
  element.replaceWith(block);
}
