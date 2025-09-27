/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content article (contentfragment)
  const contentFragment = element.querySelector('article.contentfragment');
  if (!contentFragment) return;

  // Find the main title (h1)
  const mainTitle = element.querySelector('.cmp-title__text');
  // Find author (h4)
  const author = element.querySelectorAll('.cmp-title__text')[1];

  // Find all direct children of .cmp-contentfragment__elements
  const cfElements = contentFragment.querySelector('.cmp-contentfragment__elements');
  if (!cfElements) return;

  // We'll collect accordion items as [title, content] arrays
  const accordionRows = [];

  // Helper to collect all nodes up to the first h2
  function collectIntroContent(nodes) {
    const contentCell = document.createElement('div');
    for (const node of nodes) {
      if (node.nodeType === 1 && node.querySelector && node.querySelector('h2')) {
        break;
      }
      if (node.nodeType === 1 || node.nodeType === 3) {
        contentCell.appendChild(node.cloneNode(true));
      }
    }
    return contentCell;
  }

  // 1. First item: Article title & author as title, intro as content
  if (mainTitle) {
    const titleCell = document.createElement('div');
    titleCell.appendChild(mainTitle.cloneNode(true));
    if (author) {
      titleCell.appendChild(author.cloneNode(true));
    }
    // Compose the content cell: all elements up to the first section heading (h2)
    const introContent = collectIntroContent(cfElements.childNodes);
    accordionRows.push([titleCell, introContent]);
  }

  // 2. Subsequent items: for each section (h2), use h2 as title, following content as content
  // We'll scan cfElements' children, looking for h2s and grouping content after each
  const children = Array.from(cfElements.children);
  let i = 0;
  while (i < children.length) {
    const child = children[i];
    // Look for h2
    const h2 = child.querySelector && child.querySelector('h2');
    if (h2) {
      // Title cell: h2
      const titleCell = document.createElement('div');
      titleCell.appendChild(h2.cloneNode(true));
      // Content cell: everything after h2 up to next h2
      const contentCell = document.createElement('div');
      // Add all content in this child except h2
      for (const n of child.childNodes) {
        if (n.nodeType === 1 && n.tagName && n.tagName.toLowerCase() === 'h2') continue;
        contentCell.appendChild(n.cloneNode(true));
      }
      // Now, add all subsequent siblings until next h2
      let j = i + 1;
      while (j < children.length) {
        const nextH2 = children[j].querySelector && children[j].querySelector('h2');
        if (nextH2) break;
        contentCell.appendChild(children[j].cloneNode(true));
        j++;
      }
      accordionRows.push([titleCell, contentCell]);
      i = j;
    } else {
      i++;
    }
  }

  // Build the table rows
  const headerRow = ['Accordion (accordion25)'];
  const tableRows = [headerRow, ...accordionRows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  // Replace the original element
  element.replaceWith(block);
}
