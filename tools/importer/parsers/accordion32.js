/* global WebImporter */
export default function parse(element, { document }) {
  // Only parse the main article content fragment block
  const contentFragment = element.querySelector('.cmp-contentfragment');
  if (!contentFragment) return;

  // Find the main content area (the one with all the h2s and content)
  const elementsRoot = contentFragment.querySelector('.cmp-contentfragment__elements > div:last-of-type');
  if (!elementsRoot) return;

  // Collect all children nodes
  const children = Array.from(elementsRoot.childNodes);
  const rows = [];
  const headerRow = ['Accordion (accordion32)'];
  rows.push(headerRow);

  let i = 0;
  while (i < children.length) {
    // Find the next h2 (accordion section title)
    while (i < children.length && !(children[i].nodeType === 1 && children[i].tagName === 'H2')) i++;
    if (i >= children.length) break;
    const titleEl = children[i];
    i++;
    // Gather all content nodes until next h2 or end
    const contentNodes = [];
    while (i < children.length && !(children[i].nodeType === 1 && children[i].tagName === 'H2')) {
      // Skip empty grid wrappers and empty divs
      const node = children[i];
      if (
        node.nodeType === 1 &&
        ((node.classList && node.classList.contains('aem-Grid')) ||
         (node.tagName === 'DIV' && node.children.length === 0 && node.textContent.trim() === ''))
      ) {
        i++;
        continue;
      }
      contentNodes.push(node);
      i++;
    }
    // If content is just one element, use it directly; else, use array
    let contentCell;
    if (contentNodes.length === 1) {
      contentCell = contentNodes[0];
    } else if (contentNodes.length > 1) {
      contentCell = contentNodes;
    } else {
      contentCell = '';
    }
    rows.push([titleEl, contentCell]);
  }

  // Only create the block if there is at least one accordion item
  if (rows.length > 1) {
    const block = WebImporter.DOMUtils.createTable(rows, document);
    // Replace the content fragment with the block table
    contentFragment.replaceWith(block);
  }
}
