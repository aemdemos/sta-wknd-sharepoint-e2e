/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main article content
  const article = element.querySelector('article.contentfragment');
  if (!article) return;

  // Get all .cmp-title__text elements (h2/h3)
  const sectionTitles = Array.from(article.querySelectorAll('h2.cmp-title__text, h3.cmp-title__text'));

  // Find all direct children for easier traversal
  const allNodes = Array.from(article.children);

  // Helper: find the index of a node in allNodes
  function nodeIdx(node) {
    // Accept either the title node itself or its parent .cmp-title
    let idx = allNodes.indexOf(node.closest('.cmp-title'));
    if (idx === -1) idx = allNodes.indexOf(node);
    return idx;
  }

  // Build accordion rows
  const rows = [];

  // Special: intro section before first heading
  if (sectionTitles.length > 0) {
    const firstIdx = nodeIdx(sectionTitles[0]);
    if (firstIdx > 0) {
      // Collect all content before first heading
      const introContent = [];
      for (let i = 0; i < firstIdx; i++) {
        const n = allNodes[i];
        if (n) {
          // Collect paragraphs, images, blockquotes, h4s
          if (n.matches && n.matches('p, blockquote, img, h4.cmp-title__text')) {
            introContent.push(n);
          } else {
            introContent.push(...n.querySelectorAll('p, blockquote, img, h4.cmp-title__text'));
          }
        }
      }
      // Remove empty nodes
      const filteredIntro = introContent.filter(el => {
        if (el.nodeType === Node.TEXT_NODE) return el.textContent.trim().length > 0;
        if (el.tagName === 'DIV' && el.innerText.trim().length === 0) return false;
        return true;
      });
      if (filteredIntro.length) {
        rows.push([sectionTitles[0], filteredIntro.length === 1 ? filteredIntro[0] : filteredIntro]);
      }
    }
  }

  // For each section, collect all content until the next section title
  sectionTitles.forEach((titleEl, idx) => {
    const startIdx = nodeIdx(titleEl);
    const nextTitleEl = sectionTitles[idx + 1];
    const endIdx = nextTitleEl ? nodeIdx(nextTitleEl) : allNodes.length;
    const contentNodes = [];
    for (let i = startIdx + 1; i < endIdx; i++) {
      const n = allNodes[i];
      if (n) {
        if (n.matches && n.matches('p, blockquote, img, h4.cmp-title__text')) {
          contentNodes.push(n);
        } else {
          contentNodes.push(...n.querySelectorAll('p, blockquote, img, h4.cmp-title__text'));
        }
      }
    }
    // Remove empty nodes
    const filteredContent = contentNodes.filter(el => {
      if (el.nodeType === Node.TEXT_NODE) return el.textContent.trim().length > 0;
      if (el.tagName === 'DIV' && el.innerText.trim().length === 0) return false;
      return true;
    });
    if (filteredContent.length) {
      rows.push([titleEl, filteredContent.length === 1 ? filteredContent[0] : filteredContent]);
    }
  });

  // Header row
  const headerRow = ['Accordion (accordion32)'];
  const tableRows = [headerRow, ...rows];

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
