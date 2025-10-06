/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = element.querySelector('.tabs.panelcontainer');
  if (!tabsRoot) return;

  // Find the cmp-tabs container
  const cmpTabs = tabsRoot.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels from the tablist
  const tabLabels = [];
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  if (tabList) {
    tabList.querySelectorAll('.cmp-tabs__tab').forEach(tab => {
      tabLabels.push(tab.textContent.trim());
    });
  }

  // Get tab panels (content)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[role="tabpanel"]'));

  // Compose rows: header, then one row per tab
  const rows = [];
  // Header row as per spec
  rows.push(['Tabs (tabs8)']);

  // For each tab, add a row with [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    // Defensive: find the corresponding tabpanel
    const panel = tabPanels[i];
    let contentEl = null;
    if (panel) {
      // The content is inside the .contentfragment > article > .cmp-contentfragment__elements
      const contentFragment = panel.querySelector('.contentfragment');
      if (contentFragment) {
        // Try to find the main content area
        const article = contentFragment.querySelector('article');
        if (article) {
          // The .cmp-contentfragment__elements contains the tab content
          const elements = article.querySelector('.cmp-contentfragment__elements');
          if (elements) {
            // Use the entire .cmp-contentfragment__elements as the content cell
            contentEl = elements;
          } else {
            // fallback to article
            contentEl = article;
          }
        } else {
          contentEl = contentFragment;
        }
      } else {
        contentEl = panel;
      }
    }
    // Defensive: if no content, use empty string
    rows.push([label, contentEl || '']);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs block with the new table
  tabsRoot.replaceWith(table);
}
