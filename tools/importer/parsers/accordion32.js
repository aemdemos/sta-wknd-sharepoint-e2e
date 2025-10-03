/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main article content fragment
  const contentFragment = element.querySelector('.cmp-contentfragment__elements');
  if (!contentFragment) return;

  // Table header: block name in a single cell
  const headerRow = ['Accordion (accordion32)'];
  const rows = [headerRow];

  // Find all h2 titles and their content sections
  // Use a less specific selector to include all possible content
  const allNodes = Array.from(contentFragment.childNodes);
  let i = 0;
  while (i < allNodes.length) {
    let node = allNodes[i];
    let h2;
    if (node.nodeType === 1 && (h2 = node.querySelector && node.querySelector('h2.cmp-title__text'))) {
      // Title cell
      const titleElem = h2;
      // Content cell: collect all following siblings until next h2
      const contentNodes = [];
      let j = i + 1;
      while (j < allNodes.length) {
        const nextNode = allNodes[j];
        const nextH2 = nextNode.nodeType === 1 && nextNode.querySelector && nextNode.querySelector('h2.cmp-title__text');
        if (nextH2) break;
        // Only add non-empty nodes
        if (nextNode.nodeType === 1 && nextNode.textContent.trim().length > 0) {
          contentNodes.push(nextNode);
        } else if (nextNode.nodeType === 3 && nextNode.textContent.trim().length > 0) {
          // Text node: wrap in <span>
          const span = document.createElement('span');
          span.textContent = nextNode.textContent;
          contentNodes.push(span);
        }
        j++;
      }
      // If only one node, use it directly, else use array
      let contentCell;
      if (contentNodes.length === 1) {
        contentCell = contentNodes[0];
      } else if (contentNodes.length > 1) {
        contentCell = contentNodes;
      } else {
        contentCell = document.createElement('div');
      }
      rows.push([titleElem, contentCell]);
      i = j;
    } else {
      i++;
    }
  }

  // Build the accordion block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
