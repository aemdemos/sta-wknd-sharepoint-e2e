/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-tabs block inside the given element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get all the tab labels from the tablist in order
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('li[role="tab"]').forEach(li => {
      tabLabels.push(li.textContent.trim());
    });
  }

  // Get all tab panels in the DOM order
  const tabPanels = tabs.querySelectorAll('[role="tabpanel"][data-cmp-hook-tabs="tabpanel"]');
  // For each tab panel, extract its "main content". We'll use the first article.cmp-contentfragment or .cmp-contentfragment inside.
  const tabContents = Array.from(tabPanels).map(panel => {
    // Get *all* children, not just article, since sometimes .cmp-contentfragment may be present as a direct child
    const contentFragment = panel.querySelector('article.cmp-contentfragment, .cmp-contentfragment');
    // If found, return the element; else, fall back to the panel
    return contentFragment ? contentFragment : panel;
  });

  // Compose the block table array: first row is header, then one row per tab (label, content)
  const headerRow = ['Tabs (tabs7)'];
  const rows = [headerRow];
  for (let i = 0; i < tabLabels.length; i++) {
    // Defensive: only add row if there is a tab label
    if (tabLabels[i]) {
      rows.push([
        tabLabels[i],
        tabContents[i] || ''
      ]);
    }
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element with the newly structured table
  element.replaceWith(table);
}
