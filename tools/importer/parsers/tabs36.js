/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block container
  const tabsBlock = element.querySelector('.tabs.panelcontainer');
  if (!tabsBlock) return;

  // Find the cmp-tabs inside the tabs block
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels from the tablist
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist .cmp-tabs__tab')).map(tab => tab.textContent.trim());

  // Get tab panels (content)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[role="tabpanel"]'));

  // Defensive: Only proceed if labels and panels match
  if (tabLabels.length !== tabPanels.length) return;

  // Extract sidebar content (Activity, Adventure Type, Trip Length, Group Size, Difficulty, Price, Share this Adventure)
  const sidebar = element.querySelector('.contentfragment.cmp-contentfragment--colorado-rock-climbing');
  let sidebarContent = '';
  if (sidebar) {
    // Get all dt/dd pairs
    const pairs = Array.from(sidebar.querySelectorAll('.cmp-contentfragment__element'));
    sidebarContent = document.createElement('div');
    pairs.forEach(pair => {
      const dt = pair.querySelector('dt');
      const dd = pair.querySelector('dd');
      if (dt && dd) {
        const row = document.createElement('div');
        row.appendChild(dt.cloneNode(true));
        row.appendChild(dd.cloneNode(true));
        sidebarContent.appendChild(row);
      }
    });
    // Add 'Share this Adventure' if present
    const shareTitle = element.querySelector('.title .cmp-title__text');
    if (shareTitle && shareTitle.textContent.trim().toLowerCase() === 'share this adventure') {
      const shareDiv = document.createElement('div');
      shareDiv.textContent = shareTitle.textContent.trim();
      sidebarContent.appendChild(shareDiv);
    }
  }

  // Build table rows
  const rows = [];
  // Header row
  rows.push(['Tabs (tabs36)']);

  // For each tab, add a row: [Tab Label, Tab Content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    let contentElem = null;
    // Try to find a direct content fragment/article inside the tabpanel
    const contentFragment = panel.querySelector('.contentfragment, article, .cmp-contentfragment');
    if (contentFragment) {
      contentElem = contentFragment;
    } else {
      // fallback: use the panel itself
      contentElem = panel;
    }
    // Tab content cell: include sidebar for first tab, otherwise just tab content
    if (i === 0 && sidebarContent) {
      // Create a wrapper div for sidebar and tab content
      const wrapper = document.createElement('div');
      wrapper.appendChild(sidebarContent.cloneNode(true));
      wrapper.appendChild(contentElem.cloneNode(true));
      rows.push([label, wrapper]);
    } else {
      rows.push([label, contentElem]);
    }
  }

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs block with the table
  tabsBlock.replaceWith(table);
}
