/* global WebImporter */
export default function parse(element, { document }) {
  // Scope to the main content block (the main .cmp-container inside the element)
  const mainContainer = element.querySelector('.cmp-container');
  if (!mainContainer) return;

  // Find the first prominent hero image (top of page)
  let heroImg = null;
  const imageCandidates = mainContainer.querySelectorAll('.cmp-image img');
  if (imageCandidates.length > 0) heroImg = imageCandidates[0];

  // Collect hero text content: title (h1), byline (h4), and intro (first paragraph)
  const textContent = [];
  // Title (h1)
  const h1 = mainContainer.querySelector('h1');
  if (h1) textContent.push(h1);
  // Byline (h4)
  const h4 = mainContainer.querySelector('h4');
  if (h4) textContent.push(h4);
  // Intro paragraph: the first <p> in the first contentfragment
  let introP = null;
  const contentFragment = mainContainer.querySelector('article.contentfragment');
  if (contentFragment) {
    introP = contentFragment.querySelector('p');
  }
  if (introP) {
    textContent.push(introP);
  }

  // If for some reason no textContent, use empty string to keep structure
  if (textContent.length === 0) textContent.push('');

  // Build the table as per the example: 1 col, 3 rows, header 'Hero'
  const cells = [
    ['Hero'],
    [heroImg || ''],
    [textContent.length === 1 ? textContent[0] : textContent],
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
