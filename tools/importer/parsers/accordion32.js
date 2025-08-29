/* global WebImporter */
export default function parse(element, { document }) {
  // This function expects 'element' to be the root of the accordion block.
  // We must output a table with header 'Accordion (accordion32)',
  // with each subsequent row being an accordion item: [title, content].
  // Each cell must dynamically reference existing nodes.

  const cells = [
    ['Accordion (accordion32)']
  ];

  // Find all possible accordion items: direct children with at least two children
  // Try to be robust to common AEM accordion structures: look for direct children
  const directChildren = Array.from(element.children);
  directChildren.forEach(item => {
    // Try to find the title and content
    // Title candidates: heading, button, summary, or any element with role="button"
    // Content: next sibling element or a div with a content class
    let title = null;
    let content = null;

    // Try as two direct child nodes
    if (item.children && item.children.length === 2) {
      const [maybeTitle, maybeContent] = item.children;
      // Accept if title looks like heading/button/summary
      if (maybeTitle.matches('button,summary,h1,h2,h3,h4,h5,h6,[role="button"]')) {
        title = maybeTitle;
        content = maybeContent;
      }
    }

    // Otherwise, try to find title/content within the item
    if (!title) {
      // Find title: first heading/button/summary
      title = item.querySelector(':scope > button, :scope > summary, :scope > h1, :scope > h2, :scope > h3, :scope > h4, :scope > h5, :scope > h6, :scope > [role="button"]');
      if (title) {
        // Try to find content: next sibling of title or a .accordion-content/content region
        content = title.nextElementSibling || item.querySelector(':scope > .accordion-content, :scope > .content, :scope > [role="region"]');
        // As fallback, if only title found, use all siblings after title as content
        if (!content) {
          const siblings = [];
          let sib = title.nextElementSibling;
          while (sib) {
            siblings.push(sib);
            sib = sib.nextElementSibling;
          }
          if (siblings.length > 0) content = siblings;
        }
      }
    }

    // If both title and content found, add to table
    if (title && content) {
      // If content is an array of elements, use as array
      cells.push([
        title,
        Array.isArray(content) ? content : [content]
      ]);
    }
  });

  // Edge case: If no items found, try to find accordion structure with 'accordion-item' class
  if (cells.length === 1) {
    const accItems = Array.from(element.querySelectorAll(':scope > .accordion-item'));
    accItems.forEach(accItem => {
      let title = accItem.querySelector(':scope > button, :scope > summary, :scope > h1, :scope > h2, :scope > h3, :scope > h4, :scope > h5, :scope > h6, :scope > [role="button"]');
      let content = accItem.querySelector(':scope > .accordion-content, :scope > .content, :scope > [role="region"]');
      if (title && content) {
        cells.push([title, content]);
      }
    });
  }

  // Only build the table if there is at least one item
  if (cells.length > 1) {
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  }
}
