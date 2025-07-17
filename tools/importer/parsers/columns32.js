/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid containing columns
  const grid = element.querySelector(':scope > .cmp-container > .aem-Grid');
  if (!grid) return;

  // Column 1: Main content/left column
  let leftContent = [];
  // Top image (hero)
  const heroImage = grid.querySelector('.image .cmp-image');
  if (heroImage) leftContent.push(heroImage);

  // Breadcrumb
  const breadcrumb = grid.querySelector('.breadcrumb nav.cmp-breadcrumb');
  if (breadcrumb) leftContent.push(breadcrumb);

  // Title(s)
  const mainTitle = grid.querySelector('.cmp-title h1');
  if (mainTitle) leftContent.push(mainTitle);
  const bylineTitle = grid.querySelector('.cmp-title h4');
  if (bylineTitle) leftContent.push(bylineTitle);

  // Main article content/content fragment
  const contentFragment = grid.querySelector('.cmp-contentfragment');
  if (contentFragment) leftContent.push(contentFragment);

  // Author bio + socials (experiencefragment)
  const experienceFragment = grid.querySelector('.cmp-experiencefragment');
  if (experienceFragment) leftContent.push(experienceFragment);

  // Column 2: Side bar (right column)
  let rightContent = [];
  const aside = element.querySelector('aside.container');
  if (aside) {
    // Select all sidebar blocks (share title, share buttons, up next list)
    const asideGrid = aside.querySelector('.aem-Grid');
    if (asideGrid) {
      Array.from(asideGrid.children).forEach(child => {
        rightContent.push(child);
      });
    }
  }

  // Compose table according to block spec
  // Header row must have only one cell
  const header = ['Columns (columns32)'];
  const row = [leftContent, rightContent];
  const cells = [header, row];

  // Patch: After table creation, merge the header cell across all columns
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Ensure the header row has a single th with correct colspan
  const headerRow = table.querySelector('tr:first-child');
  if (headerRow && headerRow.children.length === 1 && row.length > 1) {
    headerRow.children[0].setAttribute('colspan', row.length);
  }

  element.replaceWith(table);
}
