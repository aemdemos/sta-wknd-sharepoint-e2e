/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsWrapper = element.querySelector('.tabs');
  if (!tabsWrapper) return;
  const tabs = tabsWrapper.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels from the tablist
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabelEls = Array.from(tabList.children).filter(li => li.getAttribute('role') === 'tab');
  const tabLabels = tabLabelEls.map(tabEl => tabEl.textContent.trim());

  // Get all tab panels in order, matching tab labels
  const tabPanelEls = tabLabels.map(label => {
    // Find the li with this label
    const li = tabLabelEls.find(el => el.textContent.trim() === label);
    if (!li) return null;
    // aria-controls points to the tabpanel id
    const panelId = li.getAttribute('aria-controls');
    if (!panelId) return null;
    const tabPanel = tabs.querySelector(`#${panelId}`);
    if (!tabPanel) return null;
    // Find the .contentfragment > article inside the tabPanel
    const article = tabPanel.querySelector('article');
    return article || tabPanel;
  });

  // Remove any null panels (due to edge cases)
  const cleanedPanels = tabPanelEls.map(panel => panel ? panel : document.createElement('div'));

  // Prepare table rows
  const headerRow = ['Tabs (tabs10)'];
  const labelRow = tabLabels.map(label => label);
  const contentRow = cleanedPanels;

  // Compose block table
  // 1st row: header, single column
  // 2nd row: tab labels, one cell per tab (multi-column)
  // 3rd row: tab content, one cell per tab (multi-column)
  const cells = [
    headerRow,
    labelRow,
    contentRow
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the tabs block in the DOM, only tabs-wrapper
  tabsWrapper.parentElement.replaceChild(block, tabsWrapper);
}
