/* global WebImporter */
export default function parse(element, { document }) {
  // Find Overview tab panel (first tab panel is always Overview)
  const overviewPanel = element.querySelector('.cmp-tabs__tabpanel');
  let heroImage = null;
  let heroContentEls = [];

  if (overviewPanel) {
    // Find .cmp-contentfragment__elements - holds the overview content
    const cfElems = overviewPanel.querySelector('.cmp-contentfragment__elements');
    if (cfElems) {
      // Collect all child nodes that are not layout grid or image
      // The first div inside cfElems contains headings, image and description
      let contentDiv = null;
      for (const child of cfElems.children) {
        if (child.querySelector('h2, h1, h3, b, p') || child.querySelector('.cmp-image')) {
          contentDiv = child;
          break;
        }
      }
      if (contentDiv) {
        // Find the hero image (first .cmp-image inside this contentDiv)
        heroImage = contentDiv.querySelector('.cmp-image');
        // Collect all children except images and grid/layout
        for (const node of contentDiv.childNodes) {
          if (node.nodeType === 1 && !node.classList.contains('cmp-image') && !node.classList.contains('aem-Grid') && !node.classList.contains('aem-GridColumn')) {
            heroContentEls.push(node);
          }
        }
        // Sometimes the main description paragraph is a sibling (not inside the above contentDiv)
        let next = contentDiv.nextSibling;
        while (next) {
          if (next.nodeType === 1 && next.tagName === 'P') {
            heroContentEls.push(next);
            break;
          }
          next = next.nextSibling;
        }
      } else {
        // fallback: get h1/h2/h3/b/p directly under cfElems
        for (const node of cfElems.childNodes) {
          if (node.nodeType === 1 && (node.matches('h1,h2,h3,b,p'))) {
            heroContentEls.push(node);
          }
        }
      }
    }
  }

  // Fallback if nothing found: try to get text content from anywhere
  if ((!heroImage) && (!heroContentEls.length)) {
    heroImage = element.querySelector('.cmp-image');
    heroContentEls = Array.from(element.querySelectorAll('h1, h2, h3, b, p'));
  }

  // Table per block specification
  const headerRow = ['Hero (hero30)'];
  const cells = [
    headerRow,
    [heroImage ? heroImage : ''],
    [heroContentEls.length ? heroContentEls : '']
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
