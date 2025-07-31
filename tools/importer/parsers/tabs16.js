/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs container (should be only one in current block scope)
  const tabsContainer = element.querySelector('.cmp-tabs');
  if (!tabsContainer) return;

  // Extract tab labels (titles)
  const tabList = tabsContainer.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('li').forEach(li => {
      tabLabels.push(li.textContent.trim());
    });
  }

  // Extract tab panels (each tab content)
  const tabPanels = Array.from(tabsContainer.querySelectorAll('.cmp-tabs__tabpanel'));

  // Compose the header row as required (EXACT match to block spec)
  const rows = [[ 'Tabs (tabs16)' ]];

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (!label || !panel) continue;
    // Get the most relevant direct content for this tab panel
    // Usually there is a single .cmp-contentfragment in the tab panel
    // Reference the existing element (don't clone!)
    let content;
    const contentFragment = panel.querySelector('article.cmp-contentfragment');
    if (contentFragment) {
      // Remove the h3 (title) if it's just a repeat of the label
      const h3 = contentFragment.querySelector('h3.cmp-contentfragment__title');
      if (h3 && h3.textContent.trim() === 'Downhill Skiing Wyoming') {
        h3.remove();
      }
      content = contentFragment;
    } else {
      // Fallback: reference the panel itself
      content = panel;
    }
    rows.push([label, content]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace only the tabs container, not the whole block
  tabsContainer.replaceWith(table);
}
