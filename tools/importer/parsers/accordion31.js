/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block requires a table with header row and 2 columns (title, content)
  // We'll extract accordion items: each item = [title, content]
  // Title = h2.cmp-title__text under .cmp-contentfragment__elements
  // Content = all siblings after title until next h2 or end of .cmp-contentfragment__elements

  const headerRow = ['Accordion (accordion31)'];
  const rows = [];

  // Find the main contentfragment article
  const mainArticle = element.querySelector('article.contentfragment');
  if (!mainArticle) return;
  const cfElements = mainArticle.querySelector('.cmp-contentfragment__elements');
  if (!cfElements) return;

  // We'll use child nodes (not just elements) to preserve structure
  const cfChildren = Array.from(cfElements.childNodes);

  // Find all h2 titles that are direct children (or in a .cmp-title as first child)
  // We'll build an array of {titleElement, index}
  const accordionTitles = [];
  for (let i = 0; i < cfChildren.length; i++) {
    const node = cfChildren[i];
    // h2 is sometimes wrapped in .cmp-title div
    if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.matches('.title')) {
        const h2 = node.querySelector('h2.cmp-title__text');
        if (h2) {
          accordionTitles.push({ titleElement: h2, index: i });
        }
      } else if (node.matches('h2.cmp-title__text')) {
        accordionTitles.push({ titleElement: node, index: i });
      }
    }
  }
  // If there are no h2s, do not proceed
  if (!accordionTitles.length) return;

  // For each accordion item, collect all content nodes between this h2 and the next one (or end)
  for (let t = 0; t < accordionTitles.length; t++) {
    const { titleElement, index } = accordionTitles[t];
    const start = index + 1;
    const end = (t + 1 < accordionTitles.length) ? accordionTitles[t + 1].index : cfChildren.length;
    // Gather content nodes (elements and non-empty text nodes)
    const contentNodes = [];
    for (let j = start; j < end; j++) {
      const node = cfChildren[j];
      // Ignore empty text nodes
      if (!node) continue;
      if (node.nodeType === Node.ELEMENT_NODE) {
        // Only include visible or meaningful elements
        if (
          (node.textContent && node.textContent.trim()) ||
          node.querySelector('img,blockquote')
        ) {
          contentNodes.push(node);
        }
      } else if (node.nodeType === Node.TEXT_NODE) {
        if (node.textContent.trim()) {
          contentNodes.push(node);
        }
      }
    }
    // If only one node, put the node, else use an array
    let contentCell;
    if (contentNodes.length === 1) {
      contentCell = contentNodes[0];
    } else if (contentNodes.length > 1) {
      contentCell = contentNodes;
    } else {
      contentCell = '';
    }
    rows.push([titleElement, contentCell]);
  }

  // Compose the cells array: header row first
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the entire element with the accordion table
  element.replaceWith(table);
}
