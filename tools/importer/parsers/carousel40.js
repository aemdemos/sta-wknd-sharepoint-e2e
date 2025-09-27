/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: safely get a child by class from a parent
  function getChildByClass(parent, className) {
    return Array.from(parent.children).find((el) => el.classList.contains(className));
  }

  // 1. Table header
  const headerRow = ['Carousel (carousel40)'];

  // 2. Extract image (mandatory, first column)
  // The structure is: .cmp-teaser > .cmp-teaser__image > .cmp-image > img
  let imgEl = null;
  const teaser = element.querySelector('.cmp-teaser');
  if (teaser) {
    const imageWrapper = getChildByClass(teaser, 'cmp-teaser__image');
    if (imageWrapper) {
      const cmpImage = imageWrapper.querySelector('.cmp-image');
      if (cmpImage) {
        imgEl = cmpImage.querySelector('img');
      }
    }
  }

  // 3. Extract text content (second column)
  // We'll collect: pretitle, title, description, CTA (if present)
  let textContent = [];
  if (teaser) {
    const contentWrapper = getChildByClass(teaser, 'cmp-teaser__content');
    if (contentWrapper) {
      // Pretitle (optional)
      const pretitle = contentWrapper.querySelector('.cmp-teaser__pretitle');
      if (pretitle) {
        textContent.push(pretitle);
      }
      // Title (as heading)
      const title = contentWrapper.querySelector('.cmp-teaser__title');
      if (title) {
        // Use h2 as is
        textContent.push(title);
      }
      // Description
      const desc = contentWrapper.querySelector('.cmp-teaser__description');
      if (desc) {
        textContent.push(desc);
      }
      // CTA (optional)
      const actionContainer = contentWrapper.querySelector('.cmp-teaser__action-container');
      if (actionContainer) {
        const cta = actionContainer.querySelector('a');
        if (cta) {
          textContent.push(cta);
        }
      }
    }
  }

  // Defensive: fallback if image or text missing
  if (!imgEl) {
    // If no image, skip this block entirely
    return;
  }

  // 4. Build the table rows
  const rows = [headerRow];
  rows.push([
    imgEl,
    textContent.length > 0 ? textContent : '',
  ]);

  // 5. Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
