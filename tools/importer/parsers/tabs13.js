/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block inside the provided element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Find the tab label elements
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabelNodes = Array.from(tabList.querySelectorAll('.cmp-tabs__tab'));
  const tabLabels = tabLabelNodes.map(tab => tab.textContent.trim());

  // Find the tab panels (contents)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));

  // Early exit if no tabs
  if (tabLabels.length === 0 || tabPanels.length === 0) return;

  // First row: block header
  const cells = [["Tabs (tabs13)"]];
  // Second row: tab label headers (one header per tab)
  cells.push(tabLabels);
  // Third row: tab content cells, one for each panel
  const tabContentRow = tabPanels.map(panel => {
    // Typically the relevant content is a direct child <div class="contentfragment">
    // or a single article. We want to reference the content block itself for resilience.
    const contentFragment = panel.querySelector('.contentfragment');
    if (contentFragment) return contentFragment;
    // fallback: use the whole panel if nothing else
    return panel;
  });
  cells.push(tabContentRow);

  // Create the table and replace the tabs block in the DOM
  const table = WebImporter.DOMUtils.createTable(cells, document);
  tabsBlock.replaceWith(table);
}