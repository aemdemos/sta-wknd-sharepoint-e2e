/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get the tab <li>s (labels)
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabNodes = Array.from(tabList.querySelectorAll('li'));
  if (!tabNodes.length) return;

  // Get tab panels (should match tab labels in order)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[role="tabpanel"]'));
  // Defensive: only process matching pairs
  const tabCount = Math.min(tabNodes.length, tabPanels.length);
  if (tabCount === 0) return;

  // Build the header row (block name)
  const headerRow = ['Tabs (tabs6)'];

  // Build the tab label row
  const labelsRow = tabNodes.slice(0, tabCount).map(tab => tab.textContent.trim());

  // Build the tab content row by referencing existing content nodes for each panel
  const contentsRow = tabPanels.slice(0, tabCount).map(panel => {
    // Instead of cloning, reference the children of the panel
    // Collect all ELEMENT and TEXT nodes that are actual content
    // Some panels may wrap their content in a single container, others may have direct nodes
    // We'll collect all non-empty nodes
    const nodes = [];
    panel.childNodes.forEach(child => {
      // Ignore empty grid containers/divs (those with only aem-Grid etc and no content)
      if (
        child.nodeType === 1 && // ELEMENT_NODE
        child.tagName === 'DIV' &&
        child.classList.contains('contentfragment') &&
        child.childNodes.length === 0
      ) {
        // skip
      } else if (
        child.nodeType === 1 &&
        child.tagName === 'DIV' &&
        child.querySelector('.aem-Grid') &&
        !child.textContent.trim()
      ) {
        // skip empty grid wrappers
      } else if (
        child.nodeType === 3 && // TEXT_NODE
        !child.textContent.trim()
      ) {
        // skip whitespace text nodes
      } else {
        nodes.push(child);
      }
    });
    // If there is only a single content node, just return it, otherwise use an array
    if (nodes.length === 1) return nodes[0];
    if (nodes.length > 1) return nodes;
    return '';
  });

  // Compose the table: header (1 col), then labels row (n), contents row (n)
  const tableArray = [
    headerRow,
    labelsRow,
    contentsRow
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableArray, document);
  tabsBlock.replaceWith(block);
}
