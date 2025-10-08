/* global WebImporter */
export default function parse(element, { document }) {
  // Create the required header row (single cell)
  const headerRow = ['Accordion (accordion18)'];
  const rows = [headerRow];

  // Find the main article content fragment (where the skatepark sections live)
  const contentFragment = element.querySelector('.cmp-contentfragment__elements');
  if (!contentFragment) return;

  // Collect accordion items: each skatepark section with its title and content
  const children = Array.from(contentFragment.children);
  for (let i = 0; i < children.length; i++) {
    const node = children[i];
    const h2 = node.querySelector && node.querySelector('h2');
    if (h2) {
      // Title cell: use the h2 text
      const titleCell = document.createElement('span');
      titleCell.textContent = h2.textContent.trim();
      // Content cell: gather all subsequent siblings until next H2 or end
      const sectionContent = [];
      // If the node has content besides h2, include it
      Array.from(node.children).forEach(child => {
        if (child !== h2) sectionContent.push(child.cloneNode(true));
      });
      let j = i + 1;
      while (j < children.length) {
        const nextNode = children[j];
        if (nextNode.querySelector && nextNode.querySelector('h2')) break;
        sectionContent.push(nextNode.cloneNode(true));
        j++;
      }
      if (sectionContent.length) {
        rows.push([titleCell, sectionContent]);
      }
    }
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
