/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to safely get the first direct child div with a given class
  function getChildDivByClass(parent, className) {
    const children = parent.querySelectorAll(':scope > div');
    for (const div of children) {
      if (div.classList.contains(className)) {
        return div;
      }
    }
    return null;
  }

  // Get the background image (row 2)
  let bgImgElem = null;
  const teaserImageDiv = element.querySelector('.cmp-teaser__image');
  if (teaserImageDiv) {
    const img = teaserImageDiv.querySelector('img');
    if (img) {
      bgImgElem = img;
    }
  }

  // Get the text content (row 3)
  // We want the block headline and description, as in the screenshot example
  let contentFragment = document.createDocumentFragment();
  const teaserContentDiv = element.querySelector('.cmp-teaser__content');
  if (teaserContentDiv) {
    // Get title (h2), description (div), and any other children
    const title = teaserContentDiv.querySelector('h2, h1, h3, h4, h5, h6');
    if (title) contentFragment.appendChild(title);
    const desc = teaserContentDiv.querySelector('.cmp-teaser__description');
    if (desc) {
      // Move all children (e.g., paragraph tags)
      while (desc.firstChild) {
        contentFragment.appendChild(desc.firstChild);
      }
    }
  }

  // Build the table
  const rows = [];
  rows.push(['Hero (hero39)']);
  // 2nd row: background image
  rows.push([bgImgElem ? bgImgElem : '']);
  // 3rd row: content
  // If contentFragment has children, use it, else empty string
  if (contentFragment.childNodes.length > 0) {
    rows.push([contentFragment]);
  } else {
    rows.push(['']);
  }

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
