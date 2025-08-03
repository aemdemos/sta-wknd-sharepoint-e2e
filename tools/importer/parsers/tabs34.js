/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the main tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get all tab labels
  const tabLabelEls = Array.from(
    tabsBlock.querySelectorAll('.cmp-tabs__tablist > li[role="tab"]')
  );
  if (!tabLabelEls.length) return;

  // Get all tab panels (one per tab)
  const tabPanels = Array.from(
    tabsBlock.querySelectorAll('.cmp-tabs__tabpanel')
  );
  // Defensive: ensure panel count matches label count
  const minCount = Math.min(tabLabelEls.length, tabPanels.length);

  // Header row as per specs
  const headerRow = ['Tabs (tabs34)'];
  // Tab labels row
  const labelsRow = [];
  for(let i=0; i<minCount; i++) {
    // Use a <strong> for tab label for clear tab label styling
    const strong = document.createElement('strong');
    strong.textContent = tabLabelEls[i].textContent.trim();
    labelsRow.push(strong);
  }

  // Tab content row
  const contentRow = [];
  for(let i=0; i<minCount; i++) {
    const panel = tabPanels[i];
    // Find the first major content element inside the tabpanel
    // Prefer .contentfragment article, fallback to panel contents
    let content = null;
    const contentFragment = panel.querySelector('.contentfragment') || panel.querySelector('article') || panel.querySelector('.cmp-contentfragment');
    if (contentFragment) {
      content = contentFragment;
    } else {
      // fallback: use the panel directly
      content = panel;
    }
    contentRow.push(content);
  }

  // Compose table: header, label row, content row
  const cells = [
    headerRow,
    labelsRow,
    contentRow
  ];

  // Create the block table
  const tableBlock = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the tabs block (not the full element, just the cmp-tabs part)
  tabsBlock.replaceWith(tableBlock);
}
