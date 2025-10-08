/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion (accordion16) block: 2 columns, multiple rows (title, content)
  // Header row
  const headerRow = ['Accordion (accordion16)'];

  // Find the main content area that contains the surf spots
  const cf = element.querySelector('article.cmp-contentfragment, article.contentfragment, .cmp-contentfragment');
  if (!cf) return;

  // The actual content is inside .cmp-contentfragment__elements
  const cfElements = cf.querySelector('.cmp-contentfragment__elements');
  if (!cfElements) return;

  // We'll collect all direct children of cfElements
  const nodes = Array.from(cfElements.childNodes).filter(n => {
    // Only keep element nodes and meaningful text nodes
    return n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim());
  });

  // Find the intro section (before the first h2)
  let introNodes = [];
  let introEndIdx = 0;
  for (let j = 0; j < nodes.length; j++) {
    if (nodes[j].nodeType === 1 && nodes[j].tagName.match(/^H2$/i)) {
      break;
    }
    // Only meaningful elements (p, img, or image container divs)
    if (
      (nodes[j].nodeType === 1 && (nodes[j].tagName === 'P' || nodes[j].querySelector('img')))
      || (nodes[j].nodeType === 3 && nodes[j].textContent.trim())
    ) {
      introNodes.push(nodes[j]);
    }
    introEndIdx = j + 1;
  }

  // Now, parse the accordion items
  // Each item starts with an h2 (the surf spot title), followed by images and paragraphs until the next h2 or end
  const rows = [];
  let i = introEndIdx;
  while (i < nodes.length) {
    const node = nodes[i];
    if (node.nodeType === 1 && node.tagName.match(/^H2$/i)) {
      // Start of an accordion item
      const title = node.cloneNode(true); // clone so we don't move the original
      const contentNodes = [];
      i++;
      // Collect all nodes until next h2 or end
      while (i < nodes.length && !(nodes[i].nodeType === 1 && nodes[i].tagName.match(/^H2$/i))) {
        // Skip empty divs with only grid classes
        if (nodes[i].nodeType === 1 && nodes[i].tagName === 'DIV') {
          // If the div contains images, keep it
          if (nodes[i].querySelector('img')) {
            contentNodes.push(nodes[i]);
          }
          // Otherwise, skip
        } else {
          contentNodes.push(nodes[i]);
        }
        i++;
      }
      // Defensive: if contentNodes is empty, add a blank paragraph
      if (contentNodes.length === 0) {
        const p = document.createElement('p');
        contentNodes.push(p);
      }
      rows.push([title, contentNodes]);
    } else {
      // Not an h2, skip (could be leftover)
      i++;
    }
  }

  // Build the table data
  const table = [headerRow];
  if (introNodes.length) {
    // Use the page title as the intro accordion title
    let pageTitle = element.querySelector('h1, .cmp-title__text');
    if (pageTitle) {
      pageTitle = pageTitle.cloneNode(true);
    } else {
      pageTitle = document.createElement('h2');
      pageTitle.textContent = 'Introduction';
    }
    table.push([pageTitle, introNodes]);
  }
  for (const row of rows) {
    table.push(row);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(table, document);
  // Replace the content fragment element with the block
  cf.replaceWith(block);
}
