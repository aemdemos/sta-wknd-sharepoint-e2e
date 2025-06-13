/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs block
  const tabsEl = element.querySelector('.cmp-tabs');
  if (!tabsEl) return;

  // Get tab labels
  const tabLabels = Array.from(
    tabsEl.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab')
  );

  // Get tabpanel elements (these hold the tab content)
  const tabPanels = Array.from(
    tabsEl.querySelectorAll('div.cmp-tabs__tabpanel')
  );

  if (!tabLabels.length || !tabPanels.length) return;

  // Build the table rows as per the required block structure:
  // Row 1: block header ['Tabs (tabs12)']
  // Row 2: tab labels (each label in one cell)
  // Row 3: tab content (each content in one cell)
  const rows = [];
  rows.push(['Tabs (tabs12)']);
  rows.push(
    tabLabels.map(tab => {
      // Use a <strong> for the label (to match visual example)
      // Use the actual DOM reference for semantic meaning if possible
      const strong = document.createElement('strong');
      strong.textContent = tab.textContent.trim();
      return strong;
    })
  );
  rows.push(
    tabPanels.map(panel => {
      // Reference the direct child .contentfragment if present, else the whole panel
      const cf = panel.querySelector('.contentfragment');
      if (cf) return cf;
      // Else, reference all children (not clone)
      const children = Array.from(panel.children);
      if (children.length === 1) return children[0];
      if (children.length > 1) return children;
      // If panel is empty or no content, return an empty string
      return '';
    })
  );

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs element with the table
  tabsEl.replaceWith(table);
}
