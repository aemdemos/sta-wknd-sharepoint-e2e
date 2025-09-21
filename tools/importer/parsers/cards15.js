/* global WebImporter */
export default function parse(element, { document }) {
  const contentFragment = element.querySelector('.cmp-contentfragment__elements');
  if (!contentFragment) return;

  const headerRow = ['Cards (cards15)'];
  const rows = [headerRow];

  // Get all images in order
  const imageDivs = Array.from(contentFragment.querySelectorAll('.cmp-image'));

  // Get all headings and paragraphs in order
  const textEls = Array.from(contentFragment.querySelectorAll('h2, p'));

  // For each image, find the closest heading before and closest paragraph after
  imageDivs.forEach((imgDiv) => {
    // Find the closest heading before imgDiv
    let titleEl = null;
    let descEl = null;
    let node = imgDiv;
    while (node && node.previousElementSibling) {
      node = node.previousElementSibling;
      if (!titleEl && node.tagName && node.tagName.match(/^H[1-6]$/)) {
        titleEl = node;
        break;
      }
    }
    // Find the closest paragraph after imgDiv
    node = imgDiv;
    while (node && node.nextElementSibling) {
      node = node.nextElementSibling;
      if (!descEl && node.tagName === 'P') {
        descEl = node;
        break;
      }
      // Stop if another image or heading is found
      if (node.classList && node.classList.contains('cmp-image')) break;
      if (node.tagName && node.tagName.match(/^H[1-6]$/)) break;
    }
    // If no title before, try to find a paragraph before as intro
    if (!titleEl && !descEl) {
      node = imgDiv;
      while (node && node.previousElementSibling) {
        node = node.previousElementSibling;
        if (node.tagName === 'P') {
          descEl = node;
          break;
        }
      }
    }
    // Only add if we have both image and at least one text
    if (imgDiv && (titleEl || descEl)) {
      const textCell = document.createElement('div');
      if (titleEl) textCell.appendChild(titleEl.cloneNode(true));
      if (descEl) textCell.appendChild(descEl.cloneNode(true));
      rows.push([imgDiv.cloneNode(true), textCell]);
    }
  });

  // If no card rows found, fallback: try to use main intro image and text
  if (rows.length === 1) {
    const mainImg = element.querySelector('.cmp-image');
    const mainTitle = element.querySelector('h1, h2, h3');
    const mainDesc = element.querySelector('p');
    if (mainImg && (mainTitle || mainDesc)) {
      const textCell = document.createElement('div');
      if (mainTitle) textCell.appendChild(mainTitle.cloneNode(true));
      if (mainDesc) textCell.appendChild(mainDesc.cloneNode(true));
      rows.push([mainImg.cloneNode(true), textCell]);
    }
  }

  if (rows.length > 1) {
    const block = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(block);
  }
}
