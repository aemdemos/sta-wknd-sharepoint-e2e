/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs block root in the given element
  const tabsRoot = element.querySelector('.tabs .cmp-tabs');
  if (!tabsRoot) return;

  // Get the tab labels
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabItems = Array.from(tabList.querySelectorAll('li'));

  // Get all tab panels (in DOM order)
  const tabPanels = Array.from(
    tabsRoot.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // Defensive: ensure tabItems and tabPanels have the same length
  const count = Math.min(tabItems.length, tabPanels.length);

  // Header row as required
  const header = ['Tabs (tabs38)'];
  const rows = [];

  for (let i = 0; i < count; i++) {
    const tab = tabItems[i];
    const label = tab.textContent.trim();
    const panel = tabPanels[i];
    let content = null;

    // Try to find the main contentfragment article inside the tabpanel
    const cf = panel.querySelector('article.cmp-contentfragment');
    if (cf) {
      content = cf;
    } else {
      // Fallback to the entire panel if no contentfragment is found
      content = panel;
    }
    rows.push([label, content]);
  }

  // If there are more tab panels than tab labels (unlikely), add them as well
  if (tabPanels.length > count) {
    for (let i = count; i < tabPanels.length; i++) {
      const panel = tabPanels[i];
      const cf = panel.querySelector('article.cmp-contentfragment');
      const label = `Tab ${i + 1}`;
      rows.push([label, cf ? cf : panel]);
    }
  }

  // Build table
  const cells = [header, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
