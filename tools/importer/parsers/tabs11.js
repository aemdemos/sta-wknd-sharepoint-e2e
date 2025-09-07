/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main contentfragment article
  const contentFragment = element.querySelector('article.contentfragment');
  if (!contentFragment) return;

  // Find all h2 titles (tab labels)
  const tabTitles = Array.from(contentFragment.querySelectorAll('h2.cmp-title__text'));
  if (!tabTitles.length) return;

  // For each tab, collect its label and content
  const tabRows = tabTitles.map((h2, idx) => {
    const label = h2.textContent.trim();
    // Tab content: everything from h2's parent (cmp-title) next sibling until next h2
    let contentNodes = [];
    let node = h2.parentElement.parentElement.nextElementSibling;
    while (node && !(node.querySelector && node.querySelector('h2.cmp-title__text'))) {
      contentNodes.push(node);
      node = node.nextElementSibling;
    }
    // Defensive: filter out nulls
    contentNodes = contentNodes.filter(Boolean);
    // If only one node, use it directly, else use array
    let tabContent;
    if (contentNodes.length === 1) {
      tabContent = contentNodes[0].cloneNode(true);
    } else if (contentNodes.length > 1) {
      // Wrap in a div to preserve structure
      const wrapper = document.createElement('div');
      contentNodes.forEach(n => wrapper.appendChild(n.cloneNode(true)));
      tabContent = wrapper;
    } else {
      // If no content nodes found, try to get all following siblings until next h2
      // Fallback: get all siblings until next h2
      tabContent = '';
    }
    return [label, tabContent];
  });

  // Table header
  const headerRow = ['Tabs (tabs11)'];
  const cells = [headerRow, ...tabRows];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
