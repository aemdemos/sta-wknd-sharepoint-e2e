/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main contentfragment article
  const cfArticle = element.querySelector('.contentfragment article.cmp-contentfragment');
  if (!cfArticle) return;
  const cfContent = cfArticle.querySelector('.cmp-contentfragment__elements');
  if (!cfContent) return;
  // All element children only
  const children = Array.from(cfContent.children);

  // Helper: Gather all images and text content between two indices (inclusive start, exclusive end)
  function extractImageAndText(startIdx, endIdx) {
    let image = null;
    const textEls = [];
    for (let i = startIdx; i < endIdx; i++) {
      const el = children[i];
      // Image: look for image inside a grid
      if (!image && el.tagName === 'DIV') {
        const img = el.querySelector('img');
        if (img) {
          image = img;
          continue;
        }
      }
      // Text: include all headings, paragraphs, and divs with non-image content
      if (
        el.tagName.startsWith('H') ||
        el.tagName === 'P' ||
        (el.tagName === 'DIV' && !el.querySelector('img') && el.textContent.trim())
      ) {
        textEls.push(el);
      }
    }
    return { image, textEls };
  }

  // Find all slide boundaries (H2 indices)
  const slideIndices = [];
  children.forEach((el, idx) => {
    if (el.tagName === 'H2') slideIndices.push(idx);
  });
  // Always add last index for boundary (for final slide)
  slideIndices.push(children.length);

  const cells = [['Carousel (carousel27)']];

  // 1. Handle intro block before any H2 (first slide)
  if(slideIndices[0] > 0) {
    const { image, textEls } = extractImageAndText(0, slideIndices[0]);
    if (image || textEls.length) {
      // If no image, but text exists, still add row (spec: image mandatory)
      if (image) {
        cells.push([image, textEls.length === 1 ? textEls[0] : textEls]);
      }
    }
  }

  // 2. Handle all slides after each H2
  for (let s = 0; s < slideIndices.length - 1; s++) {
    const h2Idx = slideIndices[s];
    const nextIdx = slideIndices[s + 1];
    // The H2 itself is a slide title, collect image/text from h2Idx to nextIdx
    const { image, textEls } = extractImageAndText(h2Idx, nextIdx);
    // Make sure to include the H2 itself as first text element in the cell
    const h2El = children[h2Idx];
    const textContent = [h2El, ...textEls.filter(e => e !== h2El)];
    if (image) {
      cells.push([image, textContent.length === 1 ? textContent[0] : textContent]);
    }
  }
  // Only build the table if there are slides
  if (cells.length > 1) {
    const block = WebImporter.DOMUtils.createTable(cells, document);
    cfArticle.replaceWith(block);
  }
}
