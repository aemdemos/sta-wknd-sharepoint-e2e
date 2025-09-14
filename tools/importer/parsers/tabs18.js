/* global WebImporter */
export default function parse(element, { document }) {
  // Only process the tabs block
  if (!element.classList.contains('tabs')) return;

  // Header row for the block table (must match block name exactly)
  const headerRow = ['Tabs (tabs18)'];
  const rows = [headerRow];

  // Find the tab labels (li elements)
  const tabList = element.querySelector('.cmp-tabs__tablist');
  const tabLabels = tabList ? Array.from(tabList.querySelectorAll('li')) : [];

  // Find all tab panels (in DOM order)
  const tabPanels = Array.from(element.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: Ensure labels and panels match
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (!label || !panel) continue;

    // Tab label text (dynamic)
    const tabLabelText = label.textContent.trim();

    // Tab content: reference the actual panel content (not clone)
    // If the panel has only one main child (e.g. .contentfragment), use it
    let tabContent;
    if (panel.children.length === 1) {
      tabContent = panel.children[0].cloneNode(true);
    } else {
      // Otherwise, wrap all children in a div (clone nodes)
      const wrapper = document.createElement('div');
      Array.from(panel.childNodes).forEach(node => wrapper.appendChild(node.cloneNode(true)));
      tabContent = wrapper;
    }

    rows.push([tabLabelText, tabContent]);
  }

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the new table
  element.replaceWith(blockTable);
}
