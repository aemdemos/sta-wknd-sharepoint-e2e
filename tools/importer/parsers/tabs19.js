/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs block within the provided element
  const tabsRoot = element.querySelector('.tabs .cmp-tabs');
  if (!tabsRoot) return;

  // 1. Get tab labels in order
  const tabLabels = [];
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  if (tabList) {
    tabList.querySelectorAll('li[role="tab"]').forEach((tab) => {
      // Use the text content of each tab
      tabLabels.push(tab.textContent.trim());
    });
  }

  // 2. Get tab panel content in order (each panel = tab content)
  // Panels are .cmp-tabs__tabpanel
  const tabPanels = [];
  tabsRoot.querySelectorAll('[role="tabpanel"]').forEach((panel) => {
    // Try to use the first, meaningful child if possible, otherwise the panel itself
    let contentElement = null;
    // Skip empty filler divs if present
    for (let i = 0; i < panel.children.length; i++) {
      const child = panel.children[i];
      // The .contentfragment is the real content, skip empty or layout divs
      if (child.children.length > 0 || child.textContent.trim().length > 0) {
        contentElement = child;
        break;
      }
    }
    // fallback: use panel itself if no meaningful child
    if (!contentElement) contentElement = panel;
    tabPanels.push(contentElement);
  });

  // 3. Compose table rows: first is header, then each tab's label and content
  const headerRow = ['Tabs (tabs19)'];
  const rows = [headerRow];
  for (let i = 0; i < tabLabels.length; i++) {
    // If content element exists, use it, else empty string
    rows.push([tabLabels[i], tabPanels[i] || '']);
  }

  // 4. Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  tabsRoot.replaceWith(table);
}
