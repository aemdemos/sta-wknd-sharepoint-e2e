/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main contentfragment article
  const cf = element.querySelector('article.contentfragment, .contentfragment, .cmp-contentfragment');
  if (!cf) return;

  // Find the content area inside the contentfragment
  const cfElements = cf.querySelector('.cmp-contentfragment__elements') || cf;

  // We'll collect accordion items as [title, content] pairs
  const accordionItems = [];

  // Helper: flatten nodes to array, removing empty divs
  function flattenNodes(nodes) {
    return Array.from(nodes).filter(n => {
      if (n.nodeType === Node.ELEMENT_NODE && n.tagName === 'DIV' && n.childNodes.length === 0) return false;
      if (n.nodeType === Node.TEXT_NODE && n.textContent.trim() === '') return false;
      return true;
    });
  }

  // Step 1: Gather all children, flattening out the structure
  // We'll collect all direct children of cfElements (including headings, paragraphs, images, etc)
  let children = [];
  cfElements.childNodes.forEach(node => {
    // Some nodes are divs that wrap a grid, which may wrap images
    if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'DIV') {
      // If the div contains a grid, flatten its children
      const grid = node.querySelector('.aem-Grid, .aem-Grid--12');
      if (grid) {
        children.push(...flattenNodes(grid.childNodes));
      } else {
        // If just a div with content, flatten its children
        children.push(...flattenNodes(node.childNodes));
      }
    } else {
      children.push(node);
    }
  });

  // Step 2: Parse intro (before first h2)
  let idx = 0;
  let introNodes = [];
  while (idx < children.length) {
    const node = children[idx];
    if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'H2') break;
    introNodes.push(node);
    idx++;
  }
  // Fix: intro should include all text and images before first h2, including nested images
  introNodes = introNodes.flatMap(n => {
    if (n.nodeType === Node.ELEMENT_NODE && n.tagName === 'DIV') {
      // If this is a div with images, extract images
      const imgs = n.querySelectorAll('img');
      if (imgs.length) return Array.from(imgs);
      // If div has other content, flatten
      return flattenNodes(n.childNodes);
    }
    return n;
  });
  introNodes = introNodes.filter(n => (n.nodeType !== Node.TEXT_NODE || n.textContent.trim() !== '') || (n.nodeType === Node.ELEMENT_NODE && n.tagName !== 'DIV'));
  if (introNodes.length) {
    accordionItems.push([
      'Introduction',
      introNodes.length === 1 ? introNodes[0] : introNodes
    ]);
  }

  // Step 3: Parse each accordion section (h2 + content until next h2 or end)
  while (idx < children.length) {
    // Find next h2
    let node = children[idx];
    if (!(node.nodeType === Node.ELEMENT_NODE && node.tagName === 'H2')) {
      idx++;
      continue;
    }
    // Title
    const title = node.textContent.trim();
    idx++;
    // Content: gather all nodes until next h2
    let sectionNodes = [];
    while (idx < children.length) {
      const n = children[idx];
      if (n.nodeType === Node.ELEMENT_NODE && n.tagName === 'H2') break;
      sectionNodes.push(n);
      idx++;
    }
    // Fix: section should include all text and images, including nested images
    sectionNodes = sectionNodes.flatMap(n => {
      if (n.nodeType === Node.ELEMENT_NODE && n.tagName === 'DIV') {
        const imgs = n.querySelectorAll('img');
        if (imgs.length) return Array.from(imgs);
        return flattenNodes(n.childNodes);
      }
      return n;
    });
    sectionNodes = sectionNodes.filter(n => (n.nodeType !== Node.TEXT_NODE || n.textContent.trim() !== '') || (n.nodeType === Node.ELEMENT_NODE && n.tagName !== 'DIV'));
    if (sectionNodes.length) {
      accordionItems.push([
        title,
        sectionNodes.length === 1 ? sectionNodes[0] : sectionNodes
      ]);
    }
  }

  // Step 4: Build table rows
  const headerRow = ['Accordion (accordion17)'];
  const tableRows = [headerRow];
  accordionItems.forEach(([title, content]) => {
    tableRows.push([title, content]);
  });

  // Step 5: Create and replace
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
