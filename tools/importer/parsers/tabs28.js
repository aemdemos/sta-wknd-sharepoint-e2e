/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block (panelcontainer or cmp-tabs)
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsBlock) return;

  // Find the .cmp-tabs inside
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels from the tablist
  const tabLabels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist > li')
  ).map(tab => tab.textContent.trim());

  // Get tab panels (content)
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // Defensive: ensure labels and panels match
  if (tabLabels.length !== tabPanels.length) return;

  // Build table rows
  const rows = [];
  // Header row: must match block name exactly
  rows.push(['Tabs (tabs28)']);

  // Each tab: label in col 1, content in col 2
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    // Defensive: get the main content fragment inside the panel
    let tabContent = null;
    const contentFragment = panel.querySelector('.cmp-contentfragment');
    if (contentFragment) {
      // Use the .cmp-contentfragment__elements if present
      const elements = contentFragment.querySelector('.cmp-contentfragment__elements');
      if (elements) {
        tabContent = elements;
      } else {
        tabContent = contentFragment;
      }
    } else {
      // Fallback: use panel itself
      tabContent = panel;
    }
    rows.push([label, tabContent]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs block with the new block
  tabsBlock.replaceWith(block);
}
