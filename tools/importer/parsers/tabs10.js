/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs.panelcontainer');
  if (!tabsBlock) return;
  const cmpTabs = tabsBlock.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels in order
  const tabLabels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist .cmp-tabs__tab')
  ).map(tab => tab.textContent.trim());

  // Get tab panels in order
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // Defensive: Only keep as many panels as there are labels
  const tabRows = [];
  for (let i = 0; i < tabLabels.length && i < tabPanels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    // Find the main contentfragment/article inside the panel
    let tabContent = null;
    const contentFragment = panel.querySelector('article.cmp-contentfragment');
    if (contentFragment) {
      // Use only the inner content (not the h3 title, which is repeated)
      const elements = contentFragment.querySelector('.cmp-contentfragment__elements');
      if (elements) {
        // Remove empty grid wrappers
        const meaningful = Array.from(elements.children).filter(child => {
          // filter out empty grid wrappers
          if (
            child.children.length === 1 &&
            child.firstElementChild.classList.contains('aem-Grid')
          ) {
            return false;
          }
          return true;
        });
        // If only one meaningful child, use it directly
        if (meaningful.length === 1) {
          tabContent = meaningful[0];
        } else if (meaningful.length > 1) {
          // Wrap multiple elements in a div for semantic grouping
          const wrapper = document.createElement('div');
          meaningful.forEach(el => wrapper.appendChild(el));
          tabContent = wrapper;
        } else {
          tabContent = elements;
        }
      } else {
        tabContent = contentFragment;
      }
    } else {
      tabContent = panel;
    }
    tabRows.push([label, tabContent]);
  }

  // Build the table
  const headerRow = ['Tabs (tabs10)'];
  const cells = [headerRow, ...tabRows];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the tabs block with the new table
  tabsBlock.replaceWith(table);
}
