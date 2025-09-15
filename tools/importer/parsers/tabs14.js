/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the tabs block
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsBlock) return;

  // Find tab labels
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('.cmp-tabs__tab'));

  // Find tab panels (content)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));

  // Build rows: each row is [Tab Label, Tab Content]
  const rows = [];
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i]?.textContent?.trim() || '';
    const panel = tabPanels[i];
    let content = null;
    if (panel) {
      // Defensive: find the main content fragment inside the panel
      const cf = panel.querySelector('.contentfragment, .cmp-contentfragment');
      if (cf) {
        // Use the contentfragment element directly for resilience
        content = cf;
      } else {
        // Fallback: use the panel itself
        content = panel;
      }
    } else {
      content = '';
    }
    rows.push([label, content]);
  }

  // Table header
  const headerRow = ['Tabs (tabs14)'];
  const cells = [headerRow, ...rows];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original tabs block with the new table
  tabsBlock.replaceWith(block);
}
