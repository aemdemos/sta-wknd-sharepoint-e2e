/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main contentfragment article
  const cf = element.querySelector('article.cmp-contentfragment');
  if (!cf) return;

  // Find the main content area inside contentfragment
  const cfElements = cf.querySelector('.cmp-contentfragment__elements');
  if (!cfElements) return;

  // Helper to get image from a grid div (if present)
  function getImageFromGrid(gridDiv) {
    if (!gridDiv) return null;
    const imgWrapper = gridDiv.querySelector('.cmp-image');
    if (imgWrapper) {
      const img = imgWrapper.querySelector('img');
      if (img) return imgWrapper;
    }
    return null;
  }

  // Get all direct children of cfElements
  const children = Array.from(cfElements.children);

  // Prepare rows
  const rows = [];
  const headerRow = ['Cards (cards33)'];
  rows.push(headerRow);

  let i = 0;
  while (i < children.length) {
    const node = children[i];
    if (node.tagName === 'H2') {
      // Try to find image grid after heading
      let image = null;
      let gridDiv = null;
      if (children[i + 1] && children[i + 1].querySelector) {
        gridDiv = children[i + 1].querySelector('.aem-Grid');
        image = getImageFromGrid(gridDiv);
      }
      // Find description paragraph after image grid (or after heading if no image)
      let descIdx = i + 2;
      if (!image) descIdx = i + 1;
      let desc = null;
      if (children[descIdx] && children[descIdx].tagName === 'P') {
        desc = children[descIdx];
      }
      // Compose text cell: heading + description
      if (image && desc) {
        const textCell = document.createElement('div');
        textCell.appendChild(node.cloneNode(true));
        textCell.appendChild(desc.cloneNode(true));
        rows.push([
          image,
          textCell
        ]);
      }
      i = desc ? descIdx + 1 : (image ? i + 2 : i + 1);
      continue;
    }
    i++;
  }

  // Only replace if there are card rows
  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }
}
