/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs block container
  const tabsRoot = element.querySelector('.tabs .cmp-tabs');
  if (!tabsRoot) return;

  // Get the tab labels from the tablist
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  const tabLabelEls = tabList ? tabList.querySelectorAll('.cmp-tabs__tab') : [];
  const tabLabels = Array.from(tabLabelEls).map(tab => tab.textContent.trim());

  // Get all tabpanel containers in their rendered order
  const tabPanels = tabsRoot.querySelectorAll('[role="tabpanel"], .cmp-tabs__tabpanel');

  // Build the table rows
  const headerRow = ['Tabs (tabs15)']; // Matches example exactly
  const rows = [headerRow];

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    // Defensive: skip if not available
    if (!label || !panel) continue;
    // Use the article if present (which wraps the whole content for each tab)
    const article = panel.querySelector('article');
    if (article) {
      rows.push([label, article]);
    } else {
      // fallback: if no article, use the whole panel
      rows.push([label, panel]);
    }
  }
  // Create the table and replace the original tabs section
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.parentNode.replaceChild(table, element);
}
