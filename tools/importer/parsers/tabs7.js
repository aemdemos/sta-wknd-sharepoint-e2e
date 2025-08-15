/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-tabs block within the supplied element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Extract the tab labels (li elements inside the tablist)
  const tabLabels = Array.from(
    tabs.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  ).map(li => li.textContent.trim());

  // Extract the tab panels (one for each tab)
  const tabPanels = Array.from(
    tabs.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Build the header row: block name as in the example
  const headerRow = ['Tabs (tabs7)'];

  // The first row after the header contains the tab labels (as plain text, not <strong>)
  // But in the screenshot, they are bold, so wrap with <strong>.
  const labelRow = tabLabels.map(label => {
    const strong = document.createElement('strong');
    strong.textContent = label;
    return strong;
  });

  // Each tab content cell is the direct content of the corresponding tab panel
  // We want the relevant article (the .cmp-contentfragment) for each panel
  const contentRow = tabPanels.map(panel => {
    // If panel contains an article, use the article; else, use panel
    const article = panel.querySelector('article');
    return article || panel;
  });

  // Build the table: header, then tab label row, then tab content row
  const tableRows = [headerRow, labelRow, contentRow];
  
  // Create table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  // Replace only the tabs block so as to not remove context outside it
  tabs.replaceWith(block);
}
