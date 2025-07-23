/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main 8-column grid, which holds the article content
  const mainColumns = element.querySelector('main.container.responsivegrid.aem-GridColumn--default--8');
  if (!mainColumns) return;

  // Get the container inside the 8-column grid
  const contentContainer = mainColumns.querySelector('div.cmp-container');
  if (!contentContainer) return;

  // Get sidebar content
  const sidebar = element.querySelector('aside.container.responsivegrid.cmp-layoutcontainer--sidebar');

  // Get the main feature image (from the outermost 12-col grid)
  let mainImage = null;
  const outerGrids = element.querySelectorAll('.aem-Grid.aem-Grid--12');
  for (const grid of outerGrids) {
    const img = grid.querySelector('.image .cmp-image img');
    if (img) {
      mainImage = img;
      break;
    }
  }

  // Get the main article title (h1) and author subtitle (h4), inside the 8-col grid
  const title = mainColumns.querySelector('h1.cmp-title__text');
  const author = mainColumns.querySelector('h4.cmp-title__text');

  // Get the article body/contentfragment (article.contentfragment)
  const contentfragment = mainColumns.querySelector('article.contentfragment');

  // Byline/profile is in a .cmp-experiencefragment within the 8-col grid
  const byline = mainColumns.querySelector('.cmp-experiencefragment');

  // Build the left column: feature image, title, author, article content, byline (in order)
  const leftColumnContent = [];
  if (mainImage) leftColumnContent.push(mainImage);
  if (title) leftColumnContent.push(title);
  if (author) leftColumnContent.push(author);
  if (contentfragment) leftColumnContent.push(contentfragment);
  if (byline) leftColumnContent.push(byline);

  // Compose right column: sidebar (if present)
  const rightColumnContent = [];
  if (sidebar) rightColumnContent.push(sidebar);

  // Compose cells for the block table: header, then 2 columns (left, right)
  const cells = [
    ['Columns (columns35)'],
    [leftColumnContent, rightColumnContent]
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the whole top-level element (main.container) with the block
  element.replaceWith(block);
}
