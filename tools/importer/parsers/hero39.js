/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main teaser block
  const teaser = element.querySelector('.cmp-teaser');
  if (!teaser) return;

  // Get the image element (background image)
  let imageEl = null;
  const imageWrapper = teaser.querySelector('.cmp-teaser__image');
  if (imageWrapper) {
    imageEl = imageWrapper.querySelector('img');
  }

  // Get the content (title, description, etc)
  const content = teaser.querySelector('.cmp-teaser__content');
  let contentFragments = [];
  if (content) {
    // Title
    const title = content.querySelector('.cmp-teaser__title');
    if (title) contentFragments.push(title);
    // Description (may contain paragraphs)
    const desc = content.querySelector('.cmp-teaser__description');
    if (desc) {
      // Push all children of description (preserve paragraphs)
      Array.from(desc.childNodes).forEach((node) => {
        if (node.nodeType === 1) {
          contentFragments.push(node);
        } else if (node.nodeType === 3 && node.textContent.trim()) {
          // Text node
          const p = document.createElement('p');
          p.textContent = node.textContent;
          contentFragments.push(p);
        }
      });
    }
  }

  // Build the table rows
  const headerRow = ['Hero (hero39)'];
  const imageRow = [imageEl ? imageEl : ''];
  const contentRow = [contentFragments.length ? contentFragments : ''];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    imageRow,
    contentRow,
  ], document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
