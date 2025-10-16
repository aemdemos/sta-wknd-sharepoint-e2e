/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards15) block: 2 columns, multiple rows, each card is image + text
  // Header row
  const headerRow = ['Cards (cards15)'];

  // Find the main contentfragment block (where cards are defined)
  const cf = element.querySelector('.cmp-contentfragment');
  if (!cf) return;

  // The actual card content is inside .cmp-contentfragment__elements
  const cfElements = cf.querySelector('.cmp-contentfragment__elements');
  if (!cfElements) return;

  // We'll parse the children of cfElements, looking for the card pattern:
  // Each card is: [h2 title] [image] [p description]
  // Sometimes image comes before h2, sometimes after

  // We'll scan through cfElements' children, grouping them into cards
  const cards = [];
  const children = Array.from(cfElements.children);

  // Helper to find next image and next paragraph after index
  function findNextImageAndParagraph(startIdx) {
    let imgEl = null;
    let descP = null;
    let imgIdx = -1;
    let pIdx = -1;
    for (let j = startIdx; j < children.length; j++) {
      const child = children[j];
      if (!child) continue;
      // Defensive: image may be nested deeper
      let imgDiv = null;
      if (!imgEl && child.querySelector) {
        imgDiv = child.querySelector('[data-cmp-is="image"]');
        if (imgDiv) {
          imgEl = imgDiv.querySelector('img');
          imgIdx = j;
        }
      }
      if (!descP && child.tagName === 'P') {
        descP = child;
        pIdx = j;
      }
      if (imgEl && descP) break;
    }
    return { imgEl, descP, imgIdx, pIdx };
  }

  // First card: intro image + intro paragraph
  // Find first image and first paragraph before first H2
  let firstH2Idx = children.findIndex((el) => el && el.tagName === 'H2');
  if (firstH2Idx > 0) {
    const { imgEl, descP } = findNextImageAndParagraph(0);
    if (imgEl && descP) {
      cards.push([imgEl, descP]);
    }
  }

  // Now process each card (starts with H2)
  let i = firstH2Idx;
  while (i < children.length) {
    const child = children[i];
    if (child && child.tagName === 'H2') {
      const titleEl = child;
      // Find next image and next paragraph after this H2
      const { imgEl, descP, imgIdx, pIdx } = findNextImageAndParagraph(i + 1);
      if (imgEl && descP) {
        cards.push([
          imgEl,
          [titleEl, descP]
        ]);
        // Move i to after the paragraph
        i = Math.max(imgIdx, pIdx) + 1;
        continue;
      }
    }
    i++;
  }

  // Defensive: If no cards found, abort
  if (cards.length === 0) return;

  // Compose table rows
  const rows = [headerRow, ...cards];
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the table
  element.replaceWith(table);
}
