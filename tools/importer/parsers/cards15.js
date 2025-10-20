/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards15) block: 2 columns, multiple rows, each row = card (image + text)
  const headerRow = ['Cards (cards15)'];
  const rows = [headerRow];

  // Find the main contentfragment/article section
  const contentFragment = element.querySelector('.cmp-contentfragment__elements');
  if (!contentFragment) return;

  // Helper: get first image in a node (search recursively)
  function getFirstImage(el) {
    if (!el) return null;
    if (el.tagName === 'IMG') return el;
    return el.querySelector('img');
  }

  // Helper: get caption from image parent
  function getImageCaption(img) {
    if (!img) return '';
    const parent = img.parentElement;
    if (!parent) return '';
    const span = parent.querySelector('span[itemprop="caption"]');
    if (span) return span.textContent;
    const meta = parent.querySelector('meta[itemprop="caption"]');
    if (meta) return meta.getAttribute('content');
    return '';
  }

  // Helper: get all text content between two indexes, including images
  function getContentBetween(children, startIdx, endIdx, usedImg) {
    const frag = document.createDocumentFragment();
    for (let k = startIdx; k < endIdx; k++) {
      // If usedImg is set, skip that image node
      if (usedImg && getFirstImage(children[k]) === usedImg) continue;
      frag.appendChild(children[k].cloneNode(true));
    }
    return frag;
  }

  // Add intro card (before first H2)
  const children = Array.from(contentFragment.children);
  let firstH2Idx = children.findIndex((c) => c.tagName === 'H2');
  if (firstH2Idx > 0) {
    // Find first image before first H2
    let img = null;
    let caption = '';
    for (let k = 0; k < firstH2Idx; k++) {
      img = getFirstImage(children[k]);
      if (img) {
        caption = getImageCaption(img);
        break;
      }
    }
    const textCell = document.createElement('div');
    // Add all content before first H2 except the image
    const frag = getContentBetween(children, 0, firstH2Idx, img);
    textCell.appendChild(frag);
    if (caption) {
      const capDiv = document.createElement('div');
      capDiv.textContent = caption;
      textCell.appendChild(capDiv);
    }
    if (img) {
      rows.push([img, textCell]);
    } else {
      rows.push(['', textCell]);
    }
  }

  // Compose cards from contentFragment children (each H2 section)
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    if (child.tagName === 'H2') {
      // Find next heading (H2) or end
      let nextIdx = children.length;
      for (let j = i + 1; j < children.length; j++) {
        if (children[j].tagName === 'H2') {
          nextIdx = j;
          break;
        }
      }
      // Find first image in the section
      let img = null;
      let caption = '';
      for (let k = i + 1; k < nextIdx; k++) {
        img = getFirstImage(children[k]);
        if (img) {
          caption = getImageCaption(img);
          break;
        }
      }
      // Compose text cell: heading, caption, all text (except image used in image cell)
      const textCell = document.createElement('div');
      textCell.appendChild(child.cloneNode(true));
      if (caption) {
        const capDiv = document.createElement('div');
        capDiv.textContent = caption;
        textCell.appendChild(capDiv);
      }
      const frag = getContentBetween(children, i + 1, nextIdx, img);
      textCell.appendChild(frag);
      if (img) {
        rows.push([img, textCell]);
      } else {
        rows.push(['', textCell]);
      }
    }
  }

  // If only header row and all rows are empty, add fallback: all content
  if (rows.length === 1) {
    const textCell = document.createElement('div');
    textCell.appendChild(contentFragment.cloneNode(true));
    rows.push(['', textCell]);
  }

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
