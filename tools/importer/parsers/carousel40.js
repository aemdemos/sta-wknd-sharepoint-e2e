/* global WebImporter */
export default function parse(element, { document }) {
  // Carousel (carousel40) block
  // 1. Header row
  const headerRow = ['Carousel (carousel40)'];

  // 2. Find the teaser slide content
  // Defensive selectors for image and content
  let imageEl = null;
  let contentEls = [];

  // Find image: look for an <img> inside .cmp-teaser__image or .cmp-image
  const imageContainer = element.querySelector('.cmp-teaser__image') || element.querySelector('.cmp-image');
  if (imageContainer) {
    imageEl = imageContainer.querySelector('img');
  } else {
    // fallback: first img in block
    imageEl = element.querySelector('img');
  }

  // Find text content: pretitle, title, description, CTA
  const contentContainer = element.querySelector('.cmp-teaser__content') || element;

  // Pretitle
  const pretitle = contentContainer.querySelector('.cmp-teaser__pretitle');
  if (pretitle) contentEls.push(pretitle);

  // Title (h2 or h3)
  const title = contentContainer.querySelector('h2, .cmp-teaser__title');
  if (title) contentEls.push(title);

  // Description
  const desc = contentContainer.querySelector('.cmp-teaser__description');
  if (desc) contentEls.push(desc);

  // CTA (link or button)
  const cta = contentContainer.querySelector('.cmp-teaser__action-link, .cmp-teaser__action-container a, .cmp-teaser__action-container button');
  if (cta) contentEls.push(cta);

  // Compose the slide row: [image, [content elements]]
  const slideRow = [imageEl, contentEls];

  // Build table
  const cells = [headerRow, slideRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace element with block table
  element.replaceWith(table);
}
