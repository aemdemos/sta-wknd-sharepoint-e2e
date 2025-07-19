/* global WebImporter */
export default function parse(element, { document }) {
  // Find required columns: main content (article) and sidebar
  // First, locate the top grid that contains the columns
  const mainGrid = element.querySelector('.cmp-container > .aem-Grid');
  if (!mainGrid) return;

  // Locate the main article column (8 grid columns)
  let mainArticle;
  const subMains = element.querySelectorAll('main.container.responsivegrid');
  for (const m of subMains) {
    if (m.classList.contains('aem-GridColumn--default--8')) {
      mainArticle = m;
      break;
    }
  }

  // Locate the sidebar (aside)
  const sidebar = element.querySelector('aside.container.responsivegrid');

  // Compose column 1: top image, breadcrumb, article titles and content, byline, etc
  const col1Content = [];

  // Top image (first .image block in the top grid)
  const imageDiv = mainGrid.querySelector('.image');
  if (imageDiv) col1Content.push(imageDiv);

  // Breadcrumb (optional)
  const breadcrumbDiv = mainGrid.querySelector('.breadcrumb');
  if (breadcrumbDiv) col1Content.push(breadcrumbDiv);

  // The article itself (mainArticle)
  if (mainArticle) {
    col1Content.push(mainArticle);
  }

  // Byline and social buttons (experience fragment)
  const bylineFragment = element.querySelector('.experiencefragment');
  if (bylineFragment) {
    col1Content.push(bylineFragment);
  }

  // Column 2: sidebar content (share/story, up next)
  const col2Content = [];
  if (sidebar) {
    col2Content.push(sidebar);
  }

  // Create the table structure
  const headerRow = ['Columns (columns33)'];
  const bodyRow = [col1Content, col2Content];
  const cells = [headerRow, bodyRow];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
