/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main contentfragment article
  const cfArticle = element.querySelector('.cmp-contentfragment');
  if (!cfArticle) return;
  // Find the elements container
  const cfElements = cfArticle.querySelector('.cmp-contentfragment__elements');
  if (!cfElements) return;

  // Collect all children
  const children = Array.from(cfElements.childNodes);
  const rows = [];
  const headerRow = ['Accordion (accordion33)'];
  rows.push(headerRow);

  // Find all h2s and build accordion rows
  for (let i = 0; i < children.length; i++) {
    const node = children[i];
    if (node.nodeType === 1 && node.tagName === 'H2') {
      // Title cell
      const titleEl = node.cloneNode(true);
      // Content cell: gather all siblings until next h2
      const contentEls = [];
      let j = i + 1;
      while (j < children.length && !(children[j].nodeType === 1 && children[j].tagName === 'H2')) {
        // Accept all element nodes except empty grid wrappers
        if (children[j].nodeType === 1) {
          // For DIV, only include if it contains images or non-empty text
          if (children[j].tagName === 'DIV') {
            const imgs = children[j].querySelectorAll('img');
            if (imgs.length > 0 || children[j].textContent.trim() !== '') {
              contentEls.push(children[j].cloneNode(true));
            }
          } else if (children[j].tagName === 'P' || children[j].tagName === 'IMG' || children[j].tagName === 'SPAN' || children[j].tagName === 'H3' || children[j].tagName === 'HR') {
            if (children[j].textContent.trim() !== '' || children[j].tagName === 'IMG') {
              contentEls.push(children[j].cloneNode(true));
            }
          }
        }
        j++;
      }
      // If no content found, try to grab the next sibling paragraph
      if (contentEls.length === 0 && children[i+1] && children[i+1].nodeType === 1 && children[i+1].tagName === 'P') {
        contentEls.push(children[i+1].cloneNode(true));
      }
      // Only add row if there is at least a title AND at least one content element
      if (titleEl && contentEls.length > 0) {
        let contentCell = contentEls.length === 1 ? contentEls[0] : contentEls;
        rows.push([titleEl, contentCell]);
      }
    }
  }

  // Always create table (even if only header)
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
