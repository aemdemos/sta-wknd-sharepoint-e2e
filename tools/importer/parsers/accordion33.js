/* global WebImporter */
export default function parse(element, { document }) {
  // The block header row exactly as required
  const headerRow = ['Accordion (accordion33)'];
  const rows = [];

  // Find the main contentfragment that contains the accordion sections
  const contentFragment = element.querySelector('article.cmp-contentfragment');
  if (!contentFragment) return;

  // Find the content fragment elements
  const elementsContainer = contentFragment.querySelector('.cmp-contentfragment__elements');
  if (!elementsContainer) return;

  // We want to process only immediate children under elementsContainer
  // We'll treat each <h2> as the start of a new accordion item
  const children = Array.from(elementsContainer.children);

  let currentTitle = null;
  let currentContent = [];

  // Helper to push a section into the rows array
  function pushSection(titleElem, contentElems) {
    if (!titleElem) return;
    let contentCell;
    if (!contentElems || contentElems.length === 0) {
      contentCell = '';
    } else if (contentElems.length === 1) {
      contentCell = contentElems[0];
    } else {
      contentCell = contentElems;
    }
    rows.push([titleElem, contentCell]);
  }

  // Walk through each child, grouping content between <h2>s
  for (let i = 0; i < children.length; i++) {
    const el = children[i];
    if (el.tagName === 'H2') {
      // If we have a previous section, push it
      if (currentTitle) {
        pushSection(currentTitle, currentContent);
      }
      // Start new section
      currentTitle = el;
      currentContent = [];
    } else {
      // Add content to the current section
      currentContent.push(el);
    }
  }
  // Push the last section
  if (currentTitle) {
    pushSection(currentTitle, currentContent);
  }

  // If there are no accordion items, do nothing
  if (rows.length === 0) return;

  // Compose cells: header row followed by all accordion items
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
