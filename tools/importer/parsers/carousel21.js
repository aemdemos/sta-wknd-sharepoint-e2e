/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header (exactly as in the example)
  const headerRow = ['Carousel (carousel21)'];

  // 2. Get the image for the first cell (mandatory)
  // Image is inside .cmp-teaser__image img
  let imageEl = null;
  const imageWrapper = element.querySelector('.cmp-teaser__image');
  if (imageWrapper) {
    imageEl = imageWrapper.querySelector('img');
  }

  // 3. Compose the text content for the second cell
  // This includes pretitle, title, description, CTA as in the HTML
  const contentDiv = element.querySelector('.cmp-teaser__content');
  const textContent = [];
  if (contentDiv) {
    // Add pretitle (if exists)
    const pretitle = contentDiv.querySelector('.cmp-teaser__pretitle');
    if (pretitle && pretitle.textContent.trim()) {
      textContent.push(pretitle);
    }
    // Add title (if exists)
    const title = contentDiv.querySelector('.cmp-teaser__title');
    if (title && title.textContent.trim()) {
      textContent.push(title);
    }
    // Add description (if exists)
    const desc = contentDiv.querySelector('.cmp-teaser__description');
    if (desc && desc.textContent.trim()) {
      textContent.push(desc);
    }
    // Add CTA (if exists)
    const cta = contentDiv.querySelector('.cmp-teaser__action-link');
    if (cta && cta.textContent.trim()) {
      textContent.push(cta);
    }
  }

  // 4. If all content is missing, do not create row (edge case)
  if (!imageEl && textContent.length === 0) {
    // Don't replace if nothing would be output
    return;
  }
  
  // 5. Compose the table (2 columns, 2 rows)
  const cells = [
    headerRow,
    [imageEl, textContent]
  ];

  // 6. Create the table and replace the element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
