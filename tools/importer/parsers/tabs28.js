/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container
  const tabsContainer = element.querySelector('.tabs.panelcontainer');
  if (!tabsContainer) return;

  // Find the tabs block inside the container
  const cmpTabs = tabsContainer.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels from the tablist
  const tabLabels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  ).map(tab => tab.textContent.trim());

  // Get tab panels (content)
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // Defensive: Must have same number of labels and panels
  if (tabLabels.length !== tabPanels.length) return;

  // Build table rows
  const headerRow = ['Tabs (tabs28)'];
  const rows = [headerRow];

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];

    // Find the main content fragment/article inside the panel
    let tabContent = null;
    const contentFragment = panel.querySelector('article.cmp-contentfragment');
    if (contentFragment) {
      // Use the contentfragment's .cmp-contentfragment__elements if present
      const elements = contentFragment.querySelector('.cmp-contentfragment__elements');
      if (elements) {
        tabContent = elements;
      } else {
        tabContent = contentFragment;
      }
    } else {
      // Fallback: use the panel itself
      tabContent = panel;
    }

    // Create the row: [Tab Label, Tab Content]
    rows.push([
      label,
      tabContent
    ]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabsContainer with the block table
  tabsContainer.replaceWith(block);
}
