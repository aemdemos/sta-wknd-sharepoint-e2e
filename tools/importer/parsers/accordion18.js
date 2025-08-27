/* global WebImporter */
export default function parse(element, { document }) {
  // LOCATE CONTENTFRAGMENT ARTICLE BLOCK
  const cfArticle = element.querySelector('article.contentfragment article.cmp-contentfragment');
  if (!cfArticle) return;
  const cfBody = cfArticle.querySelector('.cmp-contentfragment__elements');
  if (!cfBody) return;
  // FIND ALL DIRECT CHILDREN IN THE BODY
  const children = Array.from(cfBody.children).filter(x => x.childNodes.length > 0 || x.textContent.trim());

  // EXTRACT ACCORDION ITEMS: Each section starts with a title h2,
  // followed by content nodes (p, images, etc) until next h2 or end
  let blocks = [];
  let currentTitle = null;
  let currentContent = [];
  const headerRow = ['Accordion (accordion18)'];

  function flushSection() {
    if (currentTitle && currentContent.length) {
      // Flatten if only one content node, else array
      blocks.push([
        currentTitle,
        currentContent.length === 1 ? currentContent[0] : currentContent
      ]);
    }
    currentTitle = null;
    currentContent = [];
  }

  for (let i = 0; i < children.length; i++) {
    const node = children[i];
    // Section header: Look for .cmp-title__text h2
    const h2 = node.querySelector && node.querySelector('.cmp-title__text') && node.querySelector('.cmp-title__text').tagName.toLowerCase() === 'h2'
      ? node.querySelector('.cmp-title__text')
      : (node.tagName && node.tagName.toLowerCase() === 'h2' ? node : null);
    if (h2) {
      flushSection();
      currentTitle = h2;
      continue;
    }
    // Otherwise, add node to currentContent
    currentContent.push(node);
  }
  flushSection();

  // EDGE CASE: If there are no blocks found, do not output a table
  if (blocks.length === 0) return;

  // STRUCTURE: Only one table, header first row, each accordion item as next rows
  const tableRows = [headerRow, ...blocks];

  // CREATE TABLE
  const table = WebImporter.DOMUtils.createTable(tableRows, document);

  // REPLACE THE ORIGINAL ELEMENT
  element.replaceWith(table);
}
