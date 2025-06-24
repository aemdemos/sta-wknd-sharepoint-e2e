/* global WebImporter */
export default function parse(element, { document }) {
  // Find the Overview tab panel
  const overviewTab = element.querySelector('.cmp-tabs__tabpanel');
  if (!overviewTab) return;

  // Find the first cmp-image (background image)
  let backgroundImage = null;
  const allImages = Array.from(overviewTab.querySelectorAll('.cmp-image'));
  if (allImages.length > 0) backgroundImage = allImages[0];

  // Gather all content except the background image for the copy cell
  // Strategy: traverse all direct children of overviewTab, skip the first cmp-image, take everything else (preserving order and reference)
  let foundBackground = false;
  const copyElements = [];
  overviewTab.childNodes.forEach(node => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      if (
        node.classList.contains('cmp-image') &&
        backgroundImage &&
        node.isSameNode(backgroundImage) &&
        !foundBackground
      ) {
        foundBackground = true; // Skip the background image only once
        return;
      }
      copyElements.push(node);
    } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0) {
      // If there's a text node with content, wrap it for preservation
      const span = document.createElement('span');
      span.textContent = node.textContent;
      copyElements.push(span);
    }
  });
  // Fallback: if nothing is found, use textContent
  const copyContent = (copyElements.length > 0) ? copyElements : [overviewTab.textContent.trim()];

  // Build the table
  const cells = [
    ['Hero'],
    [backgroundImage ? backgroundImage : ''],
    [copyContent]
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
