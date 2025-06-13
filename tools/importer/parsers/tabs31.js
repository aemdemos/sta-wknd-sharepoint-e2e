/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block within the element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels from <ol class="cmp-tabs__tablist">
  const tabLabelEls = tabs.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab');
  if (!tabLabelEls.length) return;
  const tabLabels = Array.from(tabLabelEls).map(tab => tab.textContent.trim());

  // Get tab panels - each with class .cmp-tabs__tabpanel (in order)
  const tabPanels = Array.from(
    tabs.querySelectorAll('.cmp-tabs__tabpanel')
  );
  if (tabPanels.length !== tabLabels.length) return;

  // For each tab panel, extract its main content
  // We'll reference the <article> if present, else the whole panel
  const tabContents = tabPanels.map(panel => {
    const article = panel.querySelector('article');
    if (article) {
      return article;
    }
    // fallback: use the complete tab panel
    return panel;
  });

  // Compose the table
  // Header row: block name as in prompt
  const headerRow = ['Tabs (tabs31)'];
  // Second row: the tab labels
  const labelsRow = tabLabels;
  // Third row: the tab content for each tab (each as a reference to the actual element)
  const contentRow = tabContents;

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    labelsRow,
    contentRow
  ], document);

  // Replace the original tabs element with the new table
  tabs.replaceWith(table);
}
