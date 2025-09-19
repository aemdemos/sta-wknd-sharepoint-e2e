/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block in the element
  const tabsBlock = element.querySelector('.tabs.panelcontainer');
  if (!tabsBlock) return;

  // Find the tabs component
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels from the tablist
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tab'));
  // Get tab panels (content)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: Only process if labels and panels match
  if (tabLabels.length === 0 || tabPanels.length === 0 || tabLabels.length !== tabPanels.length) return;

  // Table header row
  const headerRow = ['Tabs (tabs37)'];
  const rows = [headerRow];

  // For each tab, create a row: [label, content]
  tabLabels.forEach((tabLabel, i) => {
    // Get tab label text
    const label = tabLabel.textContent.trim();

    // Get tab panel content
    const panel = tabPanels[i];

    // Defensive: If panel is missing, skip
    if (!panel) return;

    // The content is typically a single .contentfragment
    // We'll use the entire contentfragment/article as the tab content
    let tabContent;
    const cf = panel.querySelector('.contentfragment');
    if (cf) {
      tabContent = cf;
    } else {
      // Fallback: use all children
      tabContent = Array.from(panel.childNodes);
    }

    rows.push([label, tabContent]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs block with the table
  tabsBlock.replaceWith(table);
}
