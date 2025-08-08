/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // 1. Get all tab label elements (order matters)
  const tabList = tabs.querySelector('ol[role="tablist"]');
  if (!tabList) return;
  const tabLabelEls = Array.from(tabList.querySelectorAll('.cmp-tabs__tab'));
  if (!tabLabelEls.length) return;
  const tabLabels = tabLabelEls.map(tabEl => tabEl.textContent.trim());

  // 2. Get all tabpanel elements (match to tab labels by order)
  const tabPanels = Array.from(tabs.querySelectorAll('div[role="tabpanel"]'));
  if (!tabPanels.length) return;

  // 3. Compose the table rows
  // First row: block name header
  const headerRow = ['Tabs (tabs28)'];
  // Second row: all the tab labels, 1 per cell
  const tabLabelRow = tabLabels;

  // Third row: all the tab content, 1 per cell, preserving existing elements
  // For each tab panel, find the main content nodes:
  const tabContentRow = tabPanels.map(panel => {
    // If there's a direct <article> (as in contentfragment), use that
    const article = panel.querySelector(':scope > article');
    if (article) {
      return article;
    }
    // Otherwise, use all significant children except empty grid wrappers
    // We'll gather all child nodes that are not .aem-Grid or .aem-GridColumn and not completely empty
    const nodes = [];
    Array.from(panel.childNodes).forEach(child => {
      if (child.nodeType === 1) {
        if (
          !child.classList.contains('aem-Grid') &&
          !child.classList.contains('aem-GridColumn') &&
          !child.classList.contains('aem-Grid--default--12') &&
          (child.textContent.trim() || child.querySelector('img,ul,ol,h1,h2,h3,h4,h5,h6,p'))
        ) {
          nodes.push(child);
        }
      } else if (child.nodeType === 3 && child.textContent.trim()) {
        nodes.push(document.createTextNode(child.textContent));
      }
    });
    if (nodes.length === 1) return nodes[0];
    if (nodes.length > 1) return nodes;
    // fallback: include the panel itself if non-empty
    if (panel.textContent.trim()) return panel;
    // else return empty string
    return '';
  });

  // Compose the block table: header row, tab label row, content row
  const cells = [headerRow, tabLabelRow, tabContentRow];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
