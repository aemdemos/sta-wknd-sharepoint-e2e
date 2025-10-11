/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main article content area
  let articleRoot = element.querySelector('article.cmp-contentfragment, article.contentfragment');
  if (!articleRoot) {
    articleRoot = element.querySelector('article');
  }
  if (!articleRoot) return;

  // The content is inside .cmp-contentfragment__elements
  let contentRoot = articleRoot.querySelector('.cmp-contentfragment__elements');
  if (!contentRoot) contentRoot = articleRoot;

  // We'll collect accordion items as [title, content] arrays
  const items = [];

  // Find all h2s (accordion section titles)
  const h2s = Array.from(contentRoot.querySelectorAll('h2.cmp-title__text, h2'));
  if (!h2s.length) return;

  // For each h2, grab all content until the next h2
  h2s.forEach((h2, idx) => {
    // Title cell: use the h2 element itself
    const titleCell = h2;
    // Content cell: collect all siblings after h2 until next h2
    const contentNodes = [];
    let node = h2.nextSibling;
    // Traverse siblings, collecting all content until next h2
    while (node && !(node.nodeType === 1 && node.tagName === 'H2')) {
      // Only add element or text nodes
      if (
        node.nodeType === 1 ||
        (node.nodeType === 3 && node.textContent.trim())
      ) {
        contentNodes.push(node);
      }
      node = node.nextSibling;
    }
    // If contentNodes is empty, try to get following siblings from parent (for robustness)
    if (contentNodes.length === 0) {
      let siblings = Array.from(h2.parentNode.children);
      for (let i = siblings.indexOf(h2) + 1; i < siblings.length; i++) {
        if (siblings[i].tagName === 'H2') break;
        contentNodes.push(siblings[i]);
      }
    }
    // If still empty, try to get from grandparent (sometimes structure is nested)
    if (contentNodes.length === 0 && h2.parentNode.parentNode) {
      let siblings = Array.from(h2.parentNode.parentNode.children);
      for (let i = siblings.indexOf(h2.parentNode) + 1; i < siblings.length; i++) {
        if (siblings[i].querySelector && siblings[i].querySelector('h2')) break;
        contentNodes.push(siblings[i]);
      }
    }
    // Filter out empty nodes
    const filteredContent = contentNodes.filter(
      n => (n.nodeType === 1 && n.textContent.trim()) || (n.nodeType === 3 && n.textContent.trim())
    );
    // If only one node, use it directly; else, array
    // FIX: If still empty, try to get all following siblings from contentRoot
    let contentCell = filteredContent;
    if (filteredContent.length === 0) {
      let siblings = Array.from(contentRoot.children);
      for (let i = siblings.indexOf(h2) + 1; i < siblings.length; i++) {
        if (siblings[i].tagName === 'H2') break;
        if (siblings[i].textContent.trim()) contentCell.push(siblings[i]);
      }
    }
    if (contentCell.length === 1) contentCell = contentCell[0];
    items.push([titleCell, contentCell]);
  });

  // Compose the table rows
  const headerRow = ['Accordion (accordion37)'];
  const rows = [headerRow, ...items];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
