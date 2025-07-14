/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid that contains the columns (footer content)
  const mainGrid = element.querySelector('.aem-Grid');
  if (!mainGrid) return;

  // Helper to get the first direct child div whose class contains a substring
  function getDivByClass(substr) {
    return Array.from(mainGrid.children).find(div => div.classList && Array.from(div.classList).some(cls => cls.includes(substr)));
  }

  // Get the logo/image column (first column)
  const logoDiv = getDivByClass('cmp-image--logo') || getDivByClass('cmp-image');
  let logoContent = null;
  if (logoDiv) {
    logoContent = logoDiv.querySelector('[data-cmp-is="image"]') || logoDiv;
  }

  // Get the navigation column (second column)
  const navDiv = getDivByClass('cmp-navigation--footer') || getDivByClass('cmp-navigation');
  let navContent = null;
  if (navDiv) {
    navContent = navDiv.querySelector('nav') || navDiv;
  }

  // Get the title column (third column)
  const titleDiv = getDivByClass('cmp-title--right') || getDivByClass('cmp-title');
  let titleContent = null;
  if (titleDiv) {
    titleContent = titleDiv.querySelector('.cmp-title') || titleDiv;
  }

  // Get the button list column (fourth column)
  const btnListDiv = getDivByClass('cmp-buildingblock--btn-list') || getDivByClass('cmp-buildingblock');
  let btnContent = null;
  if (btnListDiv) {
    btnContent = btnListDiv.querySelector('.aem-Grid') || btnListDiv;
  }

  // Compose the columns row (there must be 4 columns)
  // If a column is missing, fill with an empty string to preserve the four-column structure
  const columns = [logoContent, navContent, titleContent, btnContent].map(col => col || '');

  // Gather all .cmp-text--font-xsmall blocks below the columns
  const textDivs = Array.from(mainGrid.children).filter(div => div.classList && Array.from(div.classList).some(cls => cls.includes('cmp-text--font-xsmall')));
  // Each text block's core content is inside .cmp-text
  const textBlocks = textDivs.map(div => div.querySelector('.cmp-text') || div);

  // Compose the rows for the table
  const header = ['Columns (columns4)'];
  const rows = [header, columns];
  if (textBlocks.length > 0) {
    // Combine all text blocks into a single cell spanning all columns, as a single node array
    rows.push([textBlocks]);
  }

  // Create and replace with the new table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
