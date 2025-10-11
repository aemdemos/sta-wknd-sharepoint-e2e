/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards16) block: 2 columns, multiple rows, each row = card (image + text)
  const contentFragment = element.querySelector('article.cmp-contentfragment');
  if (!contentFragment) return;
  const elementsContainer = contentFragment.querySelector('.cmp-contentfragment__elements');
  if (!elementsContainer) return;

  const headerRow = ['Cards (cards16)'];
  const cardRows = [];

  // Get all children for linear scan
  const children = Array.from(elementsContainer.children);

  // Find all h2 headings and their indices
  const headings = [];
  children.forEach((el, idx) => {
    if (el.tagName === 'H2') headings.push({ el, idx });
  });

  // Find intro image and all paragraphs before first h2
  let introImage = null;
  let introParagraphs = [];
  let firstH2Idx = headings.length > 0 ? headings[0].idx : children.length;
  for (let i = 0; i < firstH2Idx; i++) {
    if (!introImage && children[i].querySelector) {
      introImage = children[i].querySelector('div[data-cmp-is="image"]');
    }
    if (children[i].tagName === 'P') {
      introParagraphs.push(children[i]);
    }
  }
  if (introImage && introParagraphs.length) {
    cardRows.push([introImage, introParagraphs]);
  }

  // For each h2 (surf spot), find the next image and all paragraphs until the next h2
  headings.forEach((heading, idx) => {
    const h2 = heading.el;
    const h2Idx = heading.idx;
    const nextH2Idx = (idx + 1 < headings.length) ? headings[idx + 1].idx : children.length;
    // Find the first image after h2 and before next h2
    let image = null;
    for (let i = h2Idx + 1; i < nextH2Idx; i++) {
      if (!image && children[i].querySelector) {
        image = children[i].querySelector('div[data-cmp-is="image"]');
      }
    }
    // Gather all paragraphs after h2 and image, until next h2
    let textEls = [h2];
    let startIdx = h2Idx;
    if (image) {
      const imageIdx = children.findIndex(el => el.contains && el.contains(image));
      if (imageIdx > startIdx) startIdx = imageIdx;
    }
    for (let i = startIdx + 1; i < nextH2Idx; i++) {
      if (children[i].tagName === 'P') {
        textEls.push(children[i]);
      }
    }
    if (image && textEls.length) {
      cardRows.push([image, textEls]);
    }
  });

  // Build the table
  const tableCells = [headerRow, ...cardRows];
  const table = WebImporter.DOMUtils.createTable(tableCells, document);

  // Replace the element
  element.replaceWith(table);
}
