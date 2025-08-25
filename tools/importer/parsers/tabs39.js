/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs block (look for .cmp-tabs)
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('li[role="tab"]').forEach(tab => {
      tabLabels.push(tab.textContent.trim());
    });
  }

  // Get tab panels in order
  const tabPanels = Array.from(tabs.querySelectorAll('.cmp-tabs__tabpanel'));
  const tabContents = tabPanels.map(tabPanel => {
    // Try to find the most meaningful contentfragment inside
    const cf = tabPanel.querySelector('.cmp-contentfragment, .contentfragment');
    if (cf) {
      // Reference the existing contentfragment element
      return [cf];
    }
    // Fallback: reference the tabPanel itself (shouldn't occur in provided HTML)
    return [tabPanel];
  });

  // Build table rows: header, then each tab: [label, content]
  const headerRow = ['Tabs (tabs39)'];
  const tableRows = [headerRow];
  for (let i = 0; i < tabLabels.length; i += 1) {
    tableRows.push([
      tabLabels[i],
      tabContents[i],
    ]);
  }

  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  tabs.replaceWith(table);
}
