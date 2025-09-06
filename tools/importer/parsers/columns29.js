/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content column (ignore sidebar)
  const mainCol = element.querySelector('main.container > div > main.container');
  if (!mainCol) return;

  // Compose first column: main article (title, author, contentfragment)
  const mainArticleParts = [];
  // Title (h1)
  const mainTitle = mainCol.querySelector('.title .cmp-title h1');
  if (mainTitle) mainArticleParts.push(mainTitle.outerHTML);
  // Author (h4)
  const authorTitle = mainCol.querySelector('.title .cmp-title h4');
  if (authorTitle) mainArticleParts.push(authorTitle.outerHTML);
  // Contentfragment (article)
  const contentFragment = mainCol.querySelector('article.contentfragment');
  if (contentFragment) mainArticleParts.push(contentFragment.outerHTML);

  // Compose second column: author byline (experiencefragment)
  const authorByline = mainCol.querySelector('.experiencefragment');
  let authorBylineHTML = null;
  if (authorByline) authorBylineHTML = authorByline.outerHTML;

  // Compose columns array (only include non-empty columns)
  const columnsRow = [mainArticleParts.join('\n'), authorBylineHTML].filter(
    col => col && col.length > 0
  );

  // Table header (must match block name exactly)
  const headerRow = ['Columns (columns29)'];
  const cells = [headerRow, columnsRow];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
