/* global WebImporter */
export default function parse(element, { document }) {
  // Find the primary content/main and sidebar containers
  let leftCol = null;
  let rightCol = null;

  // The main layout consists of a root <main.container> with a main (8/12 cols) and aside (3/12 cols)
  // Find the first-level direct children that are <main ...> and <aside ...>
  const mainChildren = Array.from(element.children);
  for (const child of mainChildren) {
    if (
      child.tagName.toLowerCase() === 'main' &&
      child.classList.contains('container')
    ) {
      leftCol = child;
    }
    if (
      child.tagName.toLowerCase() === 'aside' &&
      child.classList.contains('container')
    ) {
      rightCol = child;
    }
  }

  // Fallbacks: if not found, look deeper for the first descendant main/aside.container
  if (!leftCol) {
    leftCol = element.querySelector('main.container');
  }
  if (!rightCol) {
    rightCol = element.querySelector('aside.container');
  }

  // If no sidebar present, create an empty placeholder
  if (!rightCol) {
    rightCol = document.createElement('div');
  }

  // Structure: Columns (columns32) block, two columns (main/aside)
  const headerRow = ['Columns (columns32)'];
  const contentRow = [leftCol, rightCol];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  element.replaceWith(table);
}
