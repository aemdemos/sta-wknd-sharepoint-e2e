/* global WebImporter */
export default function parse(element, { document }) {
  // Find cmp-teaser or use element itself
  let cmpTeaser = element.querySelector('.cmp-teaser') || element;

  // Find image and content blocks
  const imageDiv = cmpTeaser.querySelector('.cmp-teaser__image');
  const contentDiv = cmpTeaser.querySelector('.cmp-teaser__content');

  // Manually build the table to ensure the header row is a single cell with colspan=2
  const table = document.createElement('table');

  // Header row: one cell only, spanning the two columns
  const headerTr = document.createElement('tr');
  const headerTh = document.createElement('th');
  headerTh.textContent = 'Columns (columns40)';
  headerTh.setAttribute('colspan', '2');
  headerTr.appendChild(headerTh);
  table.appendChild(headerTr);

  // Data row: two columns (image and content)
  const dataTr = document.createElement('tr');
  const tdImg = document.createElement('td');
  if (imageDiv) tdImg.appendChild(imageDiv);
  const tdContent = document.createElement('td');
  if (contentDiv) tdContent.appendChild(contentDiv);
  dataTr.appendChild(tdImg);
  dataTr.appendChild(tdContent);
  table.appendChild(dataTr);

  element.replaceWith(table);
}
