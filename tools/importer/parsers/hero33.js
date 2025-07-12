/* global WebImporter */
export default function parse(element, { document }) {
  // Header row must exactly match the example
  const headerRow = ['Hero (hero33)'];

  // 1. Extract background image: first .cmp-image img in the main .cmp-container's .aem-Grid
  let backgroundImg = null;
  const container = element.querySelector('.cmp-container');
  if (container) {
    const gridImg = container.querySelector('.aem-Grid .image .cmp-image img');
    if (gridImg) {
      backgroundImg = gridImg;
    }
  }

  // 2. Extract headline and byline (title and author)
  // Look for the first h1 and h4 inside the main content area
  let headline = null, subheading = null;
  // The main content is the second .cmp-container
  // Or the first one with a .title h1
  let mainCmpContainer = null;
  const cmpContainers = element.querySelectorAll('.cmp-container');
  for (const cmp of cmpContainers) {
    if (cmp.querySelector('h1')) {
      mainCmpContainer = cmp;
      break;
    }
  }
  if (mainCmpContainer) {
    const h1 = mainCmpContainer.querySelector('h1');
    if (h1) headline = h1;
    const h4 = mainCmpContainer.querySelector('h4');
    if (h4) subheading = h4;
  } else {
    // fallback
    const h1 = element.querySelector('h1');
    if (h1) headline = h1;
    const h4 = element.querySelector('h4');
    if (h4) subheading = h4;
  }

  // 3. Extract the main content fragment block (main article text and images, including quotes & headings)
  let contentElements = [];
  const contentFragment = element.querySelector('article.cmp-contentfragment');
  if (contentFragment) {
    // We'll collect direct children in cmp-contentfragment that are content elements, in document order
    // We want: headings (h2/h3/h4), paragraphs, blockquotes, divs (which often wrap images or quotes)
    // We want to include the whole content block as in the example, not just body text
    const elements = [];
    for (const node of contentFragment.childNodes) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const tag = node.tagName.toUpperCase();
        if (
          tag === 'P' ||
          tag === 'H2' || tag === 'H3' || tag === 'H4' ||
          tag === 'DIV' ||
          tag === 'BLOCKQUOTE'
        ) {
          elements.push(node);
        }
      }
    }
    contentElements = elements;
  }

  // Compose content cell for row 3: headline, subheading, then all main content elements
  const contentCell = [];
  if (headline) contentCell.push(headline);
  if (subheading) contentCell.push(subheading);
  if (contentElements.length > 0) contentCell.push(...contentElements);

  // Assemble the table as in the example (1 column, 3 rows)
  const cells = [
    headerRow,
    [backgroundImg ? backgroundImg : ''],
    [contentCell]
  ];

  // Create the table and replace the original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
