/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs block within the element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get the tab labels from the tablist
  const tabLabels = Array.from(
    tabs.querySelectorAll('.cmp-tabs__tablist > li')
  );
  // Get the tab panels, which contain the content for each tab, in order
  const tabPanels = Array.from(
    tabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // Defensive: ensure there are labels and panels, and they match
  if (!tabLabels.length || tabLabels.length !== tabPanels.length) return;

  // Header row, as per requirements (must match exactly)
  const headerRow = ['Tabs (tabs33)'];

  // Each subsequent row is [Tab Label, Tab Content]
  const rows = [headerRow];

  for (let i = 0; i < tabLabels.length; i++) {
    // Reference the actual label element (use inner HTML for formatting, if any)
    // We'll use the label as a plain string, as in the example.
    const labelText = tabLabels[i].textContent.trim();
    // Reference the actual content element for this tab.
    // Use the whole tab panel (includes all content, images, headings, etc)
    const panel = tabPanels[i];
    rows.push([labelText, panel]);
  }

  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original tabs element with the block table
  tabs.replaceWith(table);
}
