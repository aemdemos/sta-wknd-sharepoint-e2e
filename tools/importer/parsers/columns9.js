/* global WebImporter */
export default function parse(element, { document }) {
  // Find the deepest .aem-Grid inside the element
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;
  const gridChildren = Array.from(grid.children);

  function findByClass(substring) {
    return gridChildren.find(el => el.className && el.className.includes(substring));
  }

  // 1. Logo (image block)
  const logoBlock = findByClass('cmp-image--logo');
  let logo = null;
  if (logoBlock) {
    logo = logoBlock.querySelector('[data-cmp-is="image"]');
  }

  // 2. Navigation (menu)
  const navBlock = findByClass('cmp-navigation--footer');
  let nav = null;
  if (navBlock) {
    nav = navBlock.querySelector('nav');
  }

  // 3. Title (Follow Us)
  const titleBlock = findByClass('cmp-title--right');
  let title = null;
  if (titleBlock) {
    title = titleBlock.querySelector('.cmp-title');
  }

  // 4. Social buttons
  const btnListBlock = findByClass('cmp-buildingblock--btn-list');
  let btnList = null;
  if (btnListBlock) {
    btnList = btnListBlock.querySelector('.aem-Grid');
  }

  // 5. Separator (hr)
  const separatorBlock = findByClass('cmp-separator--space-small');
  let separator = null;
  if (separatorBlock) {
    separator = separatorBlock.querySelector('hr');
  }

  // 6. Text (footer copyright)
  const textBlock = findByClass('cmp-text--font-xsmall');
  let text = null;
  if (textBlock) {
    text = textBlock.querySelector('.cmp-text');
  }

  // Compose table rows
  const headerRow = ['Columns (columns9)'];

  // First content row: logo, navigation, follow us title, social buttons
  const firstRow = [logo, nav, title, btnList].filter(Boolean);
  while (firstRow.length < 4) firstRow.push('');

  // Second row: copyright (separator + text) as a single cell, only if there is content
  let copyrightCell = [];
  if (text) copyrightCell.push(text);
  // Only include separator if a Section Metadata table would follow (not in this block)
  // So skip the separator per requirements
  if (copyrightCell.length === 0) return; // Don't output empty block

  // The copyright row should be a single cell (not 4 columns with 3 empty)
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    firstRow,
    [copyrightCell]
  ], document);

  element.replaceWith(table);
}
