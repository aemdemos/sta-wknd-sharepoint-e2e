/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main contentfragment article
  const contentFragment = element.querySelector('article.contentfragment');
  if (!contentFragment) return;
  // Find the inner content area (where the cards are)
  const cfElements = contentFragment.querySelector('.cmp-contentfragment__elements');
  if (!cfElements) return;

  // Find all h2s (each card's title)
  const h2s = Array.from(cfElements.querySelectorAll('h2'));
  const rows = [];
  const headerRow = ['Cards (cards32)'];
  rows.push(headerRow);

  h2s.forEach(h2 => {
    // Find the next image after this h2
    let imgDiv = null;
    let sibling = h2.nextElementSibling;
    while (sibling) {
      if (sibling.querySelector && sibling.querySelector('.cmp-image')) {
        imgDiv = sibling.querySelector('.cmp-image');
        break;
      }
      // Stop if we hit another h2 (next card)
      if (sibling.tagName && sibling.tagName.toLowerCase() === 'h2') break;
      sibling = sibling.nextElementSibling;
    }
    // Find the next paragraph after the image (or after h2 if no image)
    let desc = null;
    let descStart = imgDiv ? imgDiv.parentElement.nextElementSibling : h2.nextElementSibling;
    while (descStart) {
      if (descStart.tagName && descStart.tagName.toLowerCase() === 'p') {
        desc = descStart;
        break;
      }
      // Stop if we hit another h2 (next card)
      if (descStart.tagName && descStart.tagName.toLowerCase() === 'h2') break;
      descStart = descStart.nextElementSibling;
    }
    // Only add row if both image and description are present
    if (imgDiv && desc) {
      rows.push([imgDiv, [h2, desc]]);
    }
  });

  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    // Replace the contentfragment itself, not the root element
    contentFragment.replaceWith(table);
  }
}
