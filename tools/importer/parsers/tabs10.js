/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get tab panels
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[role="tabpanel"]'));

  // Defensive: Only proceed if we have matching labels and panels
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Header row as specified
  const headerRow = ['Tabs (tabs10)'];
  const rows = [headerRow];

  // For each tab, create a row: [Tab Label, Tab Content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];
    // Defensive: Find the main content inside the panel
    let content = null;
    // Prefer the contentfragment/article if present
    const contentFragment = panel.querySelector('.contentfragment, article.cmp-contentfragment');
    if (contentFragment) {
      content = contentFragment;
    } else {
      // fallback: use all children of panel
      content = document.createElement('div');
      Array.from(panel.childNodes).forEach(node => {
        content.appendChild(node.cloneNode(true));
      });
    }
    rows.push([label, content]);
  }

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  tabsBlock.replaceWith(block);
}
