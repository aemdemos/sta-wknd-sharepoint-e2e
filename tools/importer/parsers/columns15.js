/* global WebImporter */
export default function parse(element, { document }) {
  // Build the block table header
  const cells = [['Columns (columns15)']];

  // Find the main content column (mainCol) and the hero image (heroImg)
  const mainCol = element.querySelector('main.container.responsivegrid.aem-GridColumn--default--8');
  const heroImg = element.querySelector('main.container.responsivegrid.cmp-layout-container--fixed .cmp-image');

  // Left cell content for the first row: collect all title and byline containers and the first introductory <p>
  let leftCell = [];
  if (mainCol) {
    // Get all .title blocks (should be two: main title and byline)
    const titles = mainCol.querySelectorAll('.title');
    titles.forEach(title => { leftCell.push(title); });
    // Find the first intro <p> in the contentfragment section
    const cfArticle = mainCol.querySelector('article.contentfragment');
    if (cfArticle) {
      const cfElements = cfArticle.querySelector('.cmp-contentfragment__elements');
      if (cfElements) {
        const firstP = cfElements.querySelector('p');
        if (firstP) leftCell.push(firstP);
      }
    }
  }

  cells.push([
    leftCell,
    heroImg
  ]);

  // The main surf spot content: gather the full .cmp-contentfragment__elements block to ensure all content is captured
  let surfContent = null;
  if (mainCol) {
    const cfArticle = mainCol.querySelector('article.contentfragment');
    if (cfArticle) {
      const cfElements = cfArticle.querySelector('.cmp-contentfragment__elements');
      if (cfElements) surfContent = cfElements;
    }
  }
  if (surfContent) {
    // Only add if not fully duplicated in previous cell
    cells.push([
      surfContent
    ]);
  }

  // Build the table and replace in DOM
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
