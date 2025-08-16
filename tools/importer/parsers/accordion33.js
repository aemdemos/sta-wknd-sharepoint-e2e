/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header
  const headerRow = ['Accordion (accordion33)'];
  const rows = [headerRow];

  // Find the main contentfragment (it holds the surf spots and descriptions)
  const contentFragment = element.querySelector('.contentfragment');
  if (!contentFragment) return;
  // Get all direct children inside .cmp-contentfragment__elements
  const cfElements = contentFragment.querySelector('.cmp-contentfragment__elements');
  if (!cfElements) return;

  // We'll build arrays for titles and their content blocks
  // We want each accordion item to be [title, content], where title is the h2 and content is everything until the next h2

  const children = Array.from(cfElements.childNodes);
  let currentTitle = null;
  let currentContent = [];
  let hasAccordionItems = false;

  function addAccordionRow() {
    if (currentTitle) {
      // Remove any empty text nodes from currentContent
      currentContent = currentContent.filter(n => {
        if (n.nodeType === 3) return n.textContent.trim().length > 0;
        return true;
      });
      // If content is only one element, use that; else array
      rows.push([
        currentTitle,
        currentContent.length === 1 ? currentContent[0] : currentContent
      ]);
      hasAccordionItems = true;
    }
  }

  children.forEach((node, idx) => {
    if (node.nodeType === 1 && node.tagName === 'H2') {
      // If there's a previous item, push it to rows
      addAccordionRow();
      currentTitle = node;
      currentContent = [];
    } else if (currentTitle) {
      if (node.nodeType === 1) {
        // If it's a grid, flatten to grab its images
        if (node.classList.contains('aem-Grid')) {
          // grab all image blocks within the grid
          const imgs = node.querySelectorAll('.cmp-image');
          imgs.forEach(imgBlock => currentContent.push(imgBlock));
        } else {
          currentContent.push(node);
        }
      } else if (node.nodeType === 3 && node.textContent.trim().length > 0) {
        // Text nodes
        const span = document.createElement('span');
        span.textContent = node.textContent;
        currentContent.push(span);
      }
    }
  });
  // Add last item, if exists
  addAccordionRow();

  // Only replace if we found accordion items
  if (hasAccordionItems) {
    const blockTable = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(blockTable);
  }
}
