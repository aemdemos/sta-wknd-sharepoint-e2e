/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content column (should be the content article area)
  // Usually the first <main.container> that's not a sidebar
  let mainContent = null;
  let sidebarContent = null;

  // There may be multiple main.container elements; identify main and sidebar
  const allMainContainers = Array.from(element.querySelectorAll(':scope > div > main.container, :scope > main.container'));

  // The sidebar usually has 'cmp-layoutcontainer--sidebar' class
  // The main content does not
  allMainContainers.forEach(cont => {
    if (cont.classList.contains('cmp-layoutcontainer--sidebar')) {
      sidebarContent = cont;
    } else {
      mainContent = cont;
    }
  });

  // Fallbacks if above logic fails
  if (!mainContent) {
    // Try to find a <main.container> that is not sidebar
    mainContent = element.querySelector('main.container:not(.cmp-layoutcontainer--sidebar)')
      || element.querySelector('main.container');
  }
  if (!sidebarContent) {
    sidebarContent = element.querySelector('aside.container.cmp-layoutcontainer--sidebar')
      || element.querySelector('aside.container');
  }

  // The content to go in the left column is all the direct children blocks of mainContent
  // We want to reference the actual elements, not their HTML.
  let leftCol = [];
  if (mainContent) {
    let children = Array.from(mainContent.children);
    // Some main containers wrap their content in a .cmp-container
    if (children.length === 1 && children[0].classList.contains('cmp-container')) {
      children = Array.from(children[0].children);
    }
    leftCol = children;
  }

  // The content to go in the right column (sidebar) is all direct children blocks of sidebarContent
  let rightCol = [];
  if (sidebarContent) {
    let children = Array.from(sidebarContent.children);
    // Sidebar content might also be inside a .cmp-container
    if (children.length === 1 && children[0].classList.contains('cmp-container')) {
      children = Array.from(children[0].children);
    }
    rightCol = children;
  }

  // Must have exactly two columns in the second row
  // If a column would be empty, use an empty string
  const secondRow = [ (leftCol.length ? leftCol : ['']), (rightCol.length ? rightCol : ['']) ];

  // Build the table rows
  const table = [
    ['Columns (columns35)'],
    secondRow
  ];

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(table, document);
  
  // Replace the target element
  element.replaceWith(block);
}
