/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the hero block root
  const heroContainer = element.querySelector('.cmp-container');
  if (!heroContainer) return;
  const heroTeaser = heroContainer.querySelector('.cmp-teaser--hero');
  if (!heroTeaser) return;

  // 2. Get the background image (row 2)
  let imageEl = null;
  const imageWrapper = heroTeaser.querySelector('.cmp-teaser__image .cmp-image');
  if (imageWrapper) {
    imageEl = imageWrapper.querySelector('img');
  }

  // 3. Get all text content for the content cell (row 3)
  let contentCell = '';
  const contentWrapper = heroTeaser.querySelector('.cmp-teaser__content');
  if (contentWrapper) {
    // Collect all children (headings, paragraphs, buttons, etc)
    const nodes = Array.from(contentWrapper.childNodes).filter(n => {
      // Only include element nodes and text nodes with non-whitespace
      return (n.nodeType === 1) || (n.nodeType === 3 && n.textContent.trim());
    });
    if (nodes.length === 1) {
      contentCell = nodes[0].cloneNode(true);
    } else if (nodes.length > 1) {
      // Wrap in a div to preserve block structure
      const div = document.createElement('div');
      nodes.forEach(n => div.appendChild(n.cloneNode(true)));
      contentCell = div;
    }
  }

  // 4. Build the table rows
  const headerRow = ['Hero (hero6)'];
  const imageRow = [imageEl ? imageEl.cloneNode(true) : ''];
  // Always output 3 rows: header, image, content
  // If contentCell is empty, output an empty string for the third row
  const contentRow = [contentCell ? contentCell : ''];

  // 5. Create the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    imageRow,
    contentRow,
  ], document);

  // 6. Replace the original element
  element.replaceWith(table);
}
