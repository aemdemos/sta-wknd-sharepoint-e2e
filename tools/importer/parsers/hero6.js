/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero/teaser block
  const hero = element.querySelector('.cmp-teaser');
  if (!hero) return;

  // Find the image (background image)
  let imageEl = null;
  const imageWrapper = hero.querySelector('.cmp-teaser__image');
  if (imageWrapper) {
    imageEl = imageWrapper.querySelector('img');
  }

  // Gather all content for the third row (title, subheading, CTA) as a single cell
  let contentCell = '';
  const content = hero.querySelector('.cmp-teaser__content');
  if (content) {
    // Collect all block children (headings, paragraphs, links, etc.)
    const children = Array.from(content.children);
    if (children.length) {
      // Create a fragment to hold all content
      const frag = document.createDocumentFragment();
      children.forEach(child => frag.appendChild(child.cloneNode(true)));
      contentCell = frag;
    }
  }

  // Ensure table always has 3 rows (header, image, content)
  const headerRow = ['Hero (hero6)'];
  const imageRow = [imageEl ? imageEl : ''];
  const thirdRow = [contentCell ? contentCell : ''];

  const cells = [headerRow, imageRow, thirdRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Remove any <hr> separators outside the block (if present)
  const hrSeparators = element.querySelectorAll('hr.cmp-separator__horizontal-rule');
  hrSeparators.forEach(hr => hr.remove());

  // Replace the hero/teaser block with the table
  hero.replaceWith(table);
}
