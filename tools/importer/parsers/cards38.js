/* global WebImporter */
export default function parse(element, { document }) {
  // Find all skatepark card sections
  const cf = element.querySelector('.cmp-contentfragment__elements');
  if (!cf) return;

  // Find all skatepark h2 titles
  const h2s = Array.from(cf.querySelectorAll('h2.cmp-title__text'));
  if (!h2s.length) return;

  const headerRow = ['Cards (cards38)'];
  const rows = [headerRow];

  h2s.forEach(h2 => {
    // Find image after h2
    let img = null;
    let desc = null;
    let addr = null;
    // Find the closest .cmp-title, then walk siblings
    let block = h2.closest('.cmp-title');
    let el = block ? block.parentElement.nextElementSibling : null;
    // Find description <p>
    while (el && el.tagName !== 'P' && el.nextElementSibling) {
      el = el.nextElementSibling;
    }
    if (el && el.tagName === 'P') {
      desc = el.cloneNode(true);
      el = el.nextElementSibling;
    }
    // Find image
    while (el && (!el.querySelector || !el.querySelector('img')) && el.nextElementSibling) {
      el = el.nextElementSibling;
    }
    if (el && el.querySelector && el.querySelector('img')) {
      img = el.querySelector('img').cloneNode(true);
      el = el.nextElementSibling;
    }
    // Find address <p>
    while (el && el.tagName !== 'P' && el.nextElementSibling) {
      el = el.nextElementSibling;
    }
    if (el && el.tagName === 'P') {
      addr = el.cloneNode(true);
    }
    // --- NEW: Also include all <p> elements between h2 and next h2 ---
    // Find all <p> elements between this h2 and the next h2
    const textCell = [h2.cloneNode(true)];
    // Find the parent .cmp-contentfragment__elements
    let parent = h2.closest('.cmp-contentfragment__elements');
    // Start from h2, collect all <p> until next h2
    let walker = h2.parentElement.nextElementSibling;
    while (walker && (!walker.querySelector || !walker.querySelector('h2.cmp-title__text'))) {
      if (walker.tagName === 'P') {
        // Avoid duplicate desc/addr
        if (!desc || walker.outerHTML !== desc.outerHTML) {
          if (!addr || walker.outerHTML !== addr.outerHTML) {
            textCell.push(walker.cloneNode(true));
          }
        }
      }
      walker = walker.nextElementSibling;
    }
    // Add desc and addr if not already included
    if (desc && !textCell.some(n => n.outerHTML === desc.outerHTML)) textCell.push(desc);
    if (addr && !textCell.some(n => n.outerHTML === addr.outerHTML)) textCell.push(addr);
    // Only add row if image is present
    if (img) {
      rows.push([img, textCell]);
    }
  });

  if (rows.length > 1) {
    const block = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(block);
  }
}
