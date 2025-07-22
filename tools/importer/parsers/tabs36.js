/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block: cmp-tabs
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels from the tablist (order is important)
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('li[role="tab"]').forEach(li => {
      tabLabels.push(li.textContent.trim());
    });
  }

  // Get each tabpanel (order is important and matches labels)
  const tabPanels = tabsRoot.querySelectorAll('.cmp-tabs__tabpanel');

  // Start with the header row, exactly as specified
  const rows = [['Tabs (tabs36)']];

  // For each tab, extract content and add as row
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (!label || !panel) continue;

    // Try to find the primary content for each tab
    // Most commonly an <article> in .contentfragment. If not, use the panel div itself
    let content = panel.querySelector('article');
    if (!content) {
      // fallback: find first child that is not a script/style
      const child = Array.from(panel.children).find(
        el => el.nodeType === 1 && el.tagName !== 'SCRIPT' && el.tagName !== 'STYLE'
      );
      content = child || panel;
    }
    rows.push([label, content]);
  }

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
