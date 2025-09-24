/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header
  const headerRow = ['Accordion (accordion6)'];

  // Find the main contentfragment article
  const contentFragment = element.querySelector('.cmp-contentfragment');
  if (!contentFragment) return;

  // Find all h2.cmp-title__text elements (accordion titles)
  const h2s = contentFragment.querySelectorAll('h2.cmp-title__text');
  const rows = [];

  h2s.forEach((h2, idx) => {
    // Title cell: clone the h2 for safety
    const titleCell = h2.cloneNode(true);
    // Content cell: collect all nodes between this h2 and the next h2
    const contentNodes = [];
    // Find the parent .cmp-title div
    let parentDiv = h2.closest('.cmp-title');
    // Start from the next sibling after the parent .cmp-title div
    let node = parentDiv ? parentDiv.parentElement.nextElementSibling : h2.parentElement.nextElementSibling;
    // Find the next h2's parent .cmp-title div (or null if last)
    let nextH2 = h2s[idx + 1];
    let nextStopDiv = nextH2 ? nextH2.closest('.cmp-title')?.parentElement : null;
    while (node && node !== nextStopDiv) {
      // If it's an image block
      const img = node.querySelector && node.querySelector('img.cmp-image__image');
      if (img) {
        contentNodes.push(img.cloneNode(true));
      }
      // If it's a paragraph, include it
      if (node.tagName === 'P') {
        contentNodes.push(node.cloneNode(true));
      }
      // If it's a div with paragraphs inside, include those
      if (node.tagName === 'DIV') {
        const ps = node.querySelectorAll('p');
        ps.forEach(p => contentNodes.push(p.cloneNode(true)));
      }
      node = node.nextElementSibling;
    }
    // Defensive: If no content found, try to find the next sibling paragraph after h2
    if (contentNodes.length === 0) {
      let fallback = parentDiv ? parentDiv.parentElement.nextElementSibling : h2.parentElement.nextElementSibling;
      if (fallback && fallback.tagName === 'P') {
        contentNodes.push(fallback.cloneNode(true));
      }
    }
    rows.push([titleCell, contentNodes.length ? contentNodes : '']);
  });

  // Compose the table
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
