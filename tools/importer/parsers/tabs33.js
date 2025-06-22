/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block in the provided element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get all tab labels (li elements inside the tablist)
  const tabLabels = Array.from(
    tabs.querySelectorAll('.cmp-tabs__tablist > li')
  );
  // Get all tab panels (tab content containers)
  const tabPanels = Array.from(
    tabs.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // If the number of tab labels and panels don't match, bail out (defensive)
  if (tabLabels.length === 0 || tabPanels.length === 0 || tabLabels.length !== tabPanels.length) return;

  // Build the rows for the table
  const cells = [];

  // Header row: block name exactly as specified
  cells.push(['Tabs (tabs33)']);

  // Second row: tab labels (one per column, bolded)
  const labelRow = tabLabels.map(label => {
    // Use a <strong> element for bold, as in the visual example
    // We must reference the text, not the original li, because the li has roles/classes
    const strong = document.createElement('strong');
    strong.textContent = label.textContent.trim();
    return strong;
  });
  cells.push(labelRow);

  // Third row: tab content (one per column)
  // Each tab panel may contain a .cmp-contentfragment > .cmp-contentfragment__elements or relevant content
  const contentRow = tabPanels.map(panel => {
    // Try to find the main content to keep semantic meaning
    // Prefer .cmp-contentfragment if present
    const contentFragment = panel.querySelector('.cmp-contentfragment');
    if (contentFragment) {
      return contentFragment;
    }
    // Otherwise, take all children of the panel (excluding script/style/meta)
    // If empty, return empty string
    const temp = Array.from(panel.children).filter(
      el => !['SCRIPT', 'STYLE', 'META'].includes(el.tagName)
    );
    if (temp.length > 0) {
      return temp;
    }
    // Last fallback: just use the panel itself
    return panel;
  });
  cells.push(contentRow);

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the tabs block with the table
  tabs.replaceWith(table);
}
