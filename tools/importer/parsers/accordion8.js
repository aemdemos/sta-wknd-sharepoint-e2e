/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block: 2 columns, multiple rows, first row is block name
  const headerRow = ['Accordion (accordion8)'];
  const rows = [headerRow];

  // Find the main article content
  const mainContent = element.querySelector('article.contentfragment');
  if (!mainContent) return;

  // Find all h2s (accordion section titles)
  const h2s = Array.from(mainContent.querySelectorAll('h2.cmp-title__text'));
  if (!h2s.length) return;

  // For each h2, collect the title and all content up to the next h2
  h2s.forEach((h2, idx) => {
    // Title cell: use the h2 element itself
    const titleCell = h2.cloneNode(true);

    // Find the parent .cmp-title
    let titleParent = h2.closest('.cmp-title');
    // Find the next h2's parent
    let nextTitleParent = idx < h2s.length - 1 ? h2s[idx + 1].closest('.cmp-title') : null;

    // Gather all content between this title and the next title
    let contentNodes = [];
    let node = titleParent ? titleParent.nextSibling : h2.nextSibling;
    while (node && node !== nextTitleParent) {
      // Only push element nodes and text nodes with content
      if (node.nodeType === 1) {
        contentNodes.push(node.cloneNode(true));
      } else if (node.nodeType === 3 && node.textContent.trim()) {
        // Wrap text node in a <span> to preserve it
        const span = document.createElement('span');
        span.textContent = node.textContent;
        contentNodes.push(span);
      }
      node = node.nextSibling;
    }

    // Defensive: if no contentNodes, try to find the next p or image
    if (!contentNodes.length && titleParent && titleParent.nextElementSibling) {
      contentNodes.push(titleParent.nextElementSibling.cloneNode(true));
    }

    // Remove nulls
    const filteredContent = contentNodes.filter(Boolean);
    // If only one element, use it directly, else use array
    let contentCell;
    if (filteredContent.length === 1) {
      contentCell = filteredContent[0];
    } else if (filteredContent.length > 1) {
      const wrapper = document.createElement('div');
      filteredContent.forEach(el => wrapper.appendChild(el));
      contentCell = wrapper;
    } else {
      contentCell = '';
    }
    rows.push([titleCell, contentCell]);
  });

  // Replace the original element with the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
