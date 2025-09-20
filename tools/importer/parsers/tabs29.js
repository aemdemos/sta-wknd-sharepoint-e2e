/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs.panelcontainer');
  if (!tabsBlock) return;

  // Find the cmp-tabs element
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels from the tablist
  const tabLabels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist > li')
  ).map(li => li.textContent.trim());

  // Get tab panels (content)
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // Build rows: header, then each tab label + content
  const headerRow = ['Tabs (tabs29)'];
  const rows = [headerRow];

  // For each tab, create a row: [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (!panel) continue;

    // Defensive: Find the main content fragment inside the panel
    let contentFragment = panel.querySelector('.cmp-contentfragment');
    let tabContent;
    if (contentFragment) {
      // Use the contentfragment's .cmp-contentfragment__elements if present
      const elements = contentFragment.querySelector('.cmp-contentfragment__elements');
      if (elements) {
        tabContent = elements;
      } else {
        tabContent = contentFragment;
      }
    } else {
      // Fallback: Use the panel itself
      tabContent = panel;
    }
    rows.push([label, tabContent]);
  }

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the table
  tabsBlock.replaceWith(table);
}
