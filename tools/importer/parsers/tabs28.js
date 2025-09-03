/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the tabs block root
  const tabsRoot = element;
  if (!tabsRoot) return;

  // Find tab labels (li elements)
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li'));

  // Find tab panels (div[role=tabpanel])
  const tabPanels = Array.from(tabsRoot.querySelectorAll('[role="tabpanel"]'));

  // Defensive: ensure labels and panels match
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Build table rows
  const headerRow = ['Tabs (tabs28)'];
  const rows = [headerRow];

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];

    // Defensive: get the main content fragment inside the panel
    let content = null;
    // Try to find a contentfragment/article, else fallback to panel itself
    content = panel.querySelector('article') || panel.querySelector('.contentfragment') || panel;

    // If contentfragment, use its children (not the wrapper)
    // But for resilience, reference the whole content block
    rows.push([label, content]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs element
  tabsRoot.replaceWith(block);
}
