/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main contentfragment article (the main story)
  const contentFragment = element.querySelector('.contentfragment');
  if (!contentFragment) return;

  // Find the main title (h1) and subtitle (h4)
  const mainTitle = contentFragment.querySelector('h1');
  const subtitle = contentFragment.querySelector('h4');

  // Find all elements inside .cmp-contentfragment__elements
  const elementsContainer = contentFragment.querySelector('.cmp-contentfragment__elements');
  if (!elementsContainer) return;
  const children = Array.from(elementsContainer.children);

  // Helper: flatten all paragraphs, blockquotes, and nested grids inside a wrapper
  function extractContentNodes(node) {
    const nodes = [];
    if (!node) return nodes;
    if (node.matches('p, blockquote, h2, h3, h4, h5, h6, img, figure')) {
      nodes.push(node.cloneNode(true));
    } else if (node.children.length) {
      Array.from(node.children).forEach(child => {
        nodes.push(...extractContentNodes(child));
      });
    }
    return nodes;
  }

  // Build accordion rows
  const accordionRows = [];

  // We'll walk through the children, and for each section (delimited by h2), create a row
  let i = 0;
  // First, collect intro content before first h2
  let introContentNodes = [];
  while (i < children.length && !(children[i].querySelector && children[i].querySelector('h2'))) {
    introContentNodes.push(...extractContentNodes(children[i]));
    i++;
  }
  if (mainTitle && introContentNodes.length) {
    const introTitle = mainTitle.cloneNode(true);
    const introContent = document.createElement('div');
    if (subtitle) introContent.appendChild(subtitle.cloneNode(true));
    introContentNodes.forEach(node => introContent.appendChild(node));
    accordionRows.push([introTitle, introContent]);
  }

  // Now, for each h2 section, create a row
  while (i < children.length) {
    // Find the h2 in this child
    let h2 = children[i].querySelector && children[i].querySelector('h2');
    if (h2) {
      const sectionTitle = h2.cloneNode(true);
      const sectionContent = document.createElement('div');
      // Add all content from this child except the h2
      Array.from(children[i].childNodes).forEach(child => {
        if (!(child.nodeType === 1 && child.matches('h2'))) {
          sectionContent.appendChild(child.cloneNode(true));
        }
      });
      i++;
      // Add subsequent children until the next h2
      while (i < children.length && !(children[i].querySelector && children[i].querySelector('h2'))) {
        extractContentNodes(children[i]).forEach(node => sectionContent.appendChild(node));
        i++;
      }
      accordionRows.push([sectionTitle, sectionContent]);
    } else {
      i++;
    }
  }

  // Compose the table cells
  const headerRow = ['Accordion (accordion12)'];
  const cells = [headerRow];
  for (const row of accordionRows) {
    cells.push(row);
  }

  // Only output the table if there is at least one accordion item
  if (cells.length > 1) {
    const block = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(block);
  }
}
