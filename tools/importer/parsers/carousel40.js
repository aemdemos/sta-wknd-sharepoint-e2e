/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to find direct child by class
  function findDirectChildByClass(parent, className) {
    return Array.from(parent.children).find((el) => el.classList && el.classList.contains(className));
  }

  // Table header row
  const headerRow = ['Carousel (carousel40)'];

  // Defensive: find the main teaser block
  let teaser = element;
  if (!teaser.classList.contains('cmp-teaser')) {
    // Try to find the teaser inside this block
    teaser = element.querySelector('.cmp-teaser') || element;
  }

  // Get image (first column)
  let imageEl = null;
  const imageWrapper = teaser.querySelector('.cmp-teaser__image');
  if (imageWrapper) {
    imageEl = imageWrapper.querySelector('img');
  }

  // Get text content (second column)
  const contentWrapper = teaser.querySelector('.cmp-teaser__content');
  const textContent = [];
  if (contentWrapper) {
    // Optional pretitle
    const pretitle = contentWrapper.querySelector('.cmp-teaser__pretitle');
    if (pretitle) {
      textContent.push(pretitle);
    }
    // Optional title (h2 or h3)
    const title = contentWrapper.querySelector('.cmp-teaser__title');
    if (title) {
      // Convert to h2 if not already
      let heading = title;
      if (title.tagName.toLowerCase() !== 'h2') {
        heading = document.createElement('h2');
        heading.innerHTML = title.innerHTML;
      }
      textContent.push(heading);
    }
    // Optional description
    const desc = contentWrapper.querySelector('.cmp-teaser__description');
    if (desc) {
      textContent.push(desc);
    }
    // Optional CTA
    const action = contentWrapper.querySelector('.cmp-teaser__action-link');
    if (action) {
      textContent.push(action);
    }
  }

  // Only add row if image is present (per block spec)
  const rows = [];
  if (imageEl) {
    rows.push([
      imageEl,
      textContent.length ? textContent : ''
    ]);
  }

  // Compose the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
