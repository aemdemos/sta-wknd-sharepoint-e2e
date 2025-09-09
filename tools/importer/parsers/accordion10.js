/* global WebImporter */
export default function parse(element, { document }) {
  // Find the deepest grid container with the actual footer content
  let grid;
  const gridCandidates = element.querySelectorAll('.aem-Grid.aem-Grid--12');
  if (gridCandidates.length > 0) {
    grid = gridCandidates[gridCandidates.length - 1];
  } else {
    grid = element;
  }

  // Get direct children of the grid
  const children = Array.from(grid.children);

  // Find logo (image)
  const logoDiv = children.find((el) => el.classList.contains('image'));
  let logo = null;
  if (logoDiv) {
    logo = logoDiv.querySelector('img');
    // If logo is wrapped in a link, use the link
    const logoLink = logoDiv.querySelector('a');
    if (logoLink) {
      logo = logoLink;
    }
  }

  // Find navigation
  const navDiv = children.find((el) => el.classList.contains('navigation'));
  let navigation = null;
  if (navDiv) {
    navigation = navDiv.querySelector('nav');
  }

  // Find "Follow Us" title
  const titleDiv = children.find((el) => el.classList.contains('title'));
  let followTitle = null;
  if (titleDiv) {
    followTitle = titleDiv.querySelector('.cmp-title__text');
  }

  // Find social buttons
  const btnListDiv = children.find((el) => el.classList.contains('cmp-buildingblock--btn-list'));
  let socialButtons = [];
  if (btnListDiv) {
    const btnGrid = btnListDiv.querySelector('.aem-Grid');
    if (btnGrid) {
      socialButtons = Array.from(btnGrid.querySelectorAll('a.cmp-button'));
    }
  }

  // Find copyright text
  const textDiv = children.find((el) => el.classList.contains('text'));
  let copyright = null;
  if (textDiv) {
    // Use the entire text block
    copyright = textDiv.querySelector('.cmp-text');
    if (!copyright) copyright = textDiv;
  }

  // Build the table rows
  const headerRow = ['Accordion (accordion10)'];

  // Accordion item 1: Logo and navigation
  const logoNavTitle = logo ? logo.querySelector('img')?.alt || logo.textContent?.trim() || 'Logo' : 'Logo';
  const logoNavCellTitle = logoNavTitle;
  const logoNavCellContent = [];
  if (logo) logoNavCellContent.push(logo);
  if (navigation) logoNavCellContent.push(navigation);

  // Accordion item 2: Follow Us and social buttons
  const followUsTitle = followTitle ? followTitle.textContent.trim() : 'Follow Us';
  const followUsCellContent = [];
  if (followTitle) followUsCellContent.push(followTitle);
  if (socialButtons.length > 0) followUsCellContent.push(...socialButtons);

  // Accordion item 3: Copyright and description
  const copyrightTitle = 'Copyright & Description';
  const copyrightCellContent = [];
  if (copyright) copyrightCellContent.push(copyright);

  // Compose the table
  const cells = [
    headerRow,
    [logoNavCellTitle, logoNavCellContent],
    [followUsTitle, followUsCellContent],
    [copyrightTitle, copyrightCellContent],
  ];

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
