/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid containing left (main) and right (sidebar) columns
  const outerGrid = element.querySelector(':scope > .cmp-container > .aem-Grid');
  if (!outerGrid) return;

  // Find left (main) and right (sidebar) columns
  let mainCol = null;
  let asideCol = null;
  const mainContainers = outerGrid.querySelectorAll(':scope > main.container.responsivegrid, :scope > aside.container.responsivegrid');
  for (const node of mainContainers) {
    if (node.tagName.toLowerCase() === 'main') mainCol = node;
    if (node.tagName.toLowerCase() === 'aside') asideCol = node;
  }
  if (!mainCol) return;

  // Collect main column content
  const mainColumnContent = [];
  let heroImageDiv = mainCol.querySelector('.image .cmp-image');
  if (!heroImageDiv) heroImageDiv = outerGrid.querySelector('.image .cmp-image');
  if (heroImageDiv) mainColumnContent.push(heroImageDiv);

  const breadcrumbDiv = mainCol.querySelector('.breadcrumb') || outerGrid.querySelector('.breadcrumb');
  if (breadcrumbDiv) mainColumnContent.push(breadcrumbDiv);

  const titleDivs = mainCol.querySelectorAll('.title');
  titleDivs.forEach(div => mainColumnContent.push(div));

  const contentFragment = mainCol.querySelector('article.contentfragment');
  if (contentFragment) mainColumnContent.push(contentFragment);

  // Sidebar column content
  const sidebarColumnContent = [];
  if (asideCol) {
    const shareTitle = asideCol.querySelector('.title');
    if (shareTitle) sidebarColumnContent.push(shareTitle);
    const sharingDiv = asideCol.querySelector('.sharing');
    if (sharingDiv) sidebarColumnContent.push(sharingDiv);
    const upNextList = asideCol.querySelector('.cmp-list');
    if (upNextList) sidebarColumnContent.push(upNextList);
  }

  // Manually build the table to ensure header is a single cell spanning all columns
  const table = document.createElement('table');

  // Header row (one cell spanning both columns)
  const headerTr = document.createElement('tr');
  const th = document.createElement('th');
  th.textContent = 'Columns (columns32)';
  th.colSpan = 2;
  headerTr.appendChild(th);
  table.appendChild(headerTr);

  // Content row (two columns)
  const contentTr = document.createElement('tr');

  const td1 = document.createElement('td');
  mainColumnContent.forEach(el => td1.append(el));
  contentTr.appendChild(td1);

  const td2 = document.createElement('td');
  sidebarColumnContent.forEach(el => td2.append(el));
  contentTr.appendChild(td2);

  table.appendChild(contentTr);
  
  element.replaceWith(table);
}
