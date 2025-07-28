/* global WebImporter */
export default function parse(element, { document }) {
  // Get the left and right columns
  const teaserContent = element.querySelector('.cmp-teaser__content');
  const teaserImage = element.querySelector('.cmp-teaser__image');

  // Defensive fallback
  const left = teaserContent || document.createElement('div');
  const right = teaserImage || document.createElement('div');

  // Create the table manually to ensure the header row has colspan matching the number of columns (2)
  const table = document.createElement('table');

  // Header row with colspan=2
  const headerTr = document.createElement('tr');
  const headerTh = document.createElement('th');
  headerTh.setAttribute('colspan', '2');
  headerTh.textContent = 'Columns (columns20)';
  headerTr.appendChild(headerTh);
  table.appendChild(headerTr);

  // Content row with two columns
  const contentTr = document.createElement('tr');
  const tdLeft = document.createElement('td');
  const tdRight = document.createElement('td');
  tdLeft.append(left);
  tdRight.append(right);
  contentTr.appendChild(tdLeft);
  contentTr.appendChild(tdRight);
  table.appendChild(contentTr);

  element.replaceWith(table);
}
