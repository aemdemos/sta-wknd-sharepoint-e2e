/* global WebImporter */
export default function parse(element, { document }) {
  // Table header must match the example
  const headerRow = ['Hero (hero40)'];

  // Extract the background image (the main block image)
  let imageEl = null;
  const imageWrapper = element.querySelector('.cmp-teaser__image');
  if (imageWrapper) {
    // Find the first <img> inside the image wrapper
    imageEl = imageWrapper.querySelector('img');
  }

  // Compose the text content: pretitle, title, description, CTA
  // We want to preserve heading and link hierarchy
  const contentWrapper = element.querySelector('.cmp-teaser__content');
  const contentFragments = [];
  if (contentWrapper) {
    // Pretitle (as paragraph)
    const pretitle = contentWrapper.querySelector('.cmp-teaser__pretitle');
    if (pretitle) {
      contentFragments.push(pretitle);
    }
    // Title (h2, but map to h1 for hero semantics)
    const title = contentWrapper.querySelector('.cmp-teaser__title');
    if (title) {
      // Use an h1 for accessibility/SEO (if needed). Otherwise, just use as is.
      // Since we're told to reference existing elements, and we want as much semantic preservation as possible, keep the heading as is.
      contentFragments.push(title);
    }
    // Description (as div)
    const desc = contentWrapper.querySelector('.cmp-teaser__description');
    if (desc) {
      contentFragments.push(desc);
    }
    // CTA (link)
    const ctaContainer = contentWrapper.querySelector('.cmp-teaser__action-container');
    if (ctaContainer) {
      // There may be multiple links, but usually only one
      const ctaLinks = ctaContainer.querySelectorAll('a');
      ctaLinks.forEach(link => contentFragments.push(link));
    }
  }

  // Compose the rows for the hero block table
  const rows = [
    headerRow,
    [imageEl ? imageEl : ''],
    [contentFragments]
  ];

  // Create the table and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
