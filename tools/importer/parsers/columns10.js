/* global WebImporter */
export default function parse(element, { document }) {
  // Find the deepest .aem-Grid (the grid containing the footer columns)
  const grid = element.querySelector('.aem-Grid.aem-Grid--12');
  if (!grid) return;

  // Identify columns by their class names
  let logoCol, navCol, followTitleCol, socialCol, textCol;
  Array.from(grid.children).forEach((col) => {
    const cls = col.className;
    if (cls.includes('cmp-image--logo')) {
      logoCol = col;
    } else if (cls.includes('cmp-navigation--footer')) {
      navCol = col;
    } else if (cls.includes('cmp-title--right')) {
      followTitleCol = col;
    } else if (cls.includes('cmp-buildingblock--btn-list')) {
      socialCol = col;
    } else if (cls.includes('cmp-text--font-xsmall')) {
      textCol = col;
    }
  });

  // Left column: logo, navigation links (preserve hierarchy and aria-current), copyright, description
  const leftColContent = [];
  if (logoCol) {
    const logo = logoCol.querySelector('img');
    if (logo) {
      // clone the anchor with the image
      const logoAnchor = logo.closest('a');
      leftColContent.push(logoAnchor ? logoAnchor.cloneNode(true) : logo.cloneNode(true));
    }
  }
  if (navCol) {
    // Get the nav structure and preserve hierarchy
    const nav = navCol.querySelector('nav');
    if (nav) {
      leftColContent.push(nav.cloneNode(true));
    }
  }
  if (textCol) {
    // Use the text block directly
    const textBlock = textCol.querySelector('.cmp-text');
    if (textBlock) leftColContent.push(textBlock.cloneNode(true));
  }

  // Right column: follow title + social buttons
  const rightColContent = [];
  if (followTitleCol) {
    const followTitle = followTitleCol.querySelector('.cmp-title__text');
    if (followTitle) {
      const h4 = document.createElement('h4');
      h4.textContent = followTitle.textContent;
      rightColContent.push(h4);
    }
  }
  if (socialCol) {
    // Get all social buttons
    const buttons = socialCol.querySelectorAll('a.cmp-button');
    if (buttons.length) {
      const btnDiv = document.createElement('div');
      btnDiv.style.display = 'flex';
      btnDiv.style.gap = '1em';
      buttons.forEach(btn => btnDiv.appendChild(btn.cloneNode(true)));
      rightColContent.push(btnDiv);
    }
  }

  const headerRow = ['Columns (columns10)'];
  const contentRow = [leftColContent, rightColContent];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  element.replaceWith(table);
}
