/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block by class or role
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels (tab triggers)
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li'));

  // Get tab panels (tab content)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Defensive: Only proceed if labels and panels match
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Table header row
  const headerRow = ['Tabs (tabs30)'];
  const rows = [headerRow];

  // For each tab, create a row [label, content]
  tabLabels.forEach((tabLabel, idx) => {
    // Tab label text
    const labelText = tabLabel.textContent.trim();

    // Tab panel content
    const panel = tabPanels[idx];
    // Defensive: If panel is missing, skip
    if (!panel) return;

    // Collect all direct children with meaningful content
    const contentElements = [];
    Array.from(panel.children).forEach(child => {
      // Only push elements with meaningful content (text, images, lists, etc.)
      if (child.textContent.trim() || child.querySelector('img,ul,ol')) {
        contentElements.push(child);
      }
    });
    // If nothing found, fallback to the panel itself
    const tabContent = contentElements.length ? contentElements : [panel];

    rows.push([
      labelText,
      tabContent
    ]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block with the table
  tabsBlock.replaceWith(block);
}
