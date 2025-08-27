/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .contentfragment block and its internal elements container
  const contentFragment = element.querySelector('.contentfragment');
  if (!contentFragment) return;
  const cfElements = contentFragment.querySelector('.cmp-contentfragment__elements');
  if (!cfElements) return;

  // Prepare rows: header first, then one for each carousel slide (image + text)
  const rows = [['Carousel (carousel16)']];
  const children = Array.from(cfElements.children);

  let i = 0;
  while (i < children.length) {
    // Each section starts with <h2>
    const node = children[i];
    if (node.tagName === 'H2') {
      // Find the next .cmp-image (slide image)
      let imageDiv = null;
      let imageIdx = -1;
      for (let j = i + 1; j < children.length; j++) {
        const img = children[j].querySelector?.('.cmp-image');
        if (img) {
          imageDiv = img;
          imageIdx = j;
          break;
        }
      }
      // Find the next <p> after the image (slide description)
      let textEl = null;
      let textIdx = -1;
      for (let j = (imageIdx !== -1 ? imageIdx + 1 : i + 1); j < children.length; j++) {
        if (children[j].tagName === 'P') {
          textEl = children[j];
          textIdx = j;
          break;
        }
        // Do not cross into the next section
        if (children[j].tagName === 'H2') break;
      }
      // Compose cell: <h2> + <p> (if exists)
      const heading = document.createElement('h2');
      heading.textContent = node.textContent;
      const textCell = textEl ? [heading, textEl] : [heading];
      // Add only if there's an image
      if (imageDiv) rows.push([imageDiv, textCell]);
      // Move to after text or image, or next node
      i = Math.max(imageIdx, textIdx, i) + 1;
    } else {
      i++;
    }
  }

  // Replace the original .contentfragment with the generated carousel table
  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    contentFragment.replaceWith(table);
  }
}
