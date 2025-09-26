/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero teaser block
  const teaser = element.querySelector('.cmp-teaser--hero') || element.querySelector('.cmp-teaser');
  if (!teaser) return;

  // Find the image (background)
  let imageEl = null;
  const imageWrapper = teaser.querySelector('.cmp-teaser__image');
  if (imageWrapper) {
    imageEl = imageWrapper.querySelector('img');
  }

  // Collect all text content for the third row (title, subheading, CTA)
  let textContent = '';
  const contentWrapper = teaser.querySelector('.cmp-teaser__content');
  if (contentWrapper) {
    // Combine all children into a single fragment
    const frag = document.createDocumentFragment();
    Array.from(contentWrapper.children).forEach(child => frag.appendChild(child.cloneNode(true)));
    // If there was at least one child, use the fragment; else, use empty string
    textContent = frag.childNodes.length ? frag : '';
  }

  // Always create three rows: header, image, and text (even if some are empty)
  const headerRow = ['Hero (hero12)'];
  const imageRow = [imageEl ? imageEl : ''];
  const textRow = [textContent];

  // Compose table
  const cells = [headerRow, imageRow, textRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element with block table
  element.replaceWith(table);
}
