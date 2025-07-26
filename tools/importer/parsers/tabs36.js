/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs block within the input element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Find the tab labels (in <ol> with class cmp-tabs__tablist)
  const tabLabels = Array.from(
    tabsBlock.querySelectorAll(':scope > .cmp-tabs__tablist > .cmp-tabs__tab, :scope > ol.cmp-tabs__tablist > .cmp-tabs__tab')
  );

  // If not found via above, try the original selector
  if (tabLabels.length === 0) {
    const fallbackTabLabels = Array.from(
      tabsBlock.querySelectorAll('.cmp-tabs__tablist > .cmp-tabs__tab')
    );
    tabLabels.push(...fallbackTabLabels);
  }

  // Find all tabpanels (each has role="tabpanel" and class cmp-tabs__tabpanel)
  const tabPanels = Array.from(
    tabsBlock.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Build table rows
  const rows = [];
  // Header row: block name
  rows.push(['Tabs (tabs36)']);

  // Each subsequent row: [tab label, tab content]
  for (let i = 0; i < tabLabels.length; i++) {
    const tabLabel = tabLabels[i];
    // Defensive: skip if tabPanel not found for label
    if (!tabPanels[i]) continue;
    
    const tabPanel = tabPanels[i];
    // Use the tab label's text
    const labelText = tabLabel ? tabLabel.textContent.trim() : '';

    // For content, reference the contentfragment if available, else the tabPanel
    let content = null;
    if (tabPanel) {
      const contentFragment = tabPanel.querySelector('.contentfragment');
      if (contentFragment) {
        content = contentFragment;
      } else {
        // If no contentfragment, reference the whole tabPanel
        content = tabPanel;
      }
    } else {
      content = document.createTextNode('');
    }
    rows.push([labelText, content]);
  }

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs block with the table
  tabsBlock.replaceWith(blockTable);
}
