/* global WebImporter */
export default function parse(element, { document }) {
  // Find the deepest grid container (holds the columns)
  function getDeepestGrid(el) {
    let curr = el;
    let grid = null;
    while (curr) {
      grid = curr.querySelector('.aem-Grid');
      if (grid) break;
      curr = Array.from(curr.children).find(child => child.classList && child.classList.contains('cmp-container'));
      if (!curr) break;
    }
    return grid;
  }

  const grid = getDeepestGrid(element);
  if (!grid) return;

  // Identify columns by class
  const logoCol = grid.querySelector('.cmp-image--logo');
  const navCol = grid.querySelector('.cmp-navigation--footer');
  const titleCol = grid.querySelector('.cmp-title--right');
  const socialCol = grid.querySelector('.cmp-buildingblock--btn-list');
  const textCol = grid.querySelector('.cmp-text--font-xsmall');

  // Compose the header row
  const headerRow = ['Columns (columns10)'];

  // 1. Logo column
  let logoCell = null;
  if (logoCol) {
    const logoImgBlock = logoCol.querySelector('[data-cmp-is="image"]');
    if (logoImgBlock) logoCell = logoImgBlock;
  }

  // 2. Navigation column (preserve hierarchy)
  let navCell = null;
  if (navCol) {
    const navBlock = navCol.querySelector('nav');
    if (navBlock) {
      // Create a fragment to preserve hierarchy
      const navFrag = document.createElement('div');
      // Get top-level navigation items
      const navGroups = navBlock.querySelectorAll('.cmp-navigation__group');
      if (navGroups.length) {
        // Only the first navGroup is top-level
        const topGroup = navGroups[0];
        const topItems = Array.from(topGroup.children).filter(child => child.classList && child.classList.contains('cmp-navigation__item'));
        topItems.forEach(topItem => {
          const topLink = Array.from(topItem.children).find(child => child.classList && child.classList.contains('cmp-navigation__item-link'));
          if (topLink) {
            navFrag.appendChild(topLink.cloneNode(true));
          }
          // Check for nested group
          const subGroup = Array.from(topItem.children).find(child => child.classList && child.classList.contains('cmp-navigation__group'));
          if (subGroup) {
            const subLinks = Array.from(subGroup.children).filter(child => child.classList && child.classList.contains('cmp-navigation__item'));
            if (subLinks.length) {
              const subNavDiv = document.createElement('div');
              subLinks.forEach(subItem => {
                const subLink = Array.from(subItem.children).find(child => child.classList && child.classList.contains('cmp-navigation__item-link'));
                if (subLink) subNavDiv.appendChild(subLink.cloneNode(true));
              });
              navFrag.appendChild(subNavDiv);
            }
          }
        });
      }
      navCell = navFrag.childNodes.length ? navFrag : null;
    }
  }

  // 3. Social column: title + social buttons
  let socialCell = null;
  const socialFrag = document.createElement('div');
  if (titleCol) {
    const titleBlock = titleCol.querySelector('.cmp-title');
    if (titleBlock) socialFrag.appendChild(titleBlock.cloneNode(true));
  }
  if (socialCol) {
    const socialGrid = socialCol.querySelector('.aem-Grid');
    if (socialGrid) {
      const buttons = Array.from(socialGrid.querySelectorAll('.cmp-button'));
      buttons.forEach(btn => socialFrag.appendChild(btn.cloneNode(true)));
    }
  }
  if (socialFrag.childNodes.length) socialCell = socialFrag;

  // Compose the second row
  const secondRow = [logoCell, navCell, socialCell];

  // Compose the third row: copyright/disclaimer text (single cell spanning all columns)
  let thirdRow = null;
  if (textCol) {
    const textBlock = textCol.querySelector('.cmp-text');
    if (textBlock) {
      thirdRow = [textBlock.cloneNode(true)];
    }
  }

  // Build the table rows
  const cells = [headerRow, secondRow];
  if (thirdRow) cells.push(thirdRow);

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // If the third row exists, set its cell to colspan to span all columns
  if (thirdRow && block.rows.length > 2) {
    const row = block.rows[2];
    if (row.cells.length === 1) {
      row.cells[0].setAttribute('colspan', secondRow.length);
    }
  }

  // Replace the original element
  element.replaceWith(block);
}
