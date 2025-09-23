/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs.panelcontainer');
  if (!tabsBlock) return;

  // Find the cmp-tabs container
  const tabs = tabsBlock.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels from the tablist
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tabList.querySelectorAll('.cmp-tabs__tab')).map(tab => tab.textContent.trim());

  // Get tab panels (content for each tab, in order)
  const tabPanels = Array.from(tabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Compose rows: header, then each tab label + content
  const rows = [];
  // Header row: always block name per spec
  rows.push(['Tabs (tabs29)']);

  // For each tab, add a row with [label, content]
  tabPanels.forEach((panel, idx) => {
    // Defensive: get label
    const label = tabLabels[idx] || `Tab ${idx+1}`;
    // Defensive: get tab content
    // We'll use the entire panel's content, but remove the .cmp-contentfragment__title if present
    const cf = panel.querySelector('.contentfragment');
    let tabContent;
    if (cf) {
      // Remove .cmp-contentfragment__title if present
      const cfTitle = cf.querySelector('.cmp-contentfragment__title');
      if (cfTitle) cfTitle.remove();
      // Use the rest of the contentfragment as tab content (reference, not clone)
      tabContent = cf;
    } else {
      // Fallback: use panel itself
      tabContent = panel;
    }
    rows.push([label, tabContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs block with the new block table
  tabsBlock.replaceWith(block);
}
