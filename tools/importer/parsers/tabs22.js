/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Get tab labels (li elements inside ol[role=tablist])
  const tabLabels = Array.from(
    tabsRoot.querySelectorAll('.cmp-tabs__tablist > li[role="tab"]')
  );

  // Get tab panels (div[role=tabpanel])
  const tabPanels = Array.from(
    tabsRoot.querySelectorAll('div[role="tabpanel"]')
  );

  // Defensive: ensure we have the same number of labels and panels
  if (tabLabels.length !== tabPanels.length) return;

  // Build header row
  const headerRow = ['Tabs (tabs22)'];
  const rows = [headerRow];

  // For each tab, build a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    // Find the main content for this tab
    // Usually it's the first child of the tabpanel with class 'contentfragment', or just the tabpanel's content
    let content = null;
    const contentFragment = tabPanels[i].querySelector('.contentfragment');
    if (contentFragment) {
      content = contentFragment;
    } else {
      // fallback: use the tabpanel itself
      content = tabPanels[i];
    }
    rows.push([label, content]);
  }

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs block with the table
  tabsRoot.replaceWith(table);
}
