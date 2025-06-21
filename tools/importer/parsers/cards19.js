/* global WebImporter */
export default function parse(element, { document }) {
  // This function parses a block of cards (cards19) where each card has an image and text.
  // Find the main content area for the cards (skateparks) in the article

  const headerRow = ['Cards (cards19)'];
  const cells = [headerRow];

  // Find the main article content fragment area
  const contentFragment = element.querySelector('.cmp-contentfragment__elements');
  if (!contentFragment) return;

  // Find all card sections: each is a set: <h2> (title), <p> (desc), .cmp-image (image), <p> (address)
  // The structure is not perfectly regular, so use a robust approach
  // We'll use all h2.cmp-title__text as card start anchors

  const headings = Array.from(contentFragment.querySelectorAll('h2.cmp-title__text'));
  headings.forEach((h2) => {
    // 1. Title (h2)
    // 2. Description (first <p> after h2)
    // 3. Image (the first .cmp-image after h2 in siblings)
    // 4. Address (<p> with <b> inside after description or image)
    let desc = null;
    let image = null;
    let address = null;

    // Find first <p> after h2 (description)
    let next = h2.parentElement;
    while (next && (!desc || !image || !address)) {
      next = next.nextElementSibling;
      if (!next) break;
      // Description
      if (!desc && next.tagName.toLowerCase() === 'p') {
        desc = next;
        continue;
      }
      // Image
      if (!image) {
        const imgCont = next.querySelector && next.querySelector('.cmp-image');
        if (imgCont) {
          const img = imgCont.querySelector('img');
          if (img) image = img;
          continue;
        }
      }
      // Address (p > i > b or p > b)
      if (!address && next.tagName && next.tagName.toLowerCase() === 'p') {
        if (
          next.querySelector('b') &&
          (next.querySelector('i') || next.innerHTML.match(/<i>/))
        ) {
          address = next;
          continue;
        }
      }
    }
    // If address not found, look further ahead for address
    if (!address && desc) {
      let cursor = desc.nextElementSibling;
      let attempts = 0;
      while (cursor && attempts < 5) {
        if (
          cursor.tagName &&
          cursor.tagName.toLowerCase() === 'p' &&
          cursor.querySelector('b') &&
          (cursor.querySelector('i') || cursor.innerHTML.match(/<i>/))
        ) {
          address = cursor;
          break;
        }
        cursor = cursor.nextElementSibling;
        attempts++;
      }
    }
    // Compose the text cell: h2 + desc + address
    const textCell = [];
    if (h2) textCell.push(h2);
    if (desc) textCell.push(desc);
    if (address) textCell.push(address);

    // Only include cards with both image and text
    if (image && textCell.length) {
      cells.push([image, textCell]);
    }
  });

  // Only output the block if we found at least one card
  if (cells.length > 1) {
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  }
}
