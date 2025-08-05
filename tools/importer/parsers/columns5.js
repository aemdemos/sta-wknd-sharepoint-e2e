/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the main grid for the footer contents
  let mainGrid = element.querySelector('.aem-Grid.aem-Grid--12, .aem-Grid[class*="--12"]');
  if (!mainGrid) return;

  // 2. Get each major column by type
  // The columns: logo image, navigation, follow us title, social icons, copyright text
  const children = Array.from(mainGrid.children);

  // Logo image column
  const logoCol = children.find(div => div.classList.contains('cmp-image--logo'));
  let logoContent = null;
  if (logoCol) {
    logoContent = logoCol.querySelector('[data-cmp-is="image"]');
  }

  // Navigation column
  const navCol = children.find(div => div.classList.contains('cmp-navigation--footer'));
  let navContent = null;
  if (navCol) {
    navContent = navCol.querySelector('nav');
  }

  // Title column ("Follow Us")
  const titleCol = children.find(div => div.classList.contains('cmp-title--right'));
  let titleContent = null;
  if (titleCol) {
    titleContent = titleCol.querySelector('.cmp-title');
  }

  // Social icons/buttons
  const socialCol = children.find(div => div.classList.contains('cmp-buildingblock--btn-list'));
  let socialContent = null;
  if (socialCol) {
    // Use the aem-Grid that has the button links inside
    socialContent = socialCol.querySelector('.aem-Grid');
  }

  // Copyright and text column
  const textCol = children.find(div => div.classList.contains('cmp-text--font-xsmall'));
  let textContent = null;
  if (textCol) {
    textContent = textCol.querySelector('.cmp-text');
  }

  // The header row should be a single column (per the example)
  const headerRow = ['Columns (columns5)'];
  // The second row contains 5 columns
  const contentRow = [logoContent, navContent, titleContent, socialContent, textContent];

  // Only replace if at least one content cell exists
  if (contentRow.some(Boolean)) {
    const table = WebImporter.DOMUtils.createTable([headerRow, contentRow], document);
    element.replaceWith(table);
  }
}
