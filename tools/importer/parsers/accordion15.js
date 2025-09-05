/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main contentfragment article
  const cf = element.querySelector('article.contentfragment');
  if (!cf) return;

  // Find the contentfragment's main content area
  const cfElements = cf.querySelector('.cmp-contentfragment__elements');
  if (!cfElements) return;

  // We'll collect accordion rows here
  const rows = [];
  // Always use the required header
  const headerRow = ['Accordion (accordion15)'];
  rows.push(headerRow);

  // Get all direct children of the contentfragment elements container
  const children = Array.from(cfElements.children);

  // We'll iterate through the children and look for h2s as section titles
  let i = 0;
  while (i < children.length) {
    const node = children[i];
    if (node.tagName === 'H2') {
      // This is a section title
      const title = node.cloneNode(true);
      // The content for this section is all nodes until the next H2 or end
      const contentNodes = [];
      let j = i + 1;
      while (j < children.length && children[j].tagName !== 'H2') {
        const n = children[j];
        // Only add real content elements (skip empty grid wrappers)
        if (
          n.tagName === 'DIV' &&
          n.classList.contains('aem-Grid') &&
          n.querySelector('.cmp-image')
        ) {
          // If it contains images, push the image(s)
          const images = Array.from(n.querySelectorAll('.cmp-image'));
          images.forEach(img => contentNodes.push(img.cloneNode(true)));
        } else if (
          n.tagName === 'DIV' &&
          n.classList.contains('aem-Grid')
        ) {
          // skip empty grid wrappers
        } else {
          contentNodes.push(n.cloneNode(true));
        }
        j++;
      }
      // Remove empty text nodes and empty divs
      const filteredContent = contentNodes.filter(n => {
        if (n.nodeType === Node.TEXT_NODE) {
          return n.textContent.trim().length > 0;
        }
        if (n.tagName === 'DIV' && n.childElementCount === 0) {
          return false;
        }
        return true;
      });
      // If only one element, use it directly, else pass array
      let contentCell;
      if (filteredContent.length === 0) {
        contentCell = '';
      } else if (filteredContent.length === 1) {
        contentCell = filteredContent[0];
      } else {
        // Wrap multiple nodes in a div for a single cell
        const wrapper = document.createElement('div');
        filteredContent.forEach(n => wrapper.appendChild(n));
        contentCell = wrapper;
      }
      // Accordion block requires 2 columns per row after header
      rows.push([title, contentCell]);
      i = j;
    } else {
      i++;
    }
  }

  // Only output if there are at least two rows (header + one accordion item)
  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    cf.replaceWith(table);
  }
}
