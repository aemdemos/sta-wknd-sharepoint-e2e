/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block within the element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels from the tablist
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tabList ? tabList.querySelectorAll('[role="tab"]') : []).map(tab => tab.textContent.trim());

  // Get all tabpanel divs (in order)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Build header row: block name
  const headerRow = ['Tabs (tabs8)'];

  // For each tab, create a row with tab label and tab content
  const tabRows = tabPanels.map((panel, i) => {
    // Get the contentfragment/article inside the panel
    let tabContent;
    const contentFragment = panel.querySelector('.contentfragment, article');
    if (contentFragment) {
      tabContent = contentFragment;
    } else {
      // Fallback: group all child nodes into a container
      const wrapper = document.createElement('div');
      Array.from(panel.childNodes).forEach(child => {
        wrapper.appendChild(child);
      });
      tabContent = wrapper;
    }
    return [tabLabels[i], tabContent];
  });

  // Compose the block table
  // First row: single header cell
  // Next rows: [tab label, tab content] per tab
  const tableRows = [headerRow, ...tabRows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original tabs block with our block table
  tabsBlock.replaceWith(block);
}
