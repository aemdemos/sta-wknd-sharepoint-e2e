/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block name
  const headerRow = ['Accordion (accordion33)'];
  const rows = [headerRow];

  // Locate the contentfragment/article containing the main headings and content
  let contentArticle = element.querySelector('article.contentfragment, article.cmp-contentfragment');
  if (!contentArticle) {
    contentArticle = element.querySelector('article');
  }
  if (!contentArticle) {
    // If no article, abort
    return;
  }

  // Get all direct children of cmp-contentfragment__elements
  let elementsWrapper = contentArticle.querySelector('.cmp-contentfragment__elements');
  if (!elementsWrapper) elementsWrapper = contentArticle;
  // We want to collect all accordion items as [title, content] pairs
  // We'll scan children and look for H2s, then collect all between them as content

  // Gather all children into array for easier sequential scan
  const children = Array.from(elementsWrapper.childNodes);
  let i = 0;
  while (i < children.length) {
    const node = children[i];
    if (node.nodeType === 1 && node.tagName === 'H2') {
      // Title cell is the h2 itself (reference)
      const titleCell = node;
      // Content is all nodes up to (but not including) next H2
      const contentEls = [];
      let j = i + 1;
      while (j < children.length) {
        const nextNode = children[j];
        if (nextNode.nodeType === 1 && nextNode.tagName === 'H2') break;
        // Only push if element node not empty grid, or text node is not all whitespace
        if (nextNode.nodeType === 1) {
          // Skip empty grid containers
          if (!(nextNode.classList && nextNode.classList.contains('aem-Grid'))) {
            contentEls.push(nextNode);
          }
        } else if (nextNode.nodeType === 3 && nextNode.textContent.trim().length) {
          // Preserve text nodes with actual content
          const span = document.createElement('span');
          span.textContent = nextNode.textContent;
          contentEls.push(span);
        }
        j++;
      }
      // If content is empty, put an empty string
      const contentCell = contentEls.length === 0 ? '' : (contentEls.length === 1 ? contentEls[0] : contentEls);
      rows.push([titleCell, contentCell]);
      i = j; // move to next H2
    } else {
      i++;
    }
  }

  // Only create accordion block if at least one section found
  if (rows.length > 1) {
    const block = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(block);
  }
}
