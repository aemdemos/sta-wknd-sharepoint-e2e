/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // 1. Get tab labels in order
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li[role="tab"]'));

  // 2. Get tab panels, in DOM order (required for matching content)
  const tabPanels = Array.from(tabsRoot.querySelectorAll('[role="tabpanel"]'));

  // 3. Build rows per tab: [Tab Label, Tab Content]
  const rows = tabLabels.map((tabEl, idx) => {
    const label = tabEl.textContent.trim();
    // Try to find the panel with the correct aria-labelledby
    let panel = tabPanels.find((tp) => {
      return (tp.getAttribute('aria-labelledby') === tabEl.id);
    }) || tabPanels[idx];
    if (!panel) return [label, ''];

    // Get panel content: gather all children inside the tabpanel
    // If the panel has just one direct content child (e.g. .contentfragment), reference it. Otherwise, group all children into a div.
    const children = Array.from(panel.children).filter((n) => n.nodeType === 1);
    let content;
    if (children.length === 1) {
      content = children[0];
    } else if (children.length > 1) {
      // Group them into a single element for the cell
      const wrapper = document.createElement('div');
      children.forEach(child => wrapper.appendChild(child));
      content = wrapper;
    } else {
      // fallback: use the panel itself if there is text content
      content = panel.textContent.trim() ? panel : '';
    }
    return [label, content];
  });

  // 4. Compose table data: header row then rows
  const tableData = [
    ['Tabs (tabs38)'],
    ...rows
  ];

  // 5. Create and replace
  const table = WebImporter.DOMUtils.createTable(tableData, document);
  element.replaceWith(table);
}
