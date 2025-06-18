/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the main hero image (top, full-width image)
  let heroImg = null;
  // From sample HTML: first .image .cmp-image under the first aem-Grid inside .cmp-container
  const containers = element.querySelectorAll(':scope > div > div');
  for (const container of containers) {
    // Find first image in direct children
    const imgDiv = container.querySelector('.image .cmp-image img');
    if (imgDiv) {
      heroImg = imgDiv;
      break;
    }
  }

  // 2. Find the main title, should be h1 in a .cmp-title
  let heading = null;
  const title = element.querySelector('.cmp-title h1');
  if (title) heading = title;

  // 3. Build the table as in the example:
  // Row 1: ['Hero']
  // Row 2: [heroImg or empty]
  // Row 3: [heading or empty]
  const rows = [
    ['Hero'],
    [heroImg ? heroImg : ''],
    [heading ? heading : '']
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
