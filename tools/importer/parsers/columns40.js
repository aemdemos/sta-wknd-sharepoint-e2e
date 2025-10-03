/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get immediate child by class name
  function getDirectChildByClass(parent, className) {
    return Array.from(parent.children).find(child => child.classList.contains(className));
  }

  // 1. Header row
  const headerRow = ['Columns (columns40)'];

  // 2. Get the two main columns: image (left), content (right)
  // The structure is: .cmp-teaser__image and .cmp-teaser__content
  const teaserImageWrapper = getDirectChildByClass(element, 'cmp-teaser__image');
  const teaserContent = getDirectChildByClass(element, 'cmp-teaser__content');

  // Defensive: fallback if not found
  if (!teaserImageWrapper || !teaserContent) {
    // fallback: just replace with block name
    const table = WebImporter.DOMUtils.createTable([
      headerRow,
      [element.cloneNode(true)]
    ], document);
    element.replaceWith(table);
    return;
  }

  // Get the actual image element (find first <img> inside teaserImageWrapper)
  const img = teaserImageWrapper.querySelector('img');
  // Defensive: if no image, use the wrapper div
  const imageCell = img || teaserImageWrapper;

  // For the content column, we want to preserve the structure:
  // - pretitle (p)
  // - title (h2)
  // - description (div)
  // - action (div with a)
  // We'll collect these in order
  const contentParts = [];
  // pretitle
  const pretitle = teaserContent.querySelector('.cmp-teaser__pretitle');
  if (pretitle) contentParts.push(pretitle);
  // title
  const title = teaserContent.querySelector('.cmp-teaser__title');
  if (title) contentParts.push(title);
  // description
  const desc = teaserContent.querySelector('.cmp-teaser__description');
  if (desc) contentParts.push(desc);
  // action link
  const action = teaserContent.querySelector('.cmp-teaser__action-link');
  if (action) {
    // wrap in a div for spacing if not already
    const wrap = document.createElement('div');
    wrap.append(action);
    contentParts.push(wrap);
  }

  // 3. Build the table rows: header, then one row with two columns (image, content)
  const tableRows = [
    headerRow,
    [imageCell, contentParts]
  ];

  // 4. Create and replace
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
