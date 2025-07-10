/* global WebImporter */
export default function parse(element, { document }) {
  // Find the two <main> elements under root
  const mainEls = element.querySelectorAll(':scope > main');
  // Find the <aside> (sidebar)
  const asideEl = element.querySelector(':scope > aside');

  // Defensive: ensure there are at least 2 mains and an aside
  if (mainEls.length < 2 || !asideEl) return;

  // The first <main> is the page wrapper, the second <main> is the main article column
  const mainContent = mainEls[1];
  // The <aside> is the sidebar column

  // The main content column: get the direct content container inside mainContent
  // It's usually: <main> > div > div (the innermost .cmp-container)
  let leftCol = null;
  const mainDiv = mainContent.querySelector(':scope > div');
  if (mainDiv) {
    // Find the .cmp-container child
    leftCol = mainDiv.querySelector(':scope > .cmp-container') || mainDiv.firstElementChild;
  } else {
    leftCol = mainContent;
  }

  // The right column: use aside's first content container
  let rightCol = asideEl.querySelector(':scope > div') || asideEl;

  // Compose the table
  const headerRow = ['Columns (columns9)'];
  const contentRow = [leftCol, rightCol];
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  element.replaceWith(table);
}
