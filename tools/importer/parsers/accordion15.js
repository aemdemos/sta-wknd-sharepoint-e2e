/* global WebImporter */
export default function parse(element, { document }) {
  // Find the content fragment article, which contains the surf spot sections
  const cf = element.querySelector('article.contentfragment article.cmp-contentfragment');
  if (!cf) return;
  // Get the container with surf spots content (the .cmp-contentfragment__elements > div)
  const cfElements = cf.querySelector('.cmp-contentfragment__elements');
  if (!cfElements) return;
  const children = Array.from(cfElements.children);

  // Find all indices of H2s - these are accordion item titles
  let indices = [];
  for (let i = 0; i < children.length; i++) {
    if (children[i].tagName === 'H2') indices.push(i);
  }
  if (indices.length === 0) return;

  // Build the accordion table rows
  const rows = [];
  rows.push(['Accordion (accordion15)']);
  for (let i = 0; i < indices.length; i++) {
    const titleElem = children[indices[i]];
    const title = titleElem.textContent;
    // Gather content elements between this H2 and the next H2 (or end)
    const start = indices[i] + 1;
    const end = indices[i + 1] !== undefined ? indices[i + 1] : children.length;
    const contentNodes = [];
    for (let j = start; j < end; j++) {
      const node = children[j];
      // Only add non-empty nodes: images or paragraphs
      if (node.tagName === 'DIV') {
        // Keep any image-containing div
        if (node.querySelector('img')) contentNodes.push(node);
      } else if (node.tagName === 'P') {
        // Keep non-empty paragraphs
        if (node.textContent.trim().length) contentNodes.push(node);
      }
    }
    rows.push([title, contentNodes]);
  }

  const table = WebImporter.DOMUtils.createTable(rows, document);
  cf.replaceWith(table);
}
