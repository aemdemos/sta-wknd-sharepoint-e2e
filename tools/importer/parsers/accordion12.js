/* global WebImporter */
export default function parse(element, { document }) {
  // Build the table header row exactly as required
  const cells = [['Accordion (accordion12)']];

  // Find the main content fragment
  const fragment = element.querySelector('article.cmp-contentfragment');
  if (!fragment) return;

  // Get the parent for main article content
  const contentRoot = fragment.querySelector('.cmp-contentfragment__elements');
  if (!contentRoot) return;

  // Find all h2s for accordion section titles
  const h2s = contentRoot.querySelectorAll('h2.cmp-title__text');

  // --- FIX: Handle the introductory content and quote block before the first h2 ---
  // Gather all direct children before the first h2 for the first accordion row
  const children = Array.from(contentRoot.children);
  let firstH2Index = children.findIndex(el => el.querySelector && el.querySelector('h2.cmp-title__text'));
  if (firstH2Index === -1) firstH2Index = children.length; // handle no h2 case
  // Gather all introductory blocks: paragraphs, quotes, grids, etc.
  const introParts = [];
  for (let i = 0; i < firstH2Index; i++) {
    const child = children[i];
    // Only push if it's not empty
    if (child.textContent.trim() || child.querySelector('img')) {
      introParts.push(child);
    }
  }
  if (introParts.length) {
    // Use the contentfragment title as the title for this first panel, if available
    let introTitle = fragment.querySelector('h3.cmp-contentfragment__title');
    if (!introTitle) {
      // Fallback: use article h1 if present
      const h1 = element.querySelector('h1.cmp-title__text');
      if (h1) introTitle = h1;
    }
    // If no good heading found, use a string
    cells.push([introTitle || 'Introduction', introParts.length === 1 ? introParts[0] : introParts]);
  }

  // --- Build rows for each accordion section ---
  h2s.forEach(h2 => {
    // Title cell: the <h2> element itself
    const titleCell = h2;
    // Find the parent .cmp-title, then gather following siblings until next h2
    let node = h2.parentElement.nextElementSibling;
    const contentParts = [];
    while (node) {
      // If node contains h2, it's the next panel
      if (node.querySelector && node.querySelector('h2.cmp-title__text')) break;
      // Only push if it's not empty
      if (node.textContent.trim() || node.querySelector('img')) {
        contentParts.push(node);
      }
      node = node.nextElementSibling;
    }
    if (contentParts.length) {
      cells.push([titleCell, contentParts.length === 1 ? contentParts[0] : contentParts]);
    }
  });

  // Only replace if there is at least one accordion panel (header + 1 row)
  if (cells.length > 1) {
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  }
}
