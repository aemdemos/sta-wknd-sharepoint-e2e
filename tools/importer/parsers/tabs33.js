/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block container
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels from tablist
  const tabLabels = Array.from(
    tabsBlock.querySelectorAll('.cmp-tabs__tablist > li')
  ).map(li => li.textContent.trim());

  // Get tab panels in order (role=tabpanel)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Prepare header row -- matches example exactly
  const headerRow = ['Tabs (tabs33)'];

  // Collect tab rows [label, tabContent]
  const tabRows = tabLabels.map((label, idx) => {
    // Get the corresponding tab panel for label
    const panel = tabPanels[idx];
    let tabContent;
    if (panel) {
      // Reference everything inside the contentfragment (if available), else everything in panel
      const contentFragment = panel.querySelector('.contentfragment');
      if (contentFragment) {
        tabContent = contentFragment;
      } else {
        // If no contentfragment, collect all children from panel
        const children = Array.from(panel.childNodes).filter(n =>
          !(n.nodeType === 3 && !n.textContent.trim()) // filter empty text nodes
        );
        tabContent = children.length === 1 ? children[0] : children;
      }
    } else {
      tabContent = '';
    }
    return [label, tabContent];
  });

  // Compose table rows for the block table
  const rows = [headerRow, ...tabRows];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace tabsBlock with block table
  tabsBlock.parentNode.replaceChild(block, tabsBlock);
}
