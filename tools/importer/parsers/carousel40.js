/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the main teaser block (could be the element itself or a child)
  let teaser = element;
  if (!teaser.classList.contains('cmp-teaser')) {
    teaser = element.querySelector('.cmp-teaser');
  }
  if (!teaser) return;

  // Get the image (first column)
  let imageCol = null;
  const imageWrapper = teaser.querySelector('.cmp-teaser__image');
  if (imageWrapper) {
    // Find the first <img> inside
    const img = imageWrapper.querySelector('img');
    if (img) {
      imageCol = img;
    }
  }

  // Get the text content (second column)
  const contentWrapper = teaser.querySelector('.cmp-teaser__content');
  let textCol = null;
  if (contentWrapper) {
    // We'll collect the pretitle, title, description, and CTA if present
    const frag = document.createDocumentFragment();

    // Pretitle (optional)
    const pretitle = contentWrapper.querySelector('.cmp-teaser__pretitle');
    if (pretitle) {
      frag.appendChild(pretitle);
    }

    // Title (h2)
    const title = contentWrapper.querySelector('.cmp-teaser__title');
    if (title) {
      frag.appendChild(title);
    }

    // Description (div)
    const desc = contentWrapper.querySelector('.cmp-teaser__description');
    if (desc) {
      frag.appendChild(desc);
    }

    // CTA (link)
    const cta = contentWrapper.querySelector('.cmp-teaser__action-link');
    if (cta) {
      frag.appendChild(cta);
    }

    textCol = frag;
  }

  // Build the table rows
  const headerRow = ['Carousel (carousel40)'];
  const rows = [headerRow];
  // Only add the row if we have at least an image
  if (imageCol) {
    rows.push([imageCol, textCol]);
  }

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
