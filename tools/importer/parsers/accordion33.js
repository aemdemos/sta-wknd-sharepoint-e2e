/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main contentfragment article
  const cfArticle = element.querySelector('article.contentfragment > article.cmp-contentfragment');
  if (!cfArticle) return;

  // Find the content elements container
  const cfElements = cfArticle.querySelector('.cmp-contentfragment__elements');
  if (!cfElements) return;

  // Get all direct children of the content elements container
  const children = Array.from(cfElements.children);

  // Find the first h2 (start of accordion items)
  let firstH2Idx = children.findIndex((c) => c.tagName === 'H2');
  if (firstH2Idx === -1) return;

  // We'll iterate and group by: h2 (title), then everything up to next h2 (content)
  const items = [];
  let i = firstH2Idx;
  while (i < children.length) {
    const node = children[i];
    if (node.tagName === 'H2') {
      const title = node.cloneNode(true);
      const contentNodes = [];
      i++;
      // Collect all nodes until next H2 or end
      while (i < children.length && children[i].tagName !== 'H2') {
        // Defensive: skip empty grid wrappers
        const isEmptyGrid = children[i].classList && children[i].classList.contains('aem-Grid');
        if (!isEmptyGrid) {
          contentNodes.push(children[i].cloneNode(true));
        }
        i++;
      }
      // If contentNodes is empty, fallback to empty string
      if (contentNodes.length === 1) {
        items.push([title, contentNodes[0]]);
      } else if (contentNodes.length > 1) {
        // Wrap multiple nodes in a div to preserve structure
        const wrapper = document.createElement('div');
        contentNodes.forEach(n => wrapper.appendChild(n));
        items.push([title, wrapper]);
      } else {
        items.push([title, '']);
      }
    } else {
      i++;
    }
  }

  // Table header: must match block name exactly
  const headerRow = ['Accordion (accordion33)'];
  const tableRows = [headerRow, ...items];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the entire contentfragment (not just the inner article) with the table
  const cfWrapper = cfArticle.closest('article.contentfragment');
  if (cfWrapper) {
    cfWrapper.replaceWith(table);
  } else {
    cfArticle.replaceWith(table);
  }
}
