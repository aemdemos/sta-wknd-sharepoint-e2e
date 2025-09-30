/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero teaser block
  const heroTeaser = element.querySelector('.cmp-teaser--hero');
  let imageEl = null;
  let textContent = [];

  if (heroTeaser) {
    // Find image
    const imageContainer = heroTeaser.querySelector('.cmp-teaser__image .cmp-image');
    if (imageContainer) {
      imageEl = imageContainer.querySelector('img');
    }
    // Find all text content (title, subheading, CTA)
    const contentContainer = heroTeaser.querySelector('.cmp-teaser__content');
    if (contentContainer) {
      // Collect all children (headings, paragraphs, links, etc.)
      Array.from(contentContainer.children).forEach(child => {
        textContent.push(child);
      });
    }
  }

  // Table header must match block name exactly
  const headerRow = ['Hero (hero25)'];
  const imageRow = [imageEl || ''];
  // Third row: all text content in a single cell (array of elements or empty string)
  const textRow = [textContent.length ? textContent : ''];
  // Fourth row: always present, empty (for optional subheading/CTA)
  const emptyRow = [''];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    imageRow,
    textRow,
    emptyRow,
  ], document);

  element.replaceWith(table);
}
