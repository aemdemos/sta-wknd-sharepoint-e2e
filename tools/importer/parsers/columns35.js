/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content area (the 8-column wide main content)
  const mainColumn = element.querySelector('main.container.responsivegrid.aem-GridColumn--default--8');
  // Find the aside sidebar (contains up next and share)
  const sidebar = element.querySelector('aside.container.responsivegrid.cmp-layoutcontainer--sidebar');

  if (!mainColumn) return;

  // Compose first column: Title(s), article content, author/byline card
  const contentColParts = [];
  // Titles (there may be more than one)
  const titleEls = mainColumn.querySelectorAll('.title');
  titleEls.forEach(t => contentColParts.push(t));
  // Main article (contentfragment)
  const article = mainColumn.querySelector('article.contentfragment');
  if (article) contentColParts.push(article);
  // Byline/author card (experiencefragment)
  const expFrag = mainColumn.querySelector('.experiencefragment');
  if (expFrag) contentColParts.push(expFrag);

  // Compose second column: the sidebar (Up Next, share, etc)
  const sidebarColParts = [];
  if (sidebar) sidebarColParts.push(sidebar);

  // Create the table cells structure
  const cells = [
    ['Columns (columns35)'],
    [contentColParts, sidebarColParts]
  ];

  // Create the block table and replace the original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
