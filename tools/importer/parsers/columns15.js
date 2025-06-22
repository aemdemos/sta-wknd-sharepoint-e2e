/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the main content column that contains the main article and surf spots
  let mainContentCol = null;
  const allContainers = element.querySelectorAll(':scope > div > div.cmp-container');
  for (const container of allContainers) {
    if (container.querySelector('.cmp-contentfragment')) {
      mainContentCol = container;
      break;
    }
  }
  if (!mainContentCol) return;

  // Get the title, byline, and content fragment
  const children = Array.from(mainContentCol.children);
  let titleBlock = null;
  let bylineBlock = null;
  let contentFragmentBlock = null;
  for (const child of children) {
    if (child.classList.contains('title') && !titleBlock) {
      titleBlock = child;
    } else if (child.classList.contains('title') && !bylineBlock) {
      bylineBlock = child;
    } else if (child.tagName.toLowerCase() === 'article' && child.classList.contains('contentfragment')) {
      contentFragmentBlock = child;
    }
  }
  if (!titleBlock || !bylineBlock || !contentFragmentBlock) return;

  // Get the contentfragment's .cmp-contentfragment root
  const cfRoot = contentFragmentBlock.querySelector('.cmp-contentfragment');
  if (!cfRoot) return;
  const cfTitle = cfRoot.querySelector('.cmp-contentfragment__title');
  const cfElements = cfRoot.querySelector('.cmp-contentfragment__elements');
  if (!cfElements) return;

  // Parse the intro paragraph and image, then the surf spots
  let introP = null;
  let introImgDiv = null;
  let surfSpotBlocks = [];
  let mode = 'intro';
  let currSpot = [];

  // We'll walk through all children of cfElements
  const cfEls = Array.from(cfElements.children);
  for (let i = 0; i < cfEls.length; i++) {
    const node = cfEls[i];
    if (mode === 'intro') {
      if (node.tagName && node.tagName.toLowerCase() === 'p' && !introP) {
        introP = node;
        // check next node for an image
        if (
          cfEls[i + 1] &&
          cfEls[i + 1].tagName &&
          cfEls[i + 1].tagName.toLowerCase() === 'div' &&
          cfEls[i + 1].querySelector('.cmp-image')
        ) {
          introImgDiv = cfEls[i + 1];
          i++; // skip this node in next loop
        }
        mode = 'surfspots';
      }
    } else if (mode === 'surfspots') {
      // The surf spots are in the format:
      // h2 (spot title), div (image)?, p (desc), ...
      if (node.tagName && node.tagName.toLowerCase() === 'h2') {
        // Push previous block if exists
        if (currSpot.length > 0) {
          surfSpotBlocks.push(currSpot);
        }
        currSpot = [node];
      } else if (
        node.tagName &&
        node.tagName.toLowerCase() === 'div' &&
        node.querySelector('.cmp-image')
      ) {
        currSpot.push(node);
      } else if (node.tagName && node.tagName.toLowerCase() === 'p') {
        currSpot.push(node);
      }
    }
  }
  if (currSpot.length > 0) {
    surfSpotBlocks.push(currSpot);
  }

  // Left column: header, byline, cfTitle, introP, introImgDiv
  const leftCol = [];
  if (titleBlock) leftCol.push(titleBlock);
  if (bylineBlock) leftCol.push(bylineBlock);
  if (cfTitle) leftCol.push(cfTitle);
  if (introP) leftCol.push(introP);
  if (introImgDiv) leftCol.push(introImgDiv);

  // Right column: all surfspot blocks, in order
  const rightCol = [];
  for (const spot of surfSpotBlocks) {
    rightCol.push(...spot);
  }

  // Table header row
  const headerRow = ['Columns (columns15)'];
  // Table content row
  const contentRow = [leftCol, rightCol];

  // Create the columns block table
  const table = WebImporter.DOMUtils.createTable([headerRow, contentRow], document);
  element.replaceWith(table);
}
