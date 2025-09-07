/* global WebImporter */
export default function parse(element, { document }) {
  // Only process tab blocks
  if (!element.classList.contains('cmp-tabs')) return;

  // Header row for the block table
  const headerRow = ['Tabs (tabs12)'];
  const rows = [headerRow];

  // Get tab labels
  const tabList = element.querySelector('.cmp-tabs__tablist');
  const tabLabels = tabList ? Array.from(tabList.querySelectorAll('li')) : [];

  // Get tab panels (content)
  const tabPanels = Array.from(element.querySelectorAll('.cmp-tabs__tabpanel'));

  // Defensive: Ensure labels and panels match
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (!label || !panel) continue;

    // Tab label text
    const tabName = label.textContent.trim();

    // Tab content: clone the panel's content as a single block
    const tabContent = document.createElement('div');
    Array.from(panel.childNodes).forEach((node) => {
      tabContent.appendChild(node.cloneNode(true));
    });

    rows.push([tabName, tabContent]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the ENTIRE tabs block (not just the cmp-tabs element)
  element.parentElement.replaceWith(block);
}
