/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container
  const tabsContainer = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  let cmpTabs = tabsContainer;
  if (tabsContainer && !tabsContainer.classList.contains('cmp-tabs')) {
    cmpTabs = tabsContainer.querySelector('.cmp-tabs');
  }
  if (!cmpTabs) return;

  // Get tab labels from the tablist
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist .cmp-tabs__tab'));
  // Get tab panels (content)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Defensive: ensure we have matching labels and panels
  if (!tabLabels.length || !tabPanels.length) return;

  // Build the table rows
  const headerRow = ['Tabs (tabs28)'];
  const rows = [headerRow];

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];
    let content = null;
    if (panel) {
      // Try to find the main contentfragment/article inside the tab panel
      let contentFragment = panel.querySelector('article.cmp-contentfragment');
      if (!contentFragment) {
        // fallback: just use the panel itself
        content = panel;
      } else {
        // Remove the contentfragment title if present (to avoid duplicate tab label)
        const cfTitle = contentFragment.querySelector('.cmp-contentfragment__title');
        if (cfTitle) cfTitle.remove();
        content = contentFragment;
      }
    }
    // Defensive: if no content, use empty string
    rows.push([label, content || '']);
  }

  // Create the table and replace the original tabs container
  const table = WebImporter.DOMUtils.createTable(rows, document);
  tabsContainer.replaceWith(table);
}
