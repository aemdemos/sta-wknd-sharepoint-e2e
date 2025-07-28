/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-tabs container inside the element
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Find tab labels (li elements in tablist)
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const labelNodes = tabList ? Array.from(tabList.querySelectorAll('li[role="tab"]')) : [];
  const tabLabels = labelNodes.map(li => li.textContent.trim());

  // Find tab panels (each with tab content)
  const panels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));

  // The table header row, exactly as specified
  const headerRow = ['Tabs (tabs25)'];
  // The labels row, as in the example: Tab 1, Tab 2, ...
  const labelsRow = tabLabels;

  // Now create the content row, one cell for each tab, referencing the corresponding panel content
  // Each content cell should reference (not clone/copy) the main content in the panel
  // We'll try to grab the inner content of the .cmp-contentfragment__elements inside each tabpanel, or fallback to the tabpanel itself
  const contentRow = panels.map(panel => {
    // Look for .cmp-contentfragment__elements inside the panel
    const content = panel.querySelector('.cmp-contentfragment__elements');
    if (content) {
      return content;
    } else {
      // Fallback: use all children except the tab title if present
      // e.g. avoid repeating the h3 title in every tab content
      const fragment = document.createDocumentFragment();
      Array.from(panel.children).forEach(child => {
        if (!child.classList.contains('cmp-contentfragment__title')) {
          fragment.appendChild(child);
        }
      });
      // If nothing found, just return the whole panel
      if (fragment.childNodes.length > 0) {
        return fragment;
      }
      return panel;
    }
  });

  // Compose the final table: header, labels row, content row
  const cells = [
    headerRow,
    labelsRow,
    contentRow
  ];

  // Create table and replace the tabs block with it
  const table = WebImporter.DOMUtils.createTable(cells, document);
  tabsBlock.replaceWith(table);
}
