/* global WebImporter */
export default function parse(element, { document }) {
  // Find the contentfragment article with all the content
  const fragment = element.querySelector('article.contentfragment article.cmp-contentfragment');
  if (!fragment) return;

  // Get the accordion content root (first .cmp-contentfragment__elements > div)
  const contentRoot = fragment.querySelector('.cmp-contentfragment__elements > div');
  if (!contentRoot) return;

  // Get all child nodes (including text, element nodes)
  const children = Array.from(contentRoot.childNodes).filter(node => {
    // Only include Elements (nodeType 1) and text nodes with non-empty text
    return node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim());
  });

  // Table header as in the example
  const cells = [['Accordion (accordion33)']];

  // Iterate and extract accordion sections (start at each H2)
  let i = 0;
  while (i < children.length) {
    const node = children[i];
    // Only treat H2 as section start
    if (node.nodeType === 1 && node.tagName === 'H2') {
      const titleElem = node;
      i++;
      let contentElems = [];
      // Collect all following nodes (text, p, div with images, etc) up to next H2
      while (i < children.length && !(children[i].nodeType === 1 && children[i].tagName === 'H2')) {
        // Skip grid wrappers with no content
        if (
          children[i].nodeType === 1 &&
          children[i].classList &&
          children[i].classList.contains('aem-Grid') &&
          children[i].textContent.trim() === ''
        ) {
          i++;
          continue;
        }
        // Add element or text node
        if (children[i].nodeType === 1 || children[i].nodeType === 3) {
          contentElems.push(children[i]);
        }
        i++;
      }
      // Remove trailing empty text nodes from contentElems
      while (contentElems.length && contentElems[contentElems.length - 1].nodeType === 3 && contentElems[contentElems.length - 1].textContent.trim() === '') {
        contentElems.pop();
      }
      // If only one element, use it directly. If none, use empty string
      cells.push([
        titleElem,
        contentElems.length === 0 ? '' : (contentElems.length === 1 ? contentElems[0] : contentElems)
      ]);
    } else {
      i++;
    }
  }

  // If only header, don't replace
  if (cells.length === 1) return;

  // Create the block
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
