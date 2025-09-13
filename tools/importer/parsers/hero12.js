/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero block root
  const heroBlock = element.querySelector('.teaser.cmp-teaser--hero');
  if (!heroBlock) return;

  // Find the image (background image)
  let imageDiv = heroBlock.querySelector('.cmp-teaser__image');
  let imageEl = null;
  if (imageDiv) {
    imageEl = imageDiv.querySelector('img');
  }

  // Find the content (title, subheading, CTA)
  let contentDiv = heroBlock.querySelector('.cmp-teaser__content');
  let contentElements = [];
  if (contentDiv) {
    // Only push real content nodes (skip whitespace)
    contentDiv.childNodes.forEach((node) => {
      if (
        node.nodeType === Node.ELEMENT_NODE ||
        (node.nodeType === Node.TEXT_NODE && node.textContent.trim())
      ) {
        contentElements.push(node);
      }
    });
  }

  // Build the table rows
  const headerRow = ['Hero (hero12)'];
  const imageRow = [imageEl ? imageEl : ''];
  const contentRow = [contentElements.length ? contentElements : ''];

  const cells = [headerRow, imageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
