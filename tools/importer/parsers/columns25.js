/* global WebImporter */
export default function parse(element, { document }) {
  // Locate main content area (8-column main article grid)
  let mainColumn = element.querySelector('main.container > div > main.container');
  if (!mainColumn) {
    mainColumn = element.querySelector('main.container');
  }
  if (!mainColumn) return;

  // The main article container
  const cmpContainer = mainColumn.querySelector(':scope > div.cmp-container');
  if (!cmpContainer) return;

  // Get the two title blocks (title and byline)
  const titleBlocks = cmpContainer.querySelectorAll('.title .cmp-title__text');
  const title = titleBlocks[0] || '';
  const author = titleBlocks[1] || '';

  // Get the main article contentfragment
  const contentFragment = cmpContainer.querySelector('article.contentfragment');
  let content = [];
  if (contentFragment) {
    const elementsContainer = contentFragment.querySelector('.cmp-contentfragment__elements');
    if (elementsContainer) {
      // Collect all direct children of .cmp-contentfragment__elements
      content = Array.from(elementsContainer.childNodes).filter(node => {
        if (node.nodeType === 1) {
          return true;
        } else if (node.nodeType === 3) {
          return node.textContent.trim().length > 0;
        }
        return false;
      });
    }
  }

  // Compose the primary column: title, author, contentfragment content
  const primaryColumn = [];
  if (title) primaryColumn.push(title);
  if (author) primaryColumn.push(author);
  if (content.length) primaryColumn.push(...content);

  // Locate the sidebar (3-column aside)
  const sidebar = element.querySelector('aside.container');
  let sidebarContent = [];
  if (sidebar) {
    const sideCmpContainer = sidebar.querySelector('div.cmp-container');
    if (sideCmpContainer) {
      sidebarContent = Array.from(sideCmpContainer.children).filter(e => {
        return (e.innerText && e.innerText.trim().length > 0) || e.querySelector('*');
      });
    }
  }

  // Header row: single cell
  const headerRow = ['Columns'];
  // Content row: two columns
  const contentRow = [primaryColumn, sidebarContent];

  // Create the table with a single header cell row, and patch colspan directly
  const table = document.createElement('table');
  // Header row
  const trHeader = document.createElement('tr');
  const th = document.createElement('th');
  th.innerHTML = headerRow[0];
  th.colSpan = contentRow.length; // Ensures only one header cell spanning all content columns
  trHeader.appendChild(th);
  table.appendChild(trHeader);
  // Content row
  const trContent = document.createElement('tr');
  for (let i = 0; i < contentRow.length; i++) {
    const td = document.createElement('td');
    const cellContent = contentRow[i];
    if (Array.isArray(cellContent)) {
      td.append(...cellContent);
    } else if (typeof cellContent === 'string') {
      td.innerHTML = cellContent;
    } else if (cellContent) {
      td.append(cellContent);
    }
    trContent.appendChild(td);
  }
  table.appendChild(trContent);
  element.replaceWith(table);
}
