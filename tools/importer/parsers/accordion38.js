/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the main contentfragment article
  const cfArticle = element.querySelector('article.contentfragment, .cmp-contentfragment');
  if (!cfArticle) return;
  // Use the .cmp-contentfragment__elements if present for inner content
  const elements = cfArticle.querySelector('.cmp-contentfragment__elements') || cfArticle;

  // Will collect accordion rows
  const accordionItems = [];
  let currentTitle = null;
  let currentContent = [];

  // Helper to finalize an accordion item
  function pushItem() {
    if (currentTitle && currentContent.length) {
      accordionItems.push([
        currentTitle,
        currentContent.length === 1 ? currentContent[0] : currentContent.slice(),
      ]);
    }
    currentTitle = null;
    currentContent = [];
  }

  // Prepare a list of relevant children (skip empty grids/divs)
  const children = Array.from(elements.childNodes).filter((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      // Skip empty grid wrappers
      const cls = node.className || '';
      if (/aem-Grid/.test(cls) && node.textContent.trim() === '') return false;
    }
    return true;
  });

  // Scan through top-level nodes to group accordion items
  for (let i = 0; i < children.length; i++) {
    const node = children[i];
    let h2 = null;
    // Section header can be in a .title h2, or direct h2.cmp-title__text inside a grid, or div
    if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.matches('div.title')) {
        h2 = node.querySelector('h2.cmp-title__text');
      } else if (node.matches('div.aem-Grid') && node.querySelector('h2.cmp-title__text')) {
        h2 = node.querySelector('h2.cmp-title__text');
      } else if (node.matches('h2.cmp-title__text')) {
        h2 = node;
      }
    }
    if (h2) {
      // Start new accordion section
      pushItem();
      currentTitle = h2;
      // Content may immediately follow as next node(s), so continue loop
      continue;
    } else {
      if (currentTitle) {
        // Group this node as part of current accordion item content
        currentContent.push(node);
      }
    }
  }
  // Final item
  pushItem();

  // Edge case: If no h2/cmp-title found, fallback to bold-initial <p> as section titles
  if (accordionItems.length === 0) {
    let pendingTitle = null;
    let pendingContent = [];
    for (const node of children) {
      if (
        node.nodeType === Node.ELEMENT_NODE &&
        node.tagName === 'P' &&
        node.querySelector('b') &&
        node.textContent.trim().startsWith(node.querySelector('b').textContent.trim())
      ) {
        // Treat leading <b> in <p> as section header
        if (pendingTitle && pendingContent.length) {
          accordionItems.push([
            pendingTitle,
            pendingContent.length === 1 ? pendingContent[0] : pendingContent.slice(),
          ]);
        }
        pendingTitle = node.querySelector('b');
        pendingContent = [node];
      } else {
        if (pendingTitle) {
          pendingContent.push(node);
        }
      }
    }
    if (pendingTitle && pendingContent.length) {
      accordionItems.push([
        pendingTitle,
        pendingContent.length === 1 ? pendingContent[0] : pendingContent.slice(),
      ]);
    }
  }

  // If still nothing, do not replace
  if (accordionItems.length === 0) return;

  // Build the block table as per requirements
  const cells = [
    ['Accordion (accordion38)'],
    ...accordionItems.map(([title, content]) => [title, content]),
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  cfArticle.replaceWith(table);
}
