/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs block within the given element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Extract tab labels in order
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabelEls = Array.from(tabList.querySelectorAll('.cmp-tabs__tab'));
  const tabLabels = tabLabelEls.map(l => l.textContent.trim());
  const tabCount = tabLabels.length;

  // Extract tab panels in order corresponding to labels
  const tabPanels = Array.from(tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));
  // Defensive: ensure panels.length >= tabLabels.length

  // 1st row: header row (single cell)
  const headerRow = ['Tabs (tabs25)'];

  // 2nd row: tab labels each in their own cell (as <strong>)
  const tabLabelRow = tabLabels.map(label => {
    const strong = document.createElement('strong');
    strong.textContent = label;
    return strong;
  });

  // Subsequent rows: for each tab, create an array of length tabCount where only the respective index has the content, others are empty strings
  function isElement(node) { return node && node.nodeType === 1; }
  function isTextNode(node) { return node && node.nodeType === 3; }

  const contentRows = tabLabels.map((label, idx) => {
    // Defensive: get panel or fallback to empty
    const panel = tabPanels[idx];
    let cellContent = '';
    if (panel) {
      // Gather all non-empty, visually relevant children from the panel
      const toInclude = [];
      Array.from(panel.childNodes).forEach(child => {
        if (isElement(child)) {
          // Filter empty grid wrappers
          if (
            child.classList &&
            (/aem-Grid/.test(child.className) || /aem-GridColumn/.test(child.className)) &&
            !child.querySelector('*:not(.aem-Grid,.aem-GridColumn,.aem-Grid--12,.aem-Grid--default--12)')
          ) {
            return;
          }
          toInclude.push(child);
        } else if (isTextNode(child) && child.textContent.trim()) {
          const span = document.createElement('span');
          span.textContent = child.textContent.trim();
          toInclude.push(span);
        }
      });
      if (toInclude.length > 0) cellContent = toInclude;
    }
    // Create row with exactly tabCount cells, only idx has content
    const row = [];
    for (let i = 0; i < tabCount; i++) {
      row.push(i === idx ? cellContent : '');
    }
    return row;
  });

  const cells = [
    headerRow,
    tabLabelRow,
    ...contentRows,
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
