/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the main content and image containers
  const teaserContent = Array.from(element.querySelectorAll(':scope > .cmp-teaser'))[0];
  if (!teaserContent) return;

  // Find image block (background image)
  const imageWrapper = teaserContent.querySelector('.cmp-teaser__image');
  let imageEl = null;
  if (imageWrapper) {
    // Find the actual <img> element
    imageEl = imageWrapper.querySelector('img');
  }

  // Find text content (title, description)
  const contentWrapper = teaserContent.querySelector('.cmp-teaser__content');
  let textEls = [];
  if (contentWrapper) {
    // Title (h2)
    const titleEl = contentWrapper.querySelector('.cmp-teaser__title');
    if (titleEl) textEls.push(titleEl);
    // Description (div > p)
    const descEl = contentWrapper.querySelector('.cmp-teaser__description');
    if (descEl) {
      // If description contains paragraphs, add them individually
      const ps = descEl.querySelectorAll('p');
      if (ps.length) {
        ps.forEach(p => textEls.push(p));
      } else {
        textEls.push(descEl);
      }
    }
  }

  // Build the table rows
  const headerRow = ['Hero (hero39)'];
  const imageRow = [imageEl ? imageEl : ''];
  const contentRow = [textEls.length ? textEls : ''];

  // Create the block table
  const cells = [headerRow, imageRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
