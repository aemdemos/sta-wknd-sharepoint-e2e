/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content area
  const main = element.querySelector('main.container');
  if (!main) return;

  // Find the sidebar and remove it from DOM so it is not duplicated
  const sidebar = element.querySelector('aside.container');
  let sidebarContent = null;
  if (sidebar) {
    sidebarContent = document.createElement('div');
    Array.from(sidebar.childNodes).forEach(node => sidebarContent.appendChild(node.cloneNode(true)));
    sidebar.remove(); // Remove sidebar from DOM to avoid duplication
  }

  // Find the main content column (the article)
  const left = main.querySelector('article.contentfragment');
  let leftContent = document.createElement('div');
  if (left) {
    const inner = left.querySelector('article');
    if (inner) {
      Array.from(inner.childNodes).forEach(node => leftContent.appendChild(node.cloneNode(true)));
    } else {
      Array.from(left.childNodes).forEach(node => leftContent.appendChild(node.cloneNode(true)));
    }
  }

  // Build the columns block table
  const headerRow = ['Columns (columns16)'];
  const contentRow = [leftContent, sidebarContent];
  const cells = [headerRow, contentRow];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the entire <main class="container ..."> with the block
  main.replaceWith(table);
}
