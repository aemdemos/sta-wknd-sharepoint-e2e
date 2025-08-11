/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block (cmp-tabs)
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels from ordered list
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get tab panels (tab content)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Prepare header row: exactly as example - 'Tabs (tabs30)'
  const headerRow = ['Tabs (tabs30)'];

  // Prepare tab rows
  const rows = tabLabels.map((tabLabel, i) => {
    // Tab label text
    const label = tabLabel.textContent.trim();
    // Tab content: usually a contentfragment inside each tabpanel
    const tabPanel = tabPanels[i];
    let content;
    if (tabPanel) {
      // Reference the whole article or tabPanel structure for resilience
      const contentFragment = tabPanel.querySelector('article.cmp-contentfragment');
      if (contentFragment) {
        content = contentFragment;
      } else {
        // Fallback: use tabPanel if no article is present
        content = tabPanel;
      }
    } else {
      // If no tabPanel, return empty string for content cell
      content = '';
    }
    return [label, content];
  });

  // Compose cells for table
  const cells = [headerRow, ...rows];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the tabsBlock element with the block table
  tabsBlock.parentNode.replaceChild(block, tabsBlock);
}
