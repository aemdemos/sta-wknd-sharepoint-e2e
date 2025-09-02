/* global WebImporter */
export default function parse(element, { document }) {
  // The Accordion block ('Accordion (accordion32)') expects:
  // - First row: header with the exact block name
  // - Following rows: [section title element, section content] where section content may include multiple elements
  // - All section content (text, images, etc) must be extracted, even if markup is irregular

  // Locate the main content area containing accordion sections
  let contentRoot = element.querySelector('article.contentfragment');
  if (!contentRoot) contentRoot = element;

  // Find all h2.cmp-title__text under the contentRoot (these are accordion titles)
  const h2s = Array.from(contentRoot.querySelectorAll('h2.cmp-title__text'));
  if (!h2s.length) return; // nothing to parse

  // Prepare table rows
  const cells = [['Accordion (accordion32)']];

  // For each h2 section heading, collect all subsequent siblings up to the next h2, making sure to include all text and media
  h2s.forEach((h2, idx) => {
    // The heading is always the h2 element
    let headingCell = h2;

    // Find the closest parent that is a direct child of contentRoot (covers varied structure)
    let container = h2.parentElement;
    while (container && container.parentElement !== contentRoot) {
      container = container.parentElement;
    }
    // Start collecting after the container
    let sectionContent = [];
    let node = container.nextSibling;
    while (node) {
      if (node.nodeType === 1) { // element node only
        // If another h2.cmp-title__text is found, stop
        if (node.querySelector && node.querySelector('h2.cmp-title__text')) break;
        // Only include elements with non-empty text or media
        if (
          node.textContent.trim() ||
          node.querySelector('img,picture,video,iframe')
        ) {
          sectionContent.push(node);
        }
      }
      node = node.nextSibling;
    }
    // If no content collected, try nextElementSibling method (covers flat structure)
    if (!sectionContent.length) {
      let n = container.nextElementSibling;
      while (n) {
        if (n.querySelector && n.querySelector('h2.cmp-title__text')) break;
        if (
          n.textContent.trim() ||
          n.querySelector('img,picture,video,iframe')
        ) {
          sectionContent.push(n);
        }
        n = n.nextElementSibling;
      }
    }
    // Ensure that all text content (including loose paragraphs) are included
    // Compose cell: string, element, or array as required
    let contentCell;
    if (!sectionContent.length) {
      contentCell = '';
    } else if (sectionContent.length === 1) {
      contentCell = sectionContent[0];
    } else {
      contentCell = sectionContent;
    }
    cells.push([headingCell, contentCell]);
  });

  // Create and replace with the accordion table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
