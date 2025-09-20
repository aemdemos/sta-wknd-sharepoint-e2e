/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main contentfragment article (contains the surf spots)
  const contentFragment = element.querySelector('.contentfragment article.cmp-contentfragment');
  if (!contentFragment) return;

  // Find the elements container inside the contentfragment
  const elementsContainer = contentFragment.querySelector('.cmp-contentfragment__elements');
  if (!elementsContainer) return;

  // We'll collect slide rows here
  const rows = [];

  // Always start with the block name header
  const headerRow = ['Carousel (carousel32)'];
  rows.push(headerRow);

  // We'll scan through the children of elementsContainer
  const children = Array.from(elementsContainer.children);

  // Helper to find the first image in a subtree
  function findImage(el) {
    if (!el) return null;
    // Try .image > .cmp-image > img
    const cmpImage = el.querySelector('.image .cmp-image');
    if (cmpImage) {
      const img = cmpImage.querySelector('img');
      if (img) return img;
    }
    // Try .cmp-image > img
    const cmpImage2 = el.querySelector('.cmp-image');
    if (cmpImage2) {
      const img = cmpImage2.querySelector('img');
      if (img) return img;
    }
    // Fallback: any img
    const img = el.querySelector('img');
    if (img) return img;
    return null;
  }

  // Helper to collect all text content (including headings, paragraphs, spans, etc.)
  function collectTextContent(startIdx, endIdx) {
    const content = [];
    for (let j = startIdx; j < endIdx; j++) {
      const node = children[j];
      if (findImage(node)) continue; // skip image wrappers
      // Only add if has visible text content
      if (node.textContent && node.textContent.trim()) {
        content.push(node);
      }
    }
    return content;
  }

  // Helper to find all slide images and their associated text
  for (let i = 0; i < children.length; i++) {
    const imageEl = findImage(children[i]);
    if (imageEl) {
      // Look backwards for the nearest heading (h2) and all text up to this image
      let textNodes = [];
      let titleNode = null;
      for (let j = i - 1; j >= 0; j--) {
        if (children[j].tagName && children[j].tagName.match(/^H[1-6]$/)) {
          titleNode = children[j];
          break;
        }
        if (children[j].textContent && children[j].textContent.trim()) {
          textNodes.unshift(children[j]);
        }
      }
      const cellContent = [];
      if (titleNode) cellContent.push(titleNode);
      cellContent.push(...textNodes);
      // Also check for a paragraph immediately after the image
      if (children[i+1] && children[i+1].tagName === 'P') {
        cellContent.push(children[i+1]);
      }
      // Only push a second cell if there is content
      if (cellContent.length) {
        rows.push([
          imageEl,
          cellContent
        ]);
      } else {
        rows.push([
          imageEl
        ]);
      }
    }
  }

  // Remove duplicate rows (by image src)
  const seen = new Set();
  const finalRows = [rows[0]];
  for (let i = 1; i < rows.length; i++) {
    const img = rows[i][0];
    const src = img && img.getAttribute ? img.getAttribute('src') : '';
    if (src && !seen.has(src)) {
      seen.add(src);
      finalRows.push(rows[i]);
    }
  }

  if (finalRows.length > 1) {
    const block = WebImporter.DOMUtils.createTable(finalRows, document);
    element.replaceWith(block);
  }
}
