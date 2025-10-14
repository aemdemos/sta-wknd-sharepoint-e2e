/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: find the topmost hero image and breadcrumb from the full page
  function getHeroAndBreadcrumb(el) {
    const cells = [];
    // Hero image (first .image img in the page)
    const heroImg = el.querySelector('.image img');
    if (heroImg) cells.push(heroImg.cloneNode(true));
    // Breadcrumb navigation
    const breadcrumb = el.querySelector('.breadcrumb nav');
    if (breadcrumb) cells.push(breadcrumb.cloneNode(true));
    return cells;
  }

  // Helper: extract main article content from the main column
  function extractMainContent(mainCol) {
    const cells = [];
    // Main title and byline
    const mainTitle = mainCol.querySelector('.title .cmp-title__text');
    if (mainTitle) cells.push(mainTitle.cloneNode(true));
    const byline = mainCol.querySelector('.title ~ .title .cmp-title__text');
    if (byline) cells.push(byline.cloneNode(true));
    // Main article contentfragment
    const cf = mainCol.querySelector('.contentfragment');
    if (cf) {
      const cfTitle = cf.querySelector('.cmp-contentfragment__title');
      if (cfTitle) cells.push(cfTitle.cloneNode(true));
      const cfElements = cf.querySelector('.cmp-contentfragment__elements');
      if (cfElements) {
        cfElements.childNodes.forEach(node => {
          if (node.nodeType === 1) {
            cells.push(node.cloneNode(true));
          }
        });
      }
    }
    // Author block (at bottom)
    const authorBlock = mainCol.querySelector('.cmp-byline');
    if (authorBlock) cells.push(authorBlock.cloneNode(true));
    // Social media buttons
    const socialBtns = mainCol.querySelectorAll('.cmp-button');
    if (socialBtns.length) {
      const btnsDiv = document.createElement('div');
      socialBtns.forEach(btn => btnsDiv.appendChild(btn.cloneNode(true)));
      cells.push(btnsDiv);
    }
    return cells;
  }

  // Helper: extract sidebar content for right column
  function extractSidebarContent(asideCol) {
    const cells = [];
    // SHARE THIS STORY
    const shareTitle = asideCol.querySelector('.cmp-title__text');
    if (shareTitle && shareTitle.textContent.includes('SHARE THIS STORY')) {
      cells.push(shareTitle.cloneNode(true));
    }
    // Sharing buttons (Facebook, Pinterest)
    const shareBtns = asideCol.querySelectorAll('.sharing .fb-share-button, .sharing a[data-pin-do]');
    if (shareBtns.length) {
      const shareDiv = document.createElement('div');
      shareBtns.forEach(btn => shareDiv.appendChild(btn.cloneNode(true)));
      cells.push(shareDiv);
    }
    // Download PDF block
    const downloadBlock = asideCol.querySelector('.cmp-download');
    if (downloadBlock) cells.push(downloadBlock.cloneNode(true));
    // Separator (horizontal rule)
    const separator = asideCol.querySelector('.separator .cmp-separator__horizontal-rule');
    if (separator) cells.push(separator.cloneNode(true));
    // Related articles list
    const relatedList = asideCol.querySelector('.cmp-list');
    if (relatedList) cells.push(relatedList.cloneNode(true));
    return cells;
  }

  // Find the main grid containing both main and sidebar columns
  let grid = element.querySelector('.aem-Grid.aem-Grid--12');
  if (!grid) {
    grid = element.querySelector('[class*="aem-Grid--12"]');
  }
  if (!grid) {
    grid = element;
  }

  // Find the main content column (left)
  let mainCol = grid.querySelector('main.container.responsivegrid');
  if (!mainCol) {
    mainCol = grid.querySelector('.aem-GridColumn--default--8');
  }
  if (!mainCol) {
    mainCol = Array.from(grid.children).find(c => c.tagName === 'MAIN' || c.classList.contains('aem-GridColumn--default--8') || c.classList.contains('aem-GridColumn--default--9'));
  }

  // Find the sidebar column (right)
  let asideCol = grid.querySelector('aside.container.responsivegrid');
  if (!asideCol) {
    asideCol = grid.querySelector('.aem-GridColumn--default--3');
  }
  if (!asideCol) {
    asideCol = Array.from(grid.children).find(c => c.tagName === 'ASIDE' || c.classList.contains('aem-GridColumn--default--3'));
  }

  // Defensive fallback: if not found, try first/second child
  if (!mainCol && grid.children.length > 0) mainCol = grid.children[0];
  if (!asideCol && grid.children.length > 1) asideCol = grid.children[1];

  // Compose the table
  const headerRow = ['Columns (columns19)'];
  const leftCells = [...getHeroAndBreadcrumb(element), ...(mainCol ? extractMainContent(mainCol) : [])];
  const rightCells = asideCol ? extractSidebarContent(asideCol) : [];
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    [leftCells, rightCells],
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
