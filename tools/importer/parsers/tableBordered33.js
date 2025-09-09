/* global WebImporter */
export default function parse(element, { document }) {
  // Only operate if this is the correct tabpanel (Overview)
  if (!element.classList.contains('cmp-tabs__tabpanel')) return;

  // Header row as required
  const headerRow = ['Table (bordered, tableBordered33)'];

  // Find the main contentfragment inside this tabpanel
  const contentFragment = element.querySelector('article.cmp-contentfragment');
  if (!contentFragment) return;

  // The main content is inside .cmp-contentfragment__elements
  const elementsContainer = contentFragment.querySelector('.cmp-contentfragment__elements');
  if (!elementsContainer) return;

  // Create a wrapper div and move all children of elementsContainer into it
  const wrapper = document.createElement('div');
  Array.from(elementsContainer.childNodes).forEach(node => {
    wrapper.appendChild(node.cloneNode(true));
  });

  // Place the wrapper in a single cell
  const tableRows = [
    headerRow,
    [[wrapper]]
  ];

  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
