/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header row
  const headerRow = ['Accordion (accordion38)'];

  // Find the main contentfragment article (holds the accordion sections)
  let cf = element.querySelector('article.cmp-contentfragment');
  if (!cf) return; // Nothing to process
  const frag = cf.querySelector('.cmp-contentfragment__elements');
  if (!frag) return;
  const fragChildren = Array.from(frag.childNodes);

  // Helper to skip whitespace text nodes
  const isNotEmpty = (node) => {
    return node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim());
  };

  // Find all skatepark section title divs (h2.cmp-title__text inside .cmp-title)
  // Each section starts with a grid div containing a .cmp-title__text
  const sectionIndices = [];
  fragChildren.forEach((node, idx) => {
    if (
      node.nodeType === 1 &&
      node.classList &&
      node.classList.contains('aem-Grid') &&
      node.querySelector('.cmp-title__text')
    ) {
      sectionIndices.push(idx);
    }
  });

  // Gather intro title and content before first section
  let introTitle = cf.querySelector('.cmp-contentfragment__title');
  const introRows = [];
  if (introTitle) {
    // Collect all fragChildren before first section index
    const firstIdx = sectionIndices.length > 0 ? sectionIndices[0] : fragChildren.length;
    // Remove the title node if present
    const introContent = [];
    for (let i = 0; i < firstIdx; i++) {
      const node = fragChildren[i];
      // Exclude the introTitle node
      if (node !== introTitle && isNotEmpty(node)) {
        introContent.push(node);
      }
    }
    if (introContent.length > 0) {
      introRows.push([introTitle, introContent]);
    }
  }

  // For each section, gather title and following content until next section
  const accordionRows = [];
  for (let s = 0; s < sectionIndices.length; s++) {
    const idx = sectionIndices[s];
    const node = fragChildren[idx];
    const title = node.querySelector('.cmp-title__text');
    // Content is all following nodes until next section start
    const content = [];
    let i = idx + 1;
    const nextSectionIdx = sectionIndices[s + 1] || fragChildren.length;
    while (i < nextSectionIdx) {
      if (isNotEmpty(fragChildren[i])) {
        content.push(fragChildren[i]);
      }
      i++;
    }
    accordionRows.push([title, content]);
  }

  // Compose the cells for table
  const cells = [headerRow, ...introRows, ...accordionRows];

  // Create and replace with the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
