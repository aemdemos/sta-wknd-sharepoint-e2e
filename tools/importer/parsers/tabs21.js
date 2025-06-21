/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs root block
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // 1. Get tab labels in order
  const tabLabelElements = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tablist > li'));
  if (!tabLabelElements.length) return;

  // 2. Get tab panels in order
  const tabPanelElements = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tabpanel'));

  // Sanity check: must have same number of labels and panels
  if (tabLabelElements.length !== tabPanelElements.length) return;

  // 3. Build table header
  const headerRow = ['Tabs (tabs21)'];

  // 4. Build the row of tab labels
  const tabLabelRow = tabLabelElements.map(tabEl => tabEl.textContent.trim());

  // 5. Build the row of tab panel content, referencing the *actual* tab panel elements (not clones)
  //    For each panel, reference the actual tabPanelElements from the original document
  //    If they need to be removed from DOM, they will be inserted into the table anyway.
  //    We want to reference the original, not clone, so: use the elements directly.
  //    But we should remove extraneous wrappers if present, and keep only the visible tab panel contents.
  //    However, for maximum resilience, reference the .contentfragment child if present, otherwise the panel element itself.
  const tabContentRow = tabPanelElements.map(panelEl => {
    // If there's a single main content child (like .contentfragment, article, etc), reference it
    const mainBlock = panelEl.querySelector(':scope > .contentfragment, :scope > article, :scope > div, :scope > section');
    if (mainBlock && mainBlock.parentElement === panelEl && panelEl.childElementCount === 1) {
      return mainBlock;
    }
    // Otherwise, reference the panelEl itself (all content)
    return panelEl;
  });

  // 6. Compose the cells array
  //    First row: header (1 column)
  //    Second row: tab labels (n columns)
  //    Third row: tab content (n columns)
  const cells = [
    headerRow,
    tabLabelRow,
    tabContentRow
  ];

  // 7. Create the table using the provided DOMUtils
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // 8. Replace the original tabs block element with the created table
  tabsRoot.replaceWith(table);
}
