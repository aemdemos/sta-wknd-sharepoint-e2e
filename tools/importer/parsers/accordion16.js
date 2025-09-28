/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract accordion items from the main article content
  function extractAccordionItems(contentRoot) {
    const items = [];
    // Find all h2 elements (section titles)
    const headings = Array.from(contentRoot.querySelectorAll('h2'));
    // For each h2, collect its content until the next h2
    headings.forEach((heading, idx) => {
      // Title cell: use the text content of the h2
      const titleCell = heading.textContent.trim();
      // Content cell: gather all siblings after this h2 until the next h2
      const contentNodes = [];
      let node = heading.nextSibling;
      while (node && !(node.nodeType === 1 && node.tagName === 'H2')) {
        if (node.nodeType === 1) {
          // If it's an image container, include the image element
          if (node.querySelector('.cmp-image__image')) {
            contentNodes.push(node);
          } else if (node.textContent.trim()) {
            contentNodes.push(node);
          }
        } else if (node.nodeType === 3 && node.textContent.trim()) {
          const p = document.createElement('p');
          p.textContent = node.textContent;
          contentNodes.push(p);
        }
        node = node.nextSibling;
      }
      items.push([titleCell, contentNodes]);
    });
    return items;
  }

  // Find the main contentfragment article
  const contentFragment = element.querySelector('.cmp-contentfragment__elements');
  if (!contentFragment) return;

  // Build table rows
  const rows = [];
  // Header row
  const headerRow = ['Accordion (accordion16)'];
  rows.push(headerRow);

  // Get intro content before first h2
  let introContent = [];
  let firstH2 = contentFragment.querySelector('h2');
  if (firstH2) {
    let node = contentFragment.firstChild;
    while (node && node !== firstH2) {
      if (node.nodeType === 1) {
        if (node.querySelector('.cmp-image__image')) {
          introContent.push(node);
        } else if (node.textContent.trim()) {
          introContent.push(node);
        }
      } else if (node.nodeType === 3 && node.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = node.textContent;
        introContent.push(p);
      }
      node = node.nextSibling;
    }
    if (introContent.length) {
      rows.push(['Introduction', introContent]);
    }
  }

  // Accordion items
  const accordionItems = extractAccordionItems(contentFragment);
  rows.push(...accordionItems);

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
