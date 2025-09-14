/* global WebImporter */
export default function parse(element, { document }) {
  // Find the 3-column grid inside the main container
  const grid = element.querySelector('.aem-Grid.aem-Grid--3');
  if (!grid) return;
  const columns = Array.from(grid.children);
  if (columns.length < 3) return;

  // LEFT COLUMN: Content fragment with details
  const leftCol = columns[0];
  const cfArticle = leftCol.querySelector('article.cmp-contentfragment');
  let leftContent = '';
  if (cfArticle) {
    // Extract all text from the details fragment
    const title = cfArticle.querySelector('.cmp-contentfragment__title');
    const dl = cfArticle.querySelector('.cmp-contentfragment__elements');
    let details = '';
    if (dl) {
      details = Array.from(dl.querySelectorAll('.cmp-contentfragment__element')).map(el => {
        const dt = el.querySelector('dt');
        const dd = el.querySelector('dd');
        return `<strong>${dt ? dt.textContent.trim() : ''}</strong> ${dd ? dd.textContent.trim() : ''}`;
      }).join('<br>');
    }
    leftContent = document.createElement('div');
    if (title) leftContent.appendChild(title.cloneNode(true));
    if (details) {
      const detailsDiv = document.createElement('div');
      detailsDiv.innerHTML = details;
      leftContent.appendChild(detailsDiv);
    }
  }

  // MIDDLE COLUMN: Overview tab panel content
  let overviewPanel = null;
  let overviewContent = '';
  // Find the tabs block (right of the columns)
  let tabsBlock = null;
  let parentGrid = grid.parentElement;
  let next = parentGrid.nextElementSibling;
  while (next) {
    if (next.classList.contains('tabs')) {
      tabsBlock = next;
      break;
    }
    next = next.nextElementSibling;
  }
  if (tabsBlock) {
    overviewPanel = tabsBlock.querySelector('.cmp-tabs__tabpanel--active');
    if (!overviewPanel) {
      overviewPanel = tabsBlock.querySelector('.cmp-tabs__tabpanel');
    }
    if (overviewPanel) {
      // Get main heading, image, caption, and description
      const h3 = overviewPanel.querySelector('h3');
      const imgDiv = overviewPanel.querySelector('.cmp-image');
      const img = imgDiv ? imgDiv.querySelector('img') : null;
      const caption = imgDiv ? imgDiv.querySelector('.cmp-image__title') : null;
      const desc = overviewPanel.querySelector('p');
      overviewContent = document.createElement('div');
      if (h3) overviewContent.appendChild(h3.cloneNode(true));
      if (img) overviewContent.appendChild(img.cloneNode(true));
      if (caption) overviewContent.appendChild(caption.cloneNode(true));
      if (desc) overviewContent.appendChild(desc.cloneNode(true));
    }
  }

  // Compose table rows
  const headerRow = ['Columns (columns30)'];
  // Only include columns with actual content
  const contentRow = [];
  if (leftContent && leftContent.textContent.trim()) contentRow.push(leftContent);
  if (overviewContent && overviewContent.textContent.trim()) contentRow.push(overviewContent);

  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
