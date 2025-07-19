/* global WebImporter */
export default function parse(element, { document }) {
  // Find main content (left column)
  let mainColContent = null;
  const mainContainers = element.querySelectorAll('main.container');
  let maxCount = 0;
  mainContainers.forEach(main => {
    const cmp = main.querySelector('.cmp-container');
    if (cmp) {
      const count = cmp.querySelectorAll('p,article,img,div,figure,h1,h2,h3,h4,h5,h6').length;
      if (count > maxCount) {
        maxCount = count;
        mainColContent = cmp;
      }
    }
  });
  // Find sidebar content (right column)
  let sidebarColContent = null;
  const aside = element.querySelector('aside.container');
  if (aside) {
    sidebarColContent = aside.querySelector('.cmp-container') || aside;
  }
  // Defensive: blank div if not found
  if (!mainColContent) mainColContent = document.createElement('div');
  if (!sidebarColContent) sidebarColContent = document.createElement('div');

  // The createTable function will by default set the colspan of the header row to match the max columns in any row
  // To ensure the header row is a single cell and content row is two cells, use:
  const cells = [
    ['Columns (columns36)'], // header: 1 cell
    [mainColContent, sidebarColContent] // content: 2 cells
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
