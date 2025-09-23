/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: extract accordion items from the main article content
  function extractAccordionItems(articleRoot) {
    const items = [];
    // Find the main contentfragment article
    const cfArticle = articleRoot.querySelector('article.contentfragment article.cmp-contentfragment');
    if (!cfArticle) return items;

    // Find the elements container
    const elementsRoot = cfArticle.querySelector('.cmp-contentfragment__elements');
    if (!elementsRoot) return items;

    // Find all section titles (h2s)
    const h2s = elementsRoot.querySelectorAll('h2');
    h2s.forEach(h2 => {
      // The section title is the h2
      // The content is everything after the h2 up to the next h2
      let contentNodes = [];
      let node = h2.parentElement.nextElementSibling;
      while (node && !node.querySelector('h2')) {
        // Only add if not empty
        if (node.textContent.trim() || node.querySelector('img')) {
          contentNodes.push(node);
        }
        node = node.nextElementSibling;
      }
      // If there is at least some content, add the item
      if (contentNodes.length) {
        items.push({ title: h2, content: contentNodes.length === 1 ? contentNodes[0] : contentNodes });
      }
    });
    return items;
  }

  // Find the main content area (the main responsivegrid > main)
  let mainContent = element.querySelector('main.container.responsivegrid');
  if (!mainContent) mainContent = element;

  // Extract accordion items
  const accordionItems = extractAccordionItems(mainContent);

  // Table header
  const headerRow = ['Accordion (accordion6)'];
  const rows = [headerRow];

  // For each accordion item, add a row: [title, content]
  accordionItems.forEach(({ title, content }) => {
    let titleCell = title;
    if (!titleCell || !(titleCell instanceof Element)) {
      titleCell = document.createElement('span');
      titleCell.textContent = title || '';
    }
    let contentCell = content;
    rows.push([titleCell, contentCell]);
  });

  // Only output table if there are accordion items
  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }
}
