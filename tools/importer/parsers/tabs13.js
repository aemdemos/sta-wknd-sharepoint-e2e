/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the .cmp-tabs block in the given element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // 2. Extract tab labels from the tablist (in order)
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('[role="tab"]').forEach(tab => {
      tabLabels.push(tab.textContent.trim());
    });
  }
  if (tabLabels.length === 0) return; // No tabs, skip

  // 3. Extract tab panels (in DOM order)
  const tabPanels = Array.from(
    tabsBlock.querySelectorAll('.cmp-tabs__tabpanel')
  );
  // Defensive: Only keep as many panels as there are labels (and vice versa)
  while (tabPanels.length > tabLabels.length) tabPanels.pop();
  while (tabLabels.length > tabPanels.length) tabLabels.pop();

  // 4. Compose header row (block name exactly as in prompt)
  const headerRow = ['Tabs (tabs13)'];
  // 5. Compose the labels row (all tab labels)
  const labelsRow = [...tabLabels]; // All labels, as one row
  // 6. Compose the content row (all tab panel content, as one row)
  //    For each panel, use the existing contentfragment/article inside, or fallback to the panel itself
  const contentRow = tabPanels.map(panel => {
    // Prefer the .contentfragment or article inside
    const mainContent = panel.querySelector('article, .contentfragment');
    return mainContent || panel;
  });

  // 7. Build the cell structure: first row header, second row labels, third row tab contents
  const cells = [headerRow, labelsRow, contentRow];

  // 8. Create the table and replace the .cmp-tabs block
  const table = WebImporter.DOMUtils.createTable(cells, document);
  tabsBlock.replaceWith(table);
}
