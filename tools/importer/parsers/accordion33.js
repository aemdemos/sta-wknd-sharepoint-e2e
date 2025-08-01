/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content fragment article
  const mainArticle = element.querySelector('article.contentfragment > article.cmp-contentfragment');
  if (!mainArticle) return;
  
  // Get all children of the article
  const children = Array.from(mainArticle.children);

  // Helper: clean empty grid and grid columns
  const cleanContent = (arr) => arr.filter(el => {
    if (el.classList && el.classList.contains('aem-Grid') && el.children.length === 0) return false;
    if (el.classList && el.classList.contains('aem-GridColumn') && el.querySelectorAll('*').length === 0) return false;
    return true;
  });

  // Gather accordion rows
  // Always start with single header row (just one cell!)
  const rows = [ ['Accordion (accordion33)'] ];

  // Find intro content before first H2
  let idx = 0;
  const introContent = [];
  while (idx < children.length && children[idx].tagName !== 'H2') {
    const node = children[idx];
    if ((node.tagName === 'P') || (node.tagName === 'DIV' && node.querySelector('.cmp-image'))) {
      introContent.push(node);
    }
    idx++;
  }
  if (introContent.length) {
    rows.push([
      document.createTextNode('Introduction'),
      introContent.length === 1 ? introContent[0] : introContent
    ]);
  }

  // Collect each accordion item
  while (idx < children.length) {
    const node = children[idx];
    if (node.tagName === 'H2') {
      const title = node;
      idx++;
      const contentNodes = [];
      while (idx < children.length && children[idx].tagName !== 'H2') {
        const cont = children[idx];
        if ((cont.tagName === 'P') || (cont.tagName === 'DIV' && cont.querySelector('.cmp-image'))) {
          contentNodes.push(cont);
        }
        idx++;
      }
      const filteredContent = cleanContent(contentNodes);
      rows.push([
        title,
        filteredContent.length === 1 ? filteredContent[0] : filteredContent
      ]);
    } else {
      idx++;
    }
  }

  // Build the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  mainArticle.replaceWith(table);
}
