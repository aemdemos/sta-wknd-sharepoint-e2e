/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the tabs block within the element
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsBlock) return;

  // Find the cmp-tabs element (may be nested)
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs') || tabsBlock;
  if (!cmpTabs) return;

  // Get tab labels from the tablist
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li[role="tab"]'));

  // Get all tab panels
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[role="tabpanel"]'));

  // Defensive: Only include tabs with both label and panel
  const rows = [];
  for (let i = 0; i < tabLabels.length; i++) {
    const labelEl = tabLabels[i];
    const labelText = labelEl.textContent.trim();
    // Find the panel by aria-controls or order
    let panelEl = tabPanels.find(
      p => p.id === labelEl.getAttribute('aria-controls')
    ) || tabPanels[i];
    if (!panelEl) continue;

    // Tab content: find the main contentfragment/article inside the panel
    let content = null;
    const contentFragment = panelEl.querySelector('.contentfragment, article.cmp-contentfragment');
    if (contentFragment) {
      // Use the entire contentfragment/article as the content cell
      content = contentFragment;
    } else {
      // Fallback: use all children of the panel
      content = document.createElement('div');
      Array.from(panelEl.childNodes).forEach(node => {
        content.append(node);
      });
    }

    rows.push([labelText, content]);
  }

  // Table header row
  const headerRow = ['Tabs (tabs19)'];
  const cells = [headerRow, ...rows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original tabs block with the block table
  tabsBlock.replaceWith(block);
}
