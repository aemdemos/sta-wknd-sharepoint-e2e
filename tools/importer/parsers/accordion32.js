/* global WebImporter */
export default function parse(element, { document }) {
  const contentFragment = element.querySelector('article.contentfragment');
  if (!contentFragment) return;

  // Always start with a header row with only one column
  const headerRow = ['Accordion (accordion32)'];
  const rows = [headerRow];

  // Find all .cmp-title--underline elements (section wrappers)
  const sectionWrappers = Array.from(contentFragment.querySelectorAll('.cmp-title--underline'));
  for (let i = 0; i < sectionWrappers.length; i++) {
    const wrapper = sectionWrappers[i];
    const titleEl = wrapper.querySelector('h2.cmp-title__text');
    if (!titleEl) continue;
    // Find the parent .aem-GridColumn
    let startNode = wrapper;
    while (startNode && !startNode.classList.contains('aem-GridColumn')) {
      startNode = startNode.parentElement;
    }
    if (!startNode) startNode = wrapper;
    // Find the next section wrapper
    let endNode = null;
    if (i + 1 < sectionWrappers.length) {
      let nextWrapper = sectionWrappers[i + 1];
      let nextStartNode = nextWrapper;
      while (nextStartNode && !nextStartNode.classList.contains('aem-GridColumn')) {
        nextStartNode = nextStartNode.parentElement;
      }
      if (!nextStartNode) nextStartNode = nextWrapper;
      endNode = nextStartNode;
    }
    // Collect all content between startNode and endNode
    const content = [];
    let node = startNode.nextSibling;
    while (node && node !== endNode) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        content.push(node);
      } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        const span = document.createElement('span');
        span.textContent = node.textContent;
        content.push(span);
      }
      node = node.nextSibling;
    }
    // Only add a row if there is actual content for the second cell
    if (content.length > 0) {
      rows.push([
        titleEl,
        content.length === 1 ? content[0] : content
      ]);
    }
    // If there is no content, do not add a row (no unnecessary empty columns)
  }

  // Create table WITHOUT colspan for header row
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Remove any colspan from header row
  const th = table.querySelector('th');
  if (th) th.removeAttribute('colspan');
  contentFragment.replaceWith(table);
}
