/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs block within the element
  const tabsWrapper = element.querySelector('.tabs .cmp-tabs');
  if (!tabsWrapper) return;

  // 1. Extract tab labels (in order as shown in the UI)
  const tabLabelElements = Array.from(tabsWrapper.querySelectorAll('.cmp-tabs__tablist > li'));
  if (!tabLabelElements.length) return;
  const tabLabels = tabLabelElements.map(li => li.textContent.trim());

  // 2. Extract tab panels (tabpanel elements, in DOM order)
  // These are the actual tab content panels
  const tabPanels = Array.from(
    tabsWrapper.querySelectorAll('[role="tabpanel"][data-cmp-hook-tabs="tabpanel"]')
  );

  // Edge-case check: tabLabels and tabPanels count mismatch
  // We'll stop at the shortest length
  const tabCount = Math.min(tabLabels.length, tabPanels.length);

  // 3. Build the header row
  const headerRow = ['Tabs (tabs3)'];

  // 4. Build the tab label row (one cell per tab)
  const tabLabelRow = tabLabels.slice(0, tabCount);

  // 5. Build the tab content row (reference the content of each tab panel)
  //   - Use the main contentfragment/article if present, otherwise use the panel itself (all child nodes)
  const tabContentRow = [];
  for(let i=0; i<tabCount; i++) {
    const panel = tabPanels[i];
    // The tab panel may have nested structures, but typically contains a .contentfragment as main content
    // Use the first .contentfragment/article if present, else fallback to panel inner content
    let contentToUse = panel.querySelector('.contentfragment');
    if (!contentToUse) {
      // fallback: use all child nodes of the panel as an array
      // (filter out empty text nodes)
      contentToUse = Array.from(panel.childNodes).filter(
        n => !(n.nodeType === Node.TEXT_NODE && !n.textContent.trim())
      );
      // If only one element, use it, else array
      if (contentToUse.length === 1) contentToUse = contentToUse[0];
    }
    tabContentRow.push(contentToUse);
  }

  // 6. Compose the final block table: header row, then tab label row, then tab content row
  //    This is a 2-column table (for tab blocks with n tabs: header row, then label row, then content row)
  const cells = [
    headerRow,
    tabLabelRow,
    tabContentRow,
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the tabs block (not the whole element, just the .cmp-tabs) with the new table
  tabsWrapper.replaceWith(table);
}
