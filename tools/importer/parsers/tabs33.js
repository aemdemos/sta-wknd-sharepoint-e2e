/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsBlock) return;

  // Find the cmp-tabs element (the actual tabs container)
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels from the tablist
  const tabLabels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get tab panels (content)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Defensive: Only keep panels with a matching label
  const tabs = tabLabels.map((label, idx) => {
    // Find the tab panel matching this label
    const ariaControls = label.getAttribute('aria-controls');
    const panel = cmpTabs.querySelector(`#${ariaControls}`);
    return {
      label,
      panel
    };
  });

  // Build the table rows
  const headerRow = ['Tabs (tabs33)'];
  const rows = [headerRow];

  tabs.forEach(({ label, panel }) => {
    // Tab label cell: use the label text
    const tabLabelCell = document.createElement('div');
    tabLabelCell.textContent = label.textContent.trim();
    tabLabelCell.style.fontWeight = 'bold';

    // Tab content cell: use the full tab panel content
    // Defensive: If the panel contains a contentfragment/article, use that
    let tabContentCell;
    if (panel) {
      // Find the main contentfragment/article inside the panel
      const contentFragment = panel.querySelector('article.cmp-contentfragment');
      if (contentFragment) {
        tabContentCell = contentFragment;
      } else {
        // fallback: use the panel itself
        tabContentCell = panel;
      }
    } else {
      tabContentCell = document.createElement('div');
      tabContentCell.textContent = '';
    }
    rows.push([tabLabelCell, tabContentCell]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs block with the new table
  tabsBlock.replaceWith(block);
}
