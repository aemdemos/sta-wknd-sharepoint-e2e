/* global WebImporter */
export default function parse(element, { document }) {
  // Compose header row exactly as required
  const headerRow = ['Carousel (carousel21)'];

  // Get all relevant content for a single slide
  // 1st column: image (mandatory)
  // 2nd column: text content (title, description, CTA, etc.)

  // Find image element (reference existing element)
  let imgEl = null;
  const imageWrapper = element.querySelector('.cmp-teaser__image');
  if (imageWrapper) {
    imgEl = imageWrapper.querySelector('img');
  }

  // Prepare the text cell content for the slide
  const textContent = [];
  const content = element.querySelector('.cmp-teaser__content');
  if (content) {
    // Pretitle (if present)
    const preTitle = content.querySelector('.cmp-teaser__pretitle');
    if (preTitle && preTitle.textContent.trim()) {
      // Use a <p> for the pretitle
      textContent.push(preTitle);
    }
    // Title (h2)
    const title = content.querySelector('.cmp-teaser__title');
    if (title && title.textContent.trim()) {
      textContent.push(title);
    }
    // Description
    const desc = content.querySelector('.cmp-teaser__description');
    if (desc && desc.textContent.trim()) {
      textContent.push(desc);
    }
    // CTA(s) (can be more than one!)
    const actions = content.querySelectorAll('.cmp-teaser__action-link');
    if (actions && actions.length > 0) {
      actions.forEach(cta => {
        // Add a break between main content and CTA if necessary
        textContent.push(document.createElement('br'));
        textContent.push(cta);
      });
    }
  }

  // Only add the slide row if there's at least an image or any text
  const rows = [headerRow];
  if (imgEl || textContent.length > 0) {
    rows.push([imgEl, textContent]);
  }

  // Create and replace with the structured carousel block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
