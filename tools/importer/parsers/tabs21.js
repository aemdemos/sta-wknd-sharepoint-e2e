/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .tabs block within the given element
  const tabsWrapper = element.querySelector('.tabs');
  if (!tabsWrapper) return;

  // Find the cmp-tabs element inside tabs
  const cmpTabs = tabsWrapper.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab headers (tab labels)
  const tabList = cmpTabs.querySelector('ol.cmp-tabs__tablist');
  if (!tabList) return;
  const tabHeaders = Array.from(tabList.querySelectorAll('li[role="tab"]')).map(li => li.textContent.trim());

  // Get tab panels by tab order
  // Each tabpanel corresponds to a tab label by order of appearance
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Build the table header row (block name as required)
  const headerRow = ['Tabs (tabs21)'];

  // The first table row after the header is a list of tab headers (as in the example, one row with all tab labels)
  // The actual block example shows the tab labels as column headers for the content
  // But based on the markdown, each subsequent row represents a tab: [Tab Label, Tab Content]

  // But actually, the example expects:
  // header: ['Tabs (tabs21)']
  // each row: [Tab Label, Tab Content]

  // Defensive: ensure we only make as many rows as there are tab headers and panels
  const rows = tabHeaders.map((tabLabel, idx) => {
    const panel = tabPanels[idx];
    if (!panel) {
      return [tabLabel, ''];
    }
    // The content we want is the entirety of the tab panel, but avoid including the tab panel's wrapper div which has ARIA attributes, etc.
    // Instead, extract the direct content inside the panel.
    // This is more robust in case of extra wrappers, so we'll just use the childNodes of the panel.
    const contents = Array.from(panel.childNodes).filter(node => {
      // Filter out empty text nodes
      return !(node.nodeType === Node.TEXT_NODE && !node.textContent.trim());
    });
    return [tabLabel, contents.length === 1 ? contents[0] : contents];
  });

  const tableData = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(tableData, document);
  tabsWrapper.replaceWith(table);
}
