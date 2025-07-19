/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content column (contains the article)
  const mainCol = element.querySelector(
    'main.container.responsivegrid.aem-GridColumn--tablet--12.aem-GridColumn--offset--tablet--0.aem-GridColumn--default--none.aem-GridColumn--phone--none.aem-GridColumn--phone--12.aem-GridColumn--tablet--none.aem-GridColumn.aem-GridColumn--default--8.aem-GridColumn--offset--phone--0.aem-GridColumn--offset--default--0'
  );
  // Find the sidebar column (contains related links)
  const asideCol = element.querySelector('aside.container.responsivegrid.cmp-layoutcontainer--sidebar');

  // Left column: all main content (title, byline, contentfragment)
  const leftColumn = [];
  if (mainCol) {
    const h1 = mainCol.querySelector('.cmp-title h1');
    if (h1) leftColumn.push(h1);
    const h4 = mainCol.querySelector('.cmp-title h4');
    if (h4) leftColumn.push(h4);
    const article = mainCol.querySelector('article.contentfragment');
    if (article) leftColumn.push(article);
  }

  // Right column: minimal, just the related list from aside
  let rightColumn = '';
  if (asideCol) {
    const list = asideCol.querySelector('ul.cmp-list');
    if (list) rightColumn = list;
  }

  // Author byline block below the main content
  let authorByline = '';
  if (mainCol) {
    const byline = mainCol.querySelector('.experiencefragment');
    if (byline) authorByline = byline;
  }

  // Second row (below): author byline left, related list right (match example structure)
  const bottomRow = [authorByline, rightColumn];

  // The header row must have exactly one column, per example
  const cells = [
    ['Columns (columns17)'],
    [leftColumn, rightColumn],
    bottomRow
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
