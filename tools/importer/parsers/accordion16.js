/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main article contentfragment
  const mainContent = element.querySelector('article.contentfragment');
  if (!mainContent) return;

  // Find the block that holds the surf spots content
  const cfElements = mainContent.querySelector('.cmp-contentfragment__elements');
  if (!cfElements) return;

  // Get all its direct children (these include h2, div (with images), p, etc)
  const children = Array.from(cfElements.children);

  // Prepare the rows array
  const rows = [];
  // Header row (must match block name exactly)
  rows.push(['Accordion (accordion16)']);

  let i = 0;
  while (i < children.length) {
    const child = children[i];
    // Each accordion item starts with a h2 (section heading)
    if (/^H2$/i.test(child.tagName)) {
      const titleElem = child;
      // The content for this accordion is all elements up to the next h2
      let sectionContent = [];
      i++;
      while (i < children.length && !/^H2$/i.test(children[i].tagName)) {
        const contentNode = children[i];
        // Only add if contentNode has visible content
        // (skip empty div.aem-Grid etc)
        if (contentNode.tagName === 'P') {
          sectionContent.push(contentNode);
        } else if (contentNode.querySelector && contentNode.querySelector('.cmp-image')) {
          // This is a div containing an image block
          sectionContent.push(contentNode);
        }
        i++;
      }
      // Only add the row if there is content
      if (sectionContent.length > 0) {
        rows.push([titleElem, sectionContent]);
      } else {
        // If there is no content, still create the row with an empty cell
        rows.push([titleElem, '']);
      }
    } else {
      // Not an h2, skip
      i++;
    }
  }

  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }
}
