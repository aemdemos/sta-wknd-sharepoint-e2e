/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs element within the given element
  const tabsContainer = element.querySelector('.cmp-tabs');
  if (!tabsContainer) return;

  // Extract tab labels (li elements inside .cmp-tabs__tablist)
  const tabLabels = Array.from(
    tabsContainer.querySelectorAll('.cmp-tabs__tablist > li')
  );

  // Extract tab content panels (divs with .cmp-tabs__tabpanel)
  const tabPanels = Array.from(
    tabsContainer.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Ensure proper matching of label and panel count
  if (tabLabels.length === 0 || tabPanels.length === 0 || tabLabels.length !== tabPanels.length) return;

  // Table header as specified in the block info
  const headerRow = ['Tabs (tabs7)'];

  // Each subsequent row is [Tab Label, Tab Content]
  const rows = tabLabels.map((li, idx) => {
    // Always reference the existing tab label and tab content element
    const label = li.textContent.trim();
    const tabPanel = tabPanels[idx];
    // For semantic clarity, we will only place the *content* of the tab panel, not the outer div
    // However, since each tabpanel may have a single content block, we'll reference its content
    // If the tabPanel only has one child, use that; else, use all its children
    let tabContent;
    if (tabPanel.children.length === 1) {
      tabContent = tabPanel.firstElementChild;
    } else {
      tabContent = Array.from(tabPanel.childNodes);
    }
    return [label, tabContent];
  });

  const tableData = [headerRow, ...rows];

  const table = WebImporter.DOMUtils.createTable(tableData, document);
  element.replaceWith(table);
}