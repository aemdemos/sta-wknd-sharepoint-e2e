/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block inside the provided element
  // Accept either .cmp-tabs or .tabs
  const tabsBlock = element.querySelector('.cmp-tabs, .tabs');
  if (!tabsBlock) return;

  // Get tab labels from the tab list (li inside ol[role=tablist])
  const tabList = tabsBlock.querySelector('ol[role="tablist"]');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.children).map(tab => tab.textContent.trim());

  // Get all tab panels in order
  // Each panel should have role=tabpanel and data-cmp-hook-tabs="tabpanel"
  const tabPanels = Array.from(tabsBlock.querySelectorAll('div[role="tabpanel"][data-cmp-hook-tabs="tabpanel"]'));
  // If number of tabs doesn't match number of panels, continue with min count
  const nTabs = Math.min(tabLabels.length, tabPanels.length);

  // Table header must be exactly as given in the instructions
  const headerRow = ['Tabs (tabs18)'];
  const cells = [headerRow];

  // Each row: [Tab Label, Tab Content]
  for (let i = 0; i < nTabs; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    // Get the panel's main content: usually an article.cmp-contentfragment
    let contentElement;
    // Sometimes content fragment is inside a div.contentfragment
    const contentFragArticle = panel.querySelector('article.cmp-contentfragment');
    if (contentFragArticle) {
      contentElement = contentFragArticle;
    } else {
      // Try the first child of panel if exists
      if (panel.children.length === 1) {
        contentElement = panel.children[0];
      } else if (panel.children.length > 1) {
        // Wrap all children in a fragment
        const frag = document.createDocumentFragment();
        Array.from(panel.children).forEach(child => frag.appendChild(child));
        contentElement = frag;
      } else {
        // Panel is empty: fallback to empty string
        contentElement = '';
      }
    }
    // Push both tab label and content (reference existing elements)
    cells.push([label, contentElement]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the tabs block with the table
  tabsBlock.replaceWith(block);
}
