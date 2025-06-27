/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero image: first .image img in the main container
  let heroImg = null;
  const possibleImages = element.querySelectorAll('.image img');
  if (possibleImages.length > 0) {
    heroImg = possibleImages[0];
  }

  // Build the hero text content: all heading and author elements before the main article
  let textContent = [];
  // Get all direct children (divs, etc.) of the main element
  const children = Array.from(element.children);
  let foundContentFragment = false;
  for (const child of children) {
    // Stop when we reach the main article/contentfragment (not part of hero's text)
    if (child.tagName === 'MAIN' && child.querySelector('article.contentfragment')) {
      foundContentFragment = true;
      break;
    }
    // Title blocks (with <h1> or <h4> etc)
    if (child.classList.contains('container')) {
      const titles = child.querySelectorAll('.title h1, .title h2, .title h3, .title h4, .title h5, .title h6');
      titles.forEach(el => {
        if (el && el.textContent.trim()) textContent.push(el);
      });
    } else if (child.classList.contains('title')) {
      // Sometimes title blocks are direct children
      const titles = child.querySelectorAll('h1, h2, h3, h4, h5, h6');
      titles.forEach(el => {
        if (el && el.textContent.trim()) textContent.push(el);
      });
    }
  }

  // Remove duplicates, empty, and ensure fallback if nothing found
  textContent = textContent.filter((el, i, arr) => el && el.textContent.trim() && arr.indexOf(el) === i);

  // Fallback: Use first h1 in the main container if nothing above
  if (textContent.length === 0) {
    const fallbackH1 = element.querySelector('h1');
    if (fallbackH1) textContent.push(fallbackH1);
  }

  // Build the Hero table: 1 column, 3 rows (header, image, text)
  const cells = [
    ['Hero'],
    [heroImg ? heroImg : ''],
    [textContent.length > 0 ? textContent : ''],
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
