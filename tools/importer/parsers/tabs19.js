/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsBlock = element.querySelector('.tabs.panelcontainer');
  if (!tabsBlock) return;

  // Find the actual tabs component
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get the tab labels from the tablist in visual order
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabElements = Array.from(tabList.querySelectorAll('[role="tab"]'));
  const tabLabels = tabElements.map(tab => tab.textContent.trim());

  // Get all tab panels in DOM order
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[role="tabpanel"]'));

  // Defensive: match tabs to panels by index: label[i] = content[i]
  // Build the table rows
  const headerRow = ['Tabs (tabs19)'];
  const cells = [headerRow];

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (!panel) continue; // If for any reason a tab panel is missing, skip

    // Content: prefer the main content fragment/article content
    // Take the first .contentfragment > article (as in the provided HTML)
    let contentBlock = null;
    const contentFragment = panel.querySelector('.contentfragment');
    if (contentFragment) {
      const article = contentFragment.querySelector('article');
      if (article) {
        contentBlock = article;
      } else {
        // If no article (degenerate case), use the fragment
        contentBlock = contentFragment;
      }
    } else {
      // Otherwise, use the panel itself
      contentBlock = panel;
    }
    // Add this tab row
    cells.push([label, contentBlock]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the block
  tabsBlock.replaceWith(table);
}
