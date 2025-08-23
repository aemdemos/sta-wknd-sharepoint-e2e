/* global WebImporter */
export default function parse(element, { document }) {
  // Find the article contentfragment block
  const cf = element.querySelector('.contentfragment article.cmp-contentfragment');
  if (!cf) return;

  // Helper to get direct children
  function getChildren(parent) {
    return Array.from(parent.children || []);
  }

  // Helper to find next sibling paragraph
  function findNextParagraph(start, children) {
    let idx = children.indexOf(start) + 1;
    for (; idx < children.length; idx++) {
      if (children[idx].tagName === 'P') return children[idx];
    }
    return null;
  }

  // Helper to find image block after heading
  function findImageBlock(refNode, children) {
    let idx = children.indexOf(refNode) + 1;
    for (; idx < children.length; idx++) {
      const c = children[idx];
      const img = c.querySelector && c.querySelector('.cmp-image img');
      if (img) return c.querySelector('.cmp-image');
      // If this child is not an image block, keep searching
      // Stop if we hit another heading (that means no image)
      if (/^H\d$/.test(c.tagName)) break;
    }
    return null;
  }

  // Get the relevant container that holds cards content
  const cfElements = cf.querySelector('.cmp-contentfragment__elements');
  if (!cfElements) return;
  const cfContainers = getChildren(cfElements);
  // Find inner container with actual card content (the one with paragraphs and images)
  const mainBlock = cfContainers.find(
    b => getChildren(b).some(c => c.tagName === 'P' || (c.querySelector && c.querySelector('.cmp-image img')) || /^H\d$/.test(c.tagName))
  );
  if (!mainBlock) return;
  const mainChildren = getChildren(mainBlock);

  const cardRows = [];

  // First overview card: find image and first paragraph
  const firstImgBlock = mainChildren.find(c => c.querySelector && c.querySelector('.cmp-image img'));
  const firstImg = firstImgBlock ? firstImgBlock.querySelector('.cmp-image') : null;
  const firstPara = mainChildren.find(c => c.tagName === 'P');
  if (firstImg && firstPara) {
    cardRows.push([firstImg, firstPara]);
  }

  // Now process each surf spot
  for (let idx = 0; idx < mainChildren.length; idx++) {
    const child = mainChildren[idx];
    if (/^H\d$/.test(child.tagName)) {
      // Find image (if any)
      const imageEl = findImageBlock(child, mainChildren);
      // Find paragraph for this card
      const paraEl = findNextParagraph(child, mainChildren);
      // Compose text cell: heading + paragraph (if paragraph exists)
      const textCell = document.createElement('div');
      // Use consistent heading level for cards (h3 as per example)
      const heading = document.createElement('h3');
      heading.textContent = child.textContent;
      textCell.appendChild(heading);
      if (paraEl) {
        textCell.appendChild(paraEl);
      }
      // Prevent duplication in first overview card
      if (!(firstImg && firstPara && imageEl === firstImg && paraEl === firstPara)) {
        cardRows.push([imageEl ? imageEl : '', textCell]);
      }
    }
  }

  // Header row
  const headerRow = ['Cards (cards16)'];
  const cells = [headerRow, ...cardRows];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  cf.parentNode.replaceChild(block, cf);
}
