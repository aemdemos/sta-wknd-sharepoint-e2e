/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main contentfragment article
  const contentFragment = element.querySelector('.contentfragment article.cmp-contentfragment');
  if (!contentFragment) return;

  // Helper to extract accordion items in order
  function extractAccordionItems(cfEl) {
    const items = [];
    const elementsRoot = cfEl.querySelector('.cmp-contentfragment__elements');
    if (!elementsRoot) return items;
    // Find all h2 titles in order
    const h2s = Array.from(elementsRoot.querySelectorAll('h2.cmp-title__text'));
    h2s.forEach((h2, idx) => {
      // Title text
      const title = h2.textContent.trim();
      // Find the parent .cmp-title
      const titleBlock = h2.closest('.cmp-title');
      // Gather all siblings after this titleBlock until the next .cmp-title (h2)
      const contentNodes = [];
      let sib = titleBlock.parentElement.nextElementSibling;
      while (sib) {
        const nextH2 = sib.querySelector && sib.querySelector('h2.cmp-title__text');
        if (nextH2 && nextH2 !== h2) break;
        // Accept paragraphs, images, blockquotes, and any content node
        if (
          sib.tagName === 'P' ||
          sib.querySelector('blockquote') ||
          sib.querySelector('.cmp-image') ||
          sib.querySelector('img')
        ) {
          // For paragraphs, push all text content
          if (sib.tagName === 'P') {
            contentNodes.push(sib);
          } else {
            // For images/blockquotes, push all matching children
            sib.querySelectorAll('blockquote, .cmp-image, img').forEach(el => contentNodes.push(el));
          }
        }
        sib = sib.nextElementSibling;
      }
      // Defensive: If no content found, try to find next <p> after h2
      if (contentNodes.length === 0) {
        let nextP = titleBlock.parentElement.nextElementSibling;
        if (nextP && nextP.tagName === 'P') {
          contentNodes.push(nextP);
        }
      }
      // Only add row if content is present
      if (contentNodes.length > 0) {
        items.push([
          title,
          contentNodes.length === 1 ? contentNodes[0] : contentNodes
        ]);
      }
    });
    return items;
  }

  // Compose the table
  const headerRow = ['Accordion (accordion32)'];
  const accordionRows = extractAccordionItems(contentFragment);

  // Defensive: If no items found, fallback to a single section
  if (accordionRows.length === 0) {
    // Try to find all h2s and their following content
    const h2s = Array.from(contentFragment.querySelectorAll('h2.cmp-title__text'));
    h2s.forEach(h2 => {
      // Find next siblings until next h2
      const contentNodes = [];
      let sib = h2.parentElement.parentElement.nextElementSibling;
      while (sib && !sib.querySelector('h2.cmp-title__text')) {
        contentNodes.push(sib);
        sib = sib.nextElementSibling;
      }
      if (contentNodes.length > 0) {
        accordionRows.push([
          h2.textContent.trim(),
          contentNodes.length === 1 ? contentNodes[0] : contentNodes
        ]);
      }
    });
  }

  // Create the table
  const cells = [headerRow, ...accordionRows];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original contentfragment with the block
  contentFragment.replaceWith(block);
}
