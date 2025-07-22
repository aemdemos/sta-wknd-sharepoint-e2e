/* global WebImporter */
export default function parse(element, { document }) {
  // Build header row: exactly one column, exactly as in the example
  const rows = [ ['Carousel (carousel40)'] ];

  // Find the main teaser element
  const cmpTeaser = element.querySelector('.cmp-teaser');
  if (!cmpTeaser) return;

  // Get the image element (first cell)
  let imageEl = null;
  const imageContainer = cmpTeaser.querySelector('.cmp-teaser__image');
  if (imageContainer) {
    imageEl = imageContainer.querySelector('img');
  }

  // Get content (second cell)
  const content = cmpTeaser.querySelector('.cmp-teaser__content');
  const contentNodes = [];
  if (content) {
    // Order: pretitle, title, description, cta
    const pretitle = content.querySelector('.cmp-teaser__pretitle');
    if (pretitle && pretitle.textContent.trim()) contentNodes.push(pretitle);
    const title = content.querySelector('.cmp-teaser__title');
    if (title && title.textContent.trim()) contentNodes.push(title);
    const desc = content.querySelector('.cmp-teaser__description');
    if (desc && desc.textContent.trim()) contentNodes.push(desc);
    const cta = content.querySelector('.cmp-teaser__action-link');
    if (cta && cta.textContent.trim()) contentNodes.push(cta);
  }

  // Slide row: must have two columns (image, content)
  rows.push([imageEl, contentNodes]);

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
