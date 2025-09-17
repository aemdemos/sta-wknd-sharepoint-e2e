/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main contentfragment article
  const contentFragment = element.querySelector('article.cmp-contentfragment');
  if (!contentFragment) return;

  // Compose the header row
  const headerRow = ['Accordion (accordion19)'];

  // Find all h2.cmp-title__text inside the contentfragment
  const h2s = contentFragment.querySelectorAll('h2.cmp-title__text');
  const cells = [headerRow];

  h2s.forEach((h2, idx) => {
    // Title cell is the h2 itself
    const titleCell = h2;
    // Content cell: everything after this h2 up to the next h2 (or end)
    let contentNodes = [];
    let node = h2.parentElement.parentElement.nextElementSibling;
    while (node) {
      // Stop if we reach another h2
      const h2Inside = node.querySelector && node.querySelector('h2.cmp-title__text');
      if (h2Inside) break;
      // Stop if we reach a title block with h2
      if (node.classList && node.classList.contains('title') && node.querySelector('h2.cmp-title__text')) break;
      // If it's a paragraph, image, or grid, include it
      if (
        node.tagName === 'P' ||
        node.classList.contains('image') ||
        node.classList.contains('aem-Grid') ||
        node.tagName === 'DIV' ||
        node.tagName === 'BLOCKQUOTE'
      ) {
        contentNodes.push(node);
      }
      node = node.nextElementSibling;
    }
    // Defensive: also include the address paragraph after the main content
    // Find the next <p><i><b>...</b></i></p> after the h2
    let afterH2 = h2.parentElement.parentElement.nextElementSibling;
    while (afterH2) {
      if (
        afterH2.tagName === 'P' &&
        afterH2.querySelector('i > b')
      ) {
        if (!contentNodes.includes(afterH2)) {
          contentNodes.push(afterH2);
        }
        break;
      }
      afterH2 = afterH2.nextElementSibling;
    }
    // If no contentNodes found, try to grab the next p (for edge cases)
    if (contentNodes.length === 0) {
      let fallback = h2.parentElement.parentElement.nextElementSibling;
      if (fallback && fallback.tagName === 'P') {
        contentNodes.push(fallback);
      }
    }
    // Only add the row if there is at least one content node
    if (contentNodes.length > 0) {
      // If only one node, just use it, else use the array
      cells.push([titleCell, contentNodes.length === 1 ? contentNodes[0] : contentNodes]);
    }
  });

  // Defensive: If no items found, fallback to nothing
  if (cells.length === 1) return;

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
