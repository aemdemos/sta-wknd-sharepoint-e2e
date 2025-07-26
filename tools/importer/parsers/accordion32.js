/* global WebImporter */
export default function parse(element, { document }) {
  // Find the content fragment (main article area)
  const contentFragment = element.querySelector('.contentfragment .cmp-contentfragment__elements');
  if (!contentFragment) return;

  // Get all children in order
  const children = Array.from(contentFragment.children);

  // Prepare rows (first is header)
  const rows = [
    ['Accordion (accordion32)'],
  ];

  // Iterate through children, looking for h2's (section headers)
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    if (child.tagName === 'H2') {
      const title = child;
      // Content cell: collect all siblings until next H2 or end
      const contentElements = [];
      let j = i + 1;
      while (j < children.length && children[j].tagName !== 'H2') {
        const el = children[j];
        // Empty .aem-Grid blocks are skipped
        if (el.classList && el.classList.contains('aem-Grid') && el.children.length === 0) {
          j++;
          continue;
        }
        contentElements.push(el);
        j++;
      }
      // Remove leading/trailing empty .aem-Grid
      while (
        contentElements.length > 0 &&
        contentElements[0].classList &&
        contentElements[0].classList.contains('aem-Grid') &&
        contentElements[0].children.length === 0
      ) {
        contentElements.shift();
      }
      while (
        contentElements.length > 0 &&
        contentElements[contentElements.length - 1].classList &&
        contentElements[contentElements.length - 1].classList.contains('aem-Grid') &&
        contentElements[contentElements.length - 1].children.length === 0
      ) {
        contentElements.pop();
      }
      // If only one element, don't wrap in array
      let contentCell = contentElements.length === 1 ? contentElements[0] : contentElements;
      // If contentCell is empty, set to empty string
      if (
        (Array.isArray(contentCell) && contentCell.length === 0) ||
        (!Array.isArray(contentCell) && !contentCell)
      ) {
        contentCell = '';
      }
      rows.push([title, contentCell]);
      // Move i to the last used
      i = j - 1;
    }
  }

  // Only create the block if there is more than just the header
  if (rows.length > 1) {
    const block = WebImporter.DOMUtils.createTable(rows, document);
    // Replace the content fragment elements with the accordion block
    contentFragment.replaceWith(block);
  }
}
