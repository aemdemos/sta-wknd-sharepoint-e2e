/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main contentfragment article (where the accordion content is)
  const cf = element.querySelector('article.contentfragment');
  if (!cf) return;

  // Get the content fragment elements container
  const cfElems = cf.querySelector('.cmp-contentfragment__elements');
  if (!cfElems) return;

  const rows = [];
  const headerRow = ['Accordion (accordion33)'];
  rows.push(headerRow);

  // State for parsing
  let currentTitle = null;
  let currentContent = [];

  // Helper: add row if both title and content present
  function pushRow() {
    if (currentTitle && currentContent.length > 0) {
      // If content is only one element, use just that. Otherwise, use array.
      const contentCell = currentContent.length === 1 ? currentContent[0] : currentContent.slice();
      rows.push([currentTitle, contentCell]);
    }
    currentTitle = null;
    currentContent = [];
  }

  // Only iterate over direct children of cmp-contentfragment__elements
  const children = Array.from(cfElems.children);
  for (let i = 0; i < children.length; i++) {
    const node = children[i];
    if (node.tagName === 'H2') {
      // New accordion section
      pushRow();
      currentTitle = node;
    } else {
      // Only collect content if a heading was found before
      if (currentTitle) {
        // Accept any non-empty node as content, including divs with images, paragraphs, etc.
        // Do not filter out intentionally empty grid divs
        // Only push if there's actual content (image or text)
        if (
          (node.tagName === 'P' && node.textContent.trim()) ||
          (node.tagName === 'DIV' && (node.querySelector('.cmp-image') || node.textContent.trim()))
        ) {
          currentContent.push(node);
        }
      }
    }
  }
  // Add the last one
  pushRow();

  // Only create the accordion block table if there is more than the header row
  if (rows.length > 1) {
    const block = WebImporter.DOMUtils.createTable(rows, document);
    cf.replaceWith(block);
  }
}
