/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Find the tab headers (labels)
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabItems = Array.from(tabList.querySelectorAll('[role="tab"]'));
  if (tabItems.length === 0) return;

  // Extract tab labels and corresponding tabpanel IDs
  const tabInfo = tabItems.map(tabEl => ({
    label: tabEl.textContent.trim(),
    tabPanelId: tabEl.getAttribute('aria-controls'),
  }));

  // For each tab, get the content panel
  const rows = tabInfo.map(info => {
    // Find the tabpanel element by id
    const panel = tabsRoot.querySelector(`#${info.tabPanelId}`);
    let contentElem = null;
    if (panel) {
      // Try to find the meaningful content inside the tabpanel
      // Prefer .contentfragment, else fall back to panel itself
      const cf = panel.querySelector('.contentfragment');
      if (cf) {
        contentElem = cf;
      } else {
        contentElem = panel;
      }
    } else {
      contentElem = document.createElement('span');
    }
    return [info.label, contentElem];
  });

  // The header row must have only one column, per the example
  const headerRow = ['Tabs (tabs37)'];
  const cells = [headerRow, ...rows];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
