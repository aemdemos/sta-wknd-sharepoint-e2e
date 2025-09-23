/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main article/contentfragment
  const contentFragment = element.querySelector('article.contentfragment, article.cmp-contentfragment');
  if (!contentFragment) return;

  // Find all h2s (accordion section titles)
  const h2s = Array.from(contentFragment.querySelectorAll('h2'));
  if (!h2s.length) return;

  const rows = [];
  h2s.forEach((h2, idx) => {
    // Title cell: use the text content of the h2
    const titleCell = h2.textContent.trim();
    // Content cell: collect all nodes between this h2 and the next h2 (across all siblings, not just direct)
    const contentNodes = [];
    let node = h2.parentElement;
    // Find the next h2's parent
    let nextH2Parent = idx + 1 < h2s.length ? h2s[idx + 1].parentElement : null;
    node = node.nextElementSibling;
    while (node && node !== nextH2Parent) {
      // Only include elements with real content
      if (node.nodeType === 1) {
        // skip empty grid wrappers
        if (!(node.classList && node.classList.contains('aem-Grid'))) {
          // If the node contains only whitespace, skip
          if (node.textContent.trim() || node.children.length) {
            // If the node is a wrapper with only one child, unwrap it
            if (node.children.length === 1 && node.textContent.trim() === node.children[0].textContent.trim()) {
              contentNodes.push(node.children[0].cloneNode(true));
            } else {
              contentNodes.push(node.cloneNode(true));
            }
          }
        }
      }
      node = node.nextElementSibling;
    }
    // If contentNodes is empty, try to find all following siblings until next h2, including nested paragraphs, images, blockquotes
    if (!contentNodes.length) {
      let fallback = h2.parentElement.nextElementSibling;
      while (fallback && fallback !== nextH2Parent) {
        if ((['P', 'IMG', 'BLOCKQUOTE'].includes(fallback.tagName)) && fallback.textContent.trim()) {
          contentNodes.push(fallback.cloneNode(true));
        }
        // Also check for nested content inside wrappers
        const nested = fallback.querySelectorAll && fallback.querySelectorAll('p, img, blockquote');
        if (nested && nested.length) {
          nested.forEach(el => {
            if (el.textContent.trim() || el.tagName === 'IMG') {
              contentNodes.push(el.cloneNode(true));
            }
          });
        }
        fallback = fallback.nextElementSibling;
      }
    }
    // If still empty, fallback to empty string
    rows.push([titleCell, contentNodes.length ? contentNodes : ['']]);
  });

  if (!rows.length) return;

  // Table header row (block name)
  const headerRow = ['Accordion (accordion31)'];
  // Create the block table
  const table = WebImporter.DOMUtils.createTable([headerRow, ...rows], document);
  // Replace the original element (not just the content fragment)
  element.replaceWith(table);
}
