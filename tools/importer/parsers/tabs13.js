/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block inside the element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Header row with EXACT component/block name per requirements
  const headerRow = ['Tabs (tabs13)'];

  // Find all tab labels (li under .cmp-tabs__tablist)
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = tabList ? Array.from(tabList.children) : [];

  // Find all tab panels (must be in the same order as labels)
  const tabPanels = Array.from(tabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Defensive: only process as many panels as there are labels
  const numTabs = Math.min(tabLabels.length, tabPanels.length);
  const rows = [];

  for (let i = 0; i < numTabs; i++) {
    const labelEl = tabLabels[i];
    const panelEl = tabPanels[i];
    const labelText = labelEl ? labelEl.textContent.trim() : '';

    // Try to extract the MAIN content from the tab panel
    // Typically, there's a .contentfragment as the first child. If not, use panelEl's childNodes
    let content = null;
    if (panelEl.children.length === 1 && panelEl.firstElementChild) {
      content = panelEl.firstElementChild;
    } else if (panelEl.children.length > 1) {
      // Wrap all content in a div for a single cell
      const wrapper = document.createElement('div');
      Array.from(panelEl.childNodes).forEach(node => wrapper.appendChild(node));
      content = wrapper;
    } else {
      // fallback: use the panel itself
      content = panelEl;
    }

    rows.push([labelText, content]);
  }

  // Compose the table rows
  const tableRows = [headerRow, ...rows];

  // Create the table
  const table = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the entire .cmp-tabs element with the new block table
  tabs.replaceWith(table);
}
