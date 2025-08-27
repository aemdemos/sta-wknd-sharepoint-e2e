/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block element
  const tabsElem = element.querySelector('.cmp-tabs');
  if (!tabsElem) return;

  // Get tab labels from the tab list
  const tabLabels = Array.from(
    tabsElem.querySelectorAll('.cmp-tabs__tablist [role="tab"]')
  ).map(tab => tab.textContent.trim());

  // Get tab panels (contents), preserve their DOM structure
  const tabPanels = Array.from(
    tabsElem.querySelectorAll('[role="tabpanel"]')
  );

  // Create the header row: always ['Tabs (tabs6)']
  const headerRow = ['Tabs (tabs6)'];

  // Create the tab label row: each label as a <strong> element
  const labelRow = tabLabels.map(label => {
    const strong = document.createElement('strong');
    strong.textContent = label;
    return strong;
  });

  // Create the tab content row: reference the tab panel's main content
  const contentRow = tabPanels.map(panel => {
    // Try to find main contentfragment, but if not, use panel
    const contentFragment = panel.querySelector('.contentfragment');
    if (contentFragment) {
      return contentFragment;
    } else {
      // Fallback to panel itself if nothing else
      return panel;
    }
  });

  // Build final cells array: header, labels, contents
  const cells = [
    headerRow,
    labelRow,
    contentRow
  ];

  // Create table and replace tabs block
  const table = WebImporter.DOMUtils.createTable(cells, document);
  tabsElem.replaceWith(table);
}
