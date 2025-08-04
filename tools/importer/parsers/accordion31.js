/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block: header row, then each accordion item is [title cell, content cell]
  // Example: Each section title (h2.cmp-title__text) is the accordion title; its content is everything until the next h2.cmp-title__text

  // Helper: collect all nodes between two headings
  function collectContent(startElem, stopSelector) {
    const nodes = [];
    let node = startElem.nextSibling;
    while (node) {
      if (
        node.nodeType === 1 &&
        node.matches &&
        node.matches(stopSelector)
      ) {
        break;
      }
      // Only include nodes with content
      if (
        (node.nodeType === 1 && node.textContent.trim()) ||
        (node.nodeType === 3 && node.textContent.trim())
      ) {
        nodes.push(node);
      }
      node = node.nextSibling;
    }
    // Clean up: if only one node, pass it directly, else as array
    if (nodes.length === 1) return nodes[0];
    if (nodes.length > 1) return nodes;
    // If no nodes, return empty string
    return '';
  }

  // Find the article/content root to scope the search
  const contentRoot = element.querySelector(
    'article.contentfragment, .cmp-contentfragment, main.container.responsivegrid, main, article'
  );
  if (!contentRoot) return;

  // Find all section titles (h2.cmp-title__text)
  const headings = Array.from(contentRoot.querySelectorAll('h2.cmp-title__text'));
  if (!headings.length) return; // nothing to process

  // Build table header
  const rows = [['Accordion (accordion31)']];

  // For each heading, collect its content until the next heading
  for (let i = 0; i < headings.length; i++) {
    const title = headings[i];
    // Content is between this h2 and the next h2
    let content = [];
    let node = title.parentElement.parentElement.nextSibling;
    // Defensive: go to next element if there are empty nodes
    while (node && (node.nodeType !== 1 || (node.nodeType === 1 && !node.textContent.trim()))) {
      node = node.nextSibling;
    }
    // Gather nodes until next h2.cmp-title__text
    while (node && !(node.matches && node.matches('.cmp-title > h2.cmp-title__text'))) {
      if (
        (node.nodeType === 1 && node.textContent.trim()) ||
        (node.nodeType === 3 && node.textContent.trim())
      ) {
        content.push(node);
      }
      node = node.nextSibling;
    }
    // If only one node, use it directly
    let accordionContent = content.length === 1 ? content[0] : content;
    // If nothing, fallback to empty string
    if (!accordionContent || (Array.isArray(accordionContent) && accordionContent.length === 0)) {
      accordionContent = '';
    }
    rows.push([title, accordionContent]);
  }

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
