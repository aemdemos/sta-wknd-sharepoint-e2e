/* global WebImporter */
export default function parse(element, { document }) {
  // Find the content fragment which contains the accordion content
  const contentFragment = element.querySelector('article.contentfragment article.cmp-contentfragment');
  if (!contentFragment) return;
  const elementsRoot = contentFragment.querySelector('.cmp-contentfragment__elements > div:last-of-type');
  if (!elementsRoot) return;

  // Prepare the table rows for the accordion block
  const rows = [];
  // Header must match exactly as in the example
  rows.push(['Accordion (accordion15)']);

  // Gather all nodes, not just elements, to retain text and block elements
  const nodes = Array.from(elementsRoot.childNodes);
  let i = 0;
  while (i < nodes.length) {
    let node = nodes[i];
    if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'H2') {
      // Title cell: always the h2 element itself
      const titleElem = node;
      // Gather all content nodes (including text) up to next h2
      let j = i + 1;
      let contentNodes = [];
      while (j < nodes.length) {
        const n = nodes[j];
        // Stop at next h2 (next accordion section)
        if (n.nodeType === Node.ELEMENT_NODE && n.tagName === 'H2') break;
        // skip empty aem-Grid wrappers
        if (n.nodeType === Node.ELEMENT_NODE && n.classList && n.classList.contains('aem-Grid') && n.children.length === 0) {
          j++;
          continue;
        }
        // aem-Grid containing image: include only the image div
        if (
          n.nodeType === Node.ELEMENT_NODE &&
          n.classList &&
          n.classList.contains('aem-Grid') &&
          n.children.length === 1 &&
          n.firstElementChild.classList.contains('image')
        ) {
          contentNodes.push(n.firstElementChild);
        } else {
          contentNodes.push(n);
        }
        j++;
      }
      // If contentNodes is empty, use an empty string
      let contentCell;
      if (contentNodes.length === 0) {
        contentCell = '';
      } else if (contentNodes.length === 1) {
        contentCell = contentNodes[0];
      } else {
        // wrap in a div (preserve text nodes and block semantics)
        const container = document.createElement('div');
        contentNodes.forEach(n => container.appendChild(n));
        contentCell = container;
      }
      rows.push([titleElem, contentCell]);
      i = j;
    } else {
      i++;
    }
  }

  // Create block table and replace element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
