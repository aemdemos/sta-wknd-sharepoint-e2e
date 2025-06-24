/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the main heading (h1) for Hero content (optional)
  const h1 = element.querySelector('h1');

  // 2. Find the Overview tab's main image (first .cmp-image inside the overview tab)
  let heroImage = null;
  let overviewTab = element.querySelector('.cmp-tabs__tabpanel--active, [role="tabpanel"][aria-hidden="false"]');
  if (!overviewTab) {
    // fallback: first tabpanel
    overviewTab = element.querySelector('.cmp-tabs__tabpanel');
  }
  if (overviewTab) {
    heroImage = overviewTab.querySelector('.cmp-image');
  }

  // 3. Gather all content elements under the overview tab, beneath the image, in DOM order
  let contentRowArr = [];
  // If h1 is present, include first
  if (h1) contentRowArr.push(h1);
  if (overviewTab) {
    // We want to get everything from the overview tab that is not the main hero image
    // and includes all text and block elements, preserving order.
    // We'll use all children of .cmp-contentfragment__elements, or fallback to overviewTab
    let contentContainer = overviewTab.querySelector('.cmp-contentfragment__elements') || overviewTab;
    // Get all DIRECT children (to preserve order and structure)
    let nodes = Array.from(contentContainer.childNodes).filter(node => {
      // Filter out the heroImage node (if it is a direct child)
      if (node.nodeType === 1 && heroImage && node === heroImage.parentElement) return false;
      return true;
    });
    nodes.forEach(node => {
      // If node is an element and not a .cmp-image, include if not empty
      if (node.nodeType === 1) {
        if (!node.classList.contains('aem-Grid') && !node.classList.contains('cmp-image')) {
          // For divs that just wrap a .cmp-image, skip
          if (node.querySelector && node.querySelector('.cmp-image') && node.children.length === 1 && node.firstElementChild.classList.contains('cmp-image')) return;
          // Only skip true layout grid wrappers. Otherwise, include.
          if (node.textContent.trim() !== '' || node.children.length > 0) {
            contentRowArr.push(node);
          }
        }
      } else if (node.nodeType === 3) { // Text node
        if (node.textContent.trim()) {
          // Wrap text node in <p> to preserve text
          const p = document.createElement('p');
          p.textContent = node.textContent.trim();
          contentRowArr.push(p);
        }
      }
    });
  }
  // If there is no content, add an empty string for the required row
  if (contentRowArr.length === 0) contentRowArr = [''];

  // Compose the block table exactly as in the example (header, image, content)
  const cells = [
    ['Hero'],
    [heroImage || ''],
    [contentRowArr],
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
