/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container
  const tabsContainer = element.querySelector('.tabs.panelcontainer');
  if (!tabsContainer) return;

  // Find the cmp-tabs block
  const cmpTabs = tabsContainer.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist > li'));
  if (tabLabels.length === 0) return;

  // Get tab panels
  const tabPanels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tabpanel'));
  if (tabPanels.length !== tabLabels.length) return;

  // Build header row
  const headerRow = ['Tabs (tabs30)'];

  // Build rows: each row is [tab label, tab content]
  const rows = [headerRow];
  for (let i = 0; i < tabLabels.length; i++) {
    // Tab label cell (strong)
    const labelCell = document.createElement('strong');
    labelCell.textContent = tabLabels[i].textContent.trim();

    // Tab content cell
    const panel = tabPanels[i];
    let contentCell = document.createElement('div');
    const contentFragment = panel.querySelector('.contentfragment');
    if (contentFragment) {
      // Remove the title (h3) if present
      const children = Array.from(contentFragment.children).filter(child => !child.classList.contains('cmp-contentfragment__title'));
      if (children.length > 0) {
        children.forEach(child => contentCell.appendChild(child));
      } else {
        contentCell.appendChild(contentFragment);
      }
    } else {
      contentCell.appendChild(panel);
    }
    rows.push([labelCell, contentCell]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace tabsContainer with the block
  tabsContainer.replaceWith(block);
}
