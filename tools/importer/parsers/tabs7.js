/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block (cmp-tabs)
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Grab the tab labels
  const tabLabelEls = Array.from(
    tabs.querySelectorAll('.cmp-tabs__tablist > [role="tab"]')
  );
  const tabLabels = tabLabelEls.map(tab => tab.textContent.trim());

  // Find the tab panels - maintain their order as in the tab list
  const tabPanelEls = [];
  tabLabelEls.forEach(tabLabelEl => {
    const controls = tabLabelEl.getAttribute('aria-controls');
    if (controls) {
      const panel = tabs.querySelector(`#${controls}`);
      tabPanelEls.push(panel);
    } else {
      tabPanelEls.push(null);
    }
  });

  // Build table: header first, then a row for each tab (label, content)
  const table = [ ['Tabs (tabs7)'] ];

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanelEls[i];
    // For the tab content, grab the first child with significant content
    let contentCell = null;
    if (panel) {
      // Use the main content fragment or panel itself
      let contentFragment = panel.querySelector('article') || panel.querySelector('.contentfragment') || panel;
      // Clean out empty .aem-Grid wrappers inside the content fragment
      if (contentFragment !== panel) {
        let grids = contentFragment.querySelectorAll('.aem-Grid');
        grids.forEach(grid => {
          if (!grid.textContent.trim() && !grid.querySelector('img, h1, h2, h3, h4, h5, h6, p, ul, ol, li, a')) {
            grid.remove();
          }
        });
      }
      contentCell = contentFragment;
    }
    table.push([label, contentCell]);
  }

  // Create and replace with the tabs block
  const block = WebImporter.DOMUtils.createTable(table, document);
  element.replaceWith(block);
}
