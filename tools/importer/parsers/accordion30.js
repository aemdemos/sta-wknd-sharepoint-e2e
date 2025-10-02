/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main article content
  const contentFragment = element.querySelector('article.contentfragment');
  if (!contentFragment) return;

  // Prepare accordion rows
  const rows = [];
  // Always start with the block header
  const headerRow = ['Accordion (accordion30)'];
  rows.push(headerRow);

  // Helper to collect content for each section
  function collectSectionContent(startElem, stopSelector) {
    const content = [];
    let node = startElem.parentElement.parentElement.nextElementSibling;
    while (node && !(node.querySelector && node.querySelector(stopSelector))) {
      // Only push if node has meaningful content
      if (node.textContent.trim() || node.querySelector('img, blockquote, picture')) {
        content.push(node);
      }
      node = node.nextElementSibling;
    }
    return content;
  }

  // Section 1: Introduction (title + intro + blockquote + image)
  const h3 = contentFragment.querySelector('h3.cmp-contentfragment__title');
  const contentElements = contentFragment.querySelector('.cmp-contentfragment__elements');
  if (h3 && contentElements) {
    // Title cell
    const titleCell = h3;
    // Content cell: All children until the first h2 (section title)
    const contentCells = [];
    let children = Array.from(contentElements.children);
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (child.querySelector && child.querySelector('h2.cmp-title__text')) {
        break;
      }
      if (child.textContent.trim() || child.querySelector('img, blockquote, picture')) {
        contentCells.push(child);
      }
    }
    if (contentCells.length) rows.push([titleCell, contentCells]);
  }

  // Get all h2 section titles in order
  const sectionTitles = Array.from(contentFragment.querySelectorAll('h2.cmp-title__text'));
  for (let i = 0; i < sectionTitles.length; i++) {
    const titleCell = sectionTitles[i];
    // Find the parent .cmp-title element
    const titleWrapper = titleCell.closest('.cmp-title');
    // Collect content until the next h2
    let stopSelector = 'h2.cmp-title__text';
    const contentCells = collectSectionContent(titleWrapper, stopSelector);
    if (contentCells.length) rows.push([titleCell, contentCells]);
  }

  // Only create the block if there is at least one accordion item
  if (rows.length > 1) {
    const block = WebImporter.DOMUtils.createTable(rows, document);
    // Replace the content fragment with the accordion block
    contentFragment.replaceWith(block);
  }
}
