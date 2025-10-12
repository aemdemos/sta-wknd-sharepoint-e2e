/* global WebImporter */
export default function parse(element, { document }) {
  // Find the deepest grid container with the actual footer content
  let grid;
  let containers = element.querySelectorAll('.aem-Grid');
  if (containers.length) {
    grid = containers[containers.length - 1];
  } else {
    grid = element;
  }

  // 1. Logo image (left column)
  let logoCell = '';
  const logoDiv = grid.querySelector('.image');
  if (logoDiv) {
    const imgBlock = logoDiv.querySelector('[data-cmp-is="image"]');
    if (imgBlock) {
      // Use the <img> tag directly for text extraction flexibility
      const img = imgBlock.querySelector('img');
      if (img) logoCell = img.cloneNode(true);
      else logoCell = imgBlock.cloneNode(true);
    } else {
      logoCell = logoDiv.cloneNode(true);
    }
  }

  // 2. Navigation links (second column)
  let navCell = document.createElement('div');
  const navDiv = grid.querySelector('.navigation');
  if (navDiv) {
    const nav = navDiv.querySelector('nav');
    if (nav) {
      // Extract all navigation links (level 0 and level 1)
      const links = nav.querySelectorAll('.cmp-navigation__item-link');
      links.forEach(link => navCell.appendChild(link.cloneNode(true)));
    }
  }
  // If still empty, get all <a> in navDiv
  if (!navCell.hasChildNodes() && navDiv) {
    const allLinks = navDiv.querySelectorAll('a');
    allLinks.forEach(link => navCell.appendChild(link.cloneNode(true)));
  }
  // If still empty, fallback to all <a> in grid
  if (!navCell.hasChildNodes()) {
    const allLinks = grid.querySelectorAll('a');
    allLinks.forEach(link => navCell.appendChild(link.cloneNode(true)));
  }
  if (!navCell.hasChildNodes()) navCell = '';

  // 3. Follow Us + Social icons (third column)
  let followCell = document.createElement('div');
  const titleDiv = grid.querySelector('.title');
  if (titleDiv) {
    const titleBlock = titleDiv.querySelector('.cmp-title');
    if (titleBlock) followCell.appendChild(titleBlock.cloneNode(true));
  }
  // Find the buildingblock for social buttons
  const btnListDiv = grid.querySelector('.buildingblock');
  if (btnListDiv) {
    // Extract all .button a elements (social links)
    const buttons = btnListDiv.querySelectorAll('.button a');
    buttons.forEach(btn => followCell.appendChild(btn.cloneNode(true)));
  }
  // If still empty, fallback to all <a> in btnListDiv
  if (!followCell.hasChildNodes() && btnListDiv) {
    const allLinks = btnListDiv.querySelectorAll('a');
    allLinks.forEach(link => followCell.appendChild(link.cloneNode(true)));
  }
  if (!followCell.hasChildNodes()) followCell = '';

  // 4. Footer text (fourth column)
  let textCell = document.createElement('div');
  // Get all .text blocks and include all their content
  const textDivs = Array.from(grid.querySelectorAll('.text'));
  if (textDivs.length) {
    textDivs.forEach(div => {
      // Clone all children and direct text nodes
      Array.from(div.childNodes).forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          textCell.appendChild(node.cloneNode(true));
        } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          textCell.appendChild(document.createTextNode(node.textContent));
        }
      });
    });
  }
  // If still empty, fallback to all <p> in grid
  if (!textCell.hasChildNodes()) {
    const allPs = grid.querySelectorAll('p');
    allPs.forEach(p => textCell.appendChild(p.cloneNode(true)));
  }
  // If still empty, fallback to all text content in the grid
  if (!textCell.hasChildNodes()) {
    textCell.textContent = grid.textContent;
  }
  if (!textCell.hasChildNodes() && !textCell.textContent.trim()) textCell = '';

  // Compose the table
  const headerRow = ['Columns (columns4)'];
  const contentRow = [logoCell, navCell, followCell, textCell];
  const cells = [headerRow, contentRow];

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
