/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main contentfragment article
  const cf = element.querySelector('article.contentfragment, article.cmp-contentfragment');
  if (!cf) return;

  // Get the main content area
  const cfElements = cf.querySelector('.cmp-contentfragment__elements') || cf;

  // Find all h2 titles (skatepark sections)
  const h2s = Array.from(cfElements.querySelectorAll('h2.cmp-title__text'));

  // Find all nodes before the first h2
  let introNodes = [];
  let node = cfElements.firstElementChild;
  let foundFirstH2 = false;
  while (node && !foundFirstH2) {
    if (node.querySelector && node.querySelector('h2.cmp-title__text')) {
      foundFirstH2 = true;
      break;
    }
    introNodes.push(node);
    node = node.nextElementSibling;
  }

  // Also include any .cmp-text blocks before first h2 (if not already included)
  const quoteBlocks = Array.from(cfElements.querySelectorAll('.cmp-text')).filter(el => {
    return el.compareDocumentPosition(h2s[0]) & Node.DOCUMENT_POSITION_PRECEDING;
  });
  quoteBlocks.forEach(qb => {
    if (!introNodes.includes(qb)) introNodes.push(qb);
  });

  // Remove any empty grid containers or empty divs from introNodes
  introNodes = introNodes.filter(n => {
    if (!n) return false;
    if (n.classList && n.classList.contains('aem-Grid') && n.textContent.trim() === '') {
      return false;
    }
    if (n.tagName === 'DIV' && n.childNodes.length === 0 && n.textContent.trim() === '') {
      return false;
    }
    if (n.tagName === 'DIV' && n.childNodes.length > 0) {
      let onlyEmptyGrids = true;
      n.childNodes.forEach(child => {
        if (!(child.classList && child.classList.contains('aem-Grid') && child.textContent.trim() === '')) {
          onlyEmptyGrids = false;
        }
      });
      if (onlyEmptyGrids) return false;
    }
    return true;
  });

  // Accordion rows: first row is header
  const headerRow = ['Accordion (accordion18)'];
  const rows = [headerRow];

  // First accordion item: intro
  const mainTitle = cf.querySelector('h3.cmp-contentfragment__title') || cf.querySelector('h1.cmp-title__text');
  let introTitle = mainTitle ? mainTitle.textContent.trim() : 'Introduction';
  let introContent = '';
  if (introNodes.length > 0) {
    introContent = document.createElement('div');
    introNodes.forEach(n => {
      if (n) introContent.appendChild(n.cloneNode(true));
    });
    if (introContent.textContent.trim() !== '') {
      rows.push([introTitle, introContent]);
    }
  }

  // For each skatepark section
  for (let i = 0; i < h2s.length; i++) {
    const h2 = h2s[i];
    const title = h2.textContent.trim();
    let contentNodes = [];
    // Start from the h2's parent (which is .cmp-title), then next siblings until next h2
    let n = h2.parentElement.nextElementSibling;
    while (n && !(n.querySelector && n.querySelector('h2.cmp-title__text'))) {
      // Stop if we hit a title
      if (n.tagName === 'DIV' && n.querySelector('h2.cmp-title__text')) break;
      contentNodes.push(n);
      n = n.nextElementSibling;
    }
    // Also include the h2 itself at the top of the content
    const contentDiv = document.createElement('div');
    contentDiv.appendChild(h2.cloneNode(true));
    contentNodes.forEach(node => {
      if (node) contentDiv.appendChild(node.cloneNode(true));
    });
    // Only add the row if contentDiv has meaningful content
    if (contentDiv.textContent.trim() !== '') {
      rows.push([title, contentDiv]);
    }
  }

  // Replace the original element with the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
