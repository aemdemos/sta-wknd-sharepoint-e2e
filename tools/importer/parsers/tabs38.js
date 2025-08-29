/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get the tab labels (in order)
  const tablist = tabsBlock.querySelector('[role="tablist"]');
  if (!tablist) return;
  const tabEls = Array.from(tablist.querySelectorAll('[role="tab"]'));
  // Defensive: only include tabs that have matching panels
  const tabLabels = tabEls.map(tab => tab.textContent.trim());

  // Get the panels (in order)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[role="tabpanel"]'));
  const numTabs = Math.min(tabLabels.length, tabPanels.length);

  // Build table header exactly as specified
  const headerRow = ['Tabs (tabs38)'];

  // 2 columns: Tab Label, Tab Content
  const columnsRow = ['Tab Label', 'Tab Content'];

  // Each row: [label, corresponding content fragment]
  const rows = [];
  for (let i = 0; i < numTabs; i++) {
    // The label
    const label = tabLabels[i];
    // For content: use the first child .contentfragment if present, else entire panel
    const panel = tabPanels[i];
    let content;
    const cf = panel.querySelector('.contentfragment');
    if (cf) {
      content = cf;
    } else {
      // fallback: reference the whole tabpanel
      content = panel;
    }
    rows.push([label, content]);
  }

  // Compose the table cells
  const cells = [
    headerRow,
    columnsRow,
    ...rows
  ];
  // Create the table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the tabs block in the DOM with the table
  tabsBlock.parentNode.replaceChild(table, tabsBlock);
}
