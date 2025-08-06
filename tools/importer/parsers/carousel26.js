/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to safely extract a child element with a selector, returns null if not found
  function safeQuery(parent, selector) {
    return parent ? parent.querySelector(selector) : null;
  }

  // Header row for the Carousel block
  const cells = [['Carousel (carousel26)']];

  // Find the teaser image (first cell in row)
  let img = null;
  const teaserImage = element.querySelector('.cmp-teaser__image');
  if (teaserImage) {
    img = teaserImage.querySelector('img');
  }

  // Find the teaser content: title, description, CTA link (second cell)
  const contentContainer = element.querySelector('.cmp-teaser__content');
  const slideContent = [];
  const title = safeQuery(contentContainer, '.cmp-teaser__title');
  if (title) slideContent.push(title);
  const desc = safeQuery(contentContainer, '.cmp-teaser__description');
  if (desc) slideContent.push(desc);
  // The action container may exist, but the link is what we want
  const actionLink = safeQuery(contentContainer, '.cmp-teaser__action-link');
  if (actionLink) slideContent.push(actionLink);

  // Only add the row if there is at least an image
  if (img) {
    cells.push([
      img, // image only in first column
      slideContent // second column: can contain title, desc, CTA
    ]);
  }

  // Create and replace block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
