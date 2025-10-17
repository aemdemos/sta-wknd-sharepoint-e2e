/* global WebImporter */
export default function parse(element, { document }) {
  // Find the deepest grid containing the columns
  let grid = element.querySelector('.aem-Grid.aem-Grid--12');
  if (!grid) return;

  // Find the logo (image)
  const logoCol = grid.querySelector('.image.cmp-image--logo');

  // Find the navigation (center column)
  let navCol = grid.querySelector('.navigation.cmp-navigation--footer');
  let navContent = '';
  if (navCol) {
    // Extract all navigation links, including 'Deutsch' if present
    const navLinks = Array.from(navCol.querySelectorAll('.cmp-navigation__item-link'));
    const navDiv = document.createElement('div');
    navLinks.forEach(link => {
      navDiv.appendChild(link.cloneNode(true));
    });
    navContent = navDiv.childNodes.length ? navDiv : '';
  }

  // Find the Follow Us title and social buttons (right column)
  const followTitleCol = grid.querySelector('.title.cmp-title--right');
  const socialCol = grid.querySelector('.buildingblock.cmp-buildingblock--btn-list');
  let rightCol;
  if (followTitleCol && socialCol) {
    rightCol = document.createElement('div');
    rightCol.appendChild(followTitleCol.cloneNode(true));
    rightCol.appendChild(socialCol.cloneNode(true));
  } else if (followTitleCol) {
    rightCol = followTitleCol.cloneNode(true);
  } else if (socialCol) {
    rightCol = socialCol.cloneNode(true);
  } else {
    rightCol = '';
  }

  // Find the copyright text block (always at the bottom)
  const textBlock = grid.querySelector('.text.cmp-text--font-xsmall');
  let copyrightText = textBlock ? textBlock.cloneNode(true) : '';

  // Build the columns row
  // Always 3 columns: logo, navigation, right
  const columnsRow = [logoCol ? logoCol.cloneNode(true) : '', navContent, rightCol];

  // Copyright row must have three columns (empty except for last)
  const copyrightRow = ['', '', copyrightText];

  // Build the table rows
  const headerRow = ['Columns (columns9)'];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow,
    copyrightRow
  ], document);

  element.replaceWith(table);
}
