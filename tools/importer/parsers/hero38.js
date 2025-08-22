/* global WebImporter */
export default function parse(element, { document }) {
  // --- HEADER ROW ---
  const headerRow = ['Hero (hero38)'];

  // --- IMAGE ROW ---
  // 1. Find a prominent image in the hero area
  let heroImg = null;
  // Prefer an image in the first .cmp-container > .aem-Grid > .image
  const heroImgCandidate = element.querySelector('.cmp-container .aem-Grid .image .cmp-image img');
  if (heroImgCandidate) {
    heroImg = heroImgCandidate;
  } else {
    // Fallback: first image in the element
    heroImg = element.querySelector('img');
  }

  // --- TEXT ROW ---
  // Compose all hero text: Heading, subheading/byline, intro text, etc.
  let heroTexts = [];
  // Find h1 (main headline)
  const h1 = element.querySelector('h1.cmp-title__text');
  if (h1) heroTexts.push(h1);
  // Find h4 (byline/subheading)
  const h4 = element.querySelector('h4.cmp-title__text');
  if (h4) heroTexts.push(h4);
  // Find the main contentfragment
  const contentfragment = element.querySelector('.contentfragment .cmp-contentfragment');
  if (contentfragment) {
    // The .cmp-contentfragment__elements contains the intro and any other text blocks
    const cfEls = contentfragment.querySelector('.cmp-contentfragment__elements');
    if (cfEls) {
      // Add all direct child elements, skipping empty .aem-Grid wrappers
      Array.from(cfEls.childNodes).forEach(node => {
        if (node.nodeType === 1) {
          // skip .aem-Grid wrappers that are empty
          if (node.classList.contains('aem-Grid') && !node.textContent.trim()) {
            return;
          }
          heroTexts.push(node);
        } else if (node.nodeType === 3 && node.textContent.trim()) {
          // non-empty text node (unlikely)
          heroTexts.push(document.createTextNode(node.textContent));
        }
      });
    }
  }
  // If no text content found, add empty string to avoid empty cell error
  if (heroTexts.length === 0) heroTexts = [''];

  // --- TABLE ---
  const imageRow = [heroImg];
  const textRow = [heroTexts];
  const cells = [headerRow, imageRow, textRow];

  // --- REPLACE ---
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
