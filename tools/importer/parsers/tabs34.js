/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block in the provided element
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Get the tab labels (li elements)
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get the tab panels (div[role=tabpanel])
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[role="tabpanel"]'));

  // Defensive: ensure the number of tabs matches the number of panels
  if (tabLabels.length === 0 || tabPanels.length === 0) return;

  // Table header row
  const headerRow = ['Tabs (tabs34)'];
  const rows = [headerRow];

  // For each tab, add a row: [Tab Label, Tab Content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    // Defensive: ensure we have a matching panel
    const panel = tabPanels[i];
    if (!panel) continue;

    // Extract the main content of the tab panel
    // We'll use the first .contentfragment (article) inside the panel
    const contentFragment = panel.querySelector('article.cmp-contentfragment');
    let tabContent;
    if (contentFragment) {
      // Use the entire contentfragment (includes h3, content, images, etc.)
      tabContent = contentFragment;
    } else {
      // Fallback: use the panel's content
      tabContent = panel;
    }

    rows.push([label, tabContent]);
  }

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs block with the table
  tabsBlock.replaceWith(table);
}
