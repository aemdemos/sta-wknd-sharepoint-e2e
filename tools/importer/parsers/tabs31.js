/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the tabs block
  const tabsBlock = element.querySelector('.tabs.panelcontainer');
  if (!tabsBlock) return;

  // Find the main tabs container
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get tab panels
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: ensure matching labels/panels
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Table header row
  const headerRow = ['Tabs (tabs31)'];
  const rows = [headerRow];

  // For each tab, add a row: [label, content]
  tabLabels.forEach((labelEl, i) => {
    // Tab label text
    const labelText = labelEl.textContent.trim();

    // Tab panel content
    const panel = tabPanels[i];
    // Defensive: get the contentfragment/article inside panel
    let tabContent = null;
    const contentFragment = panel.querySelector('.contentfragment');
    if (contentFragment) {
      // Use the whole contentfragment/article as content
      const article = contentFragment.querySelector('article');
      tabContent = article ? article : contentFragment;
    } else {
      // Fallback: use all children
      tabContent = document.createElement('div');
      Array.from(panel.childNodes).forEach((node) => tabContent.appendChild(node.cloneNode(true)));
    }

    rows.push([labelText, tabContent]);
  });

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace tabsBlock with block table
  tabsBlock.replaceWith(block);
}
