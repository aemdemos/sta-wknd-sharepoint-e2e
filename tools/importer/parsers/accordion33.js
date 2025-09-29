/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main article content
  const mainArticle = element.querySelector('article.contentfragment');
  if (!mainArticle) return;
  const contentRoot = mainArticle.querySelector('.cmp-contentfragment__elements');
  if (!contentRoot) return;

  // Find all h2 section titles (accordion items)
  const sectionTitles = Array.from(contentRoot.querySelectorAll('h2.cmp-title__text'));
  if (!sectionTitles.length) return;

  const headerRow = ['Accordion (accordion33)'];
  const rows = [headerRow];

  sectionTitles.forEach((titleEl, idx) => {
    // Title cell: use the h2 element directly
    const titleCell = titleEl;

    // Content cell: collect all elements after this h2 until the next h2 or end
    let parentDiv = titleEl.closest('.cmp-title');
    let node = parentDiv ? parentDiv.parentElement.nextElementSibling : null;
    const contentCellEls = [];
    while (node) {
      // Stop at next h2 section
      const h2 = node.querySelector && node.querySelector('h2.cmp-title__text');
      if (h2) break;
      // Skip layout containers
      if (node.classList && node.classList.contains('aem-Grid')) {
        node = node.nextElementSibling;
        continue;
      }
      // If node is a wrapping div with only one child, unwrap it
      if (node.tagName === 'DIV' && node.children.length === 1) {
        contentCellEls.push(node.firstElementChild);
      } else {
        contentCellEls.push(node);
      }
      node = node.nextElementSibling;
    }
    // Defensive: filter out nulls and undefined
    const filteredContent = contentCellEls.filter(Boolean).map(el => {
      // Remove unnecessary attributes from divs
      if (el.tagName === 'DIV') {
        const cleanDiv = document.createElement('div');
        // Instead of cloneNode, move all children to preserve text content
        while (el.firstChild) {
          cleanDiv.appendChild(el.firstChild);
        }
        return cleanDiv;
      }
      return el;
    });
    // If no content was found (e.g. due to too strict filtering), try to grab the next paragraph as fallback
    if (filteredContent.length === 0) {
      let fallback = parentDiv.parentElement.nextElementSibling;
      if (fallback && fallback.tagName === 'P') {
        filteredContent.push(fallback);
      }
    }
    // Only push row if there is content for the content cell
    if (filteredContent.length > 0) {
      rows.push([titleCell, filteredContent]);
    }
  });

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
