/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels (li elements)
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li'));
  // Get tab panels (tab content)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));

  // Defensive: Only continue if we have matching labels and panels
  if (tabLabels.length === 0 || tabPanels.length === 0) return;

  // Table header row: must match block name exactly
  const headerRow = ['Tabs (tabs33)'];

  // Build rows: each tab label and its content
  const rows = tabLabels.map((tabLabel, i) => {
    // Tab label text
    const labelText = tabLabel.textContent.trim();

    // Get corresponding tab panel
    const tabPanel = tabPanels[i];
    if (!tabPanel) return [labelText, ''];

    // Tab content: use the entire tabPanel content
    // Find the main contentfragment inside the tabPanel
    const contentFragment = tabPanel.querySelector('.contentfragment');
    let tabContent;
    if (contentFragment) {
      // Use the full contentfragment (includes images, headings, paragraphs, lists)
      tabContent = contentFragment;
    } else {
      // Fallback: use the tabPanel itself
      tabContent = tabPanel;
    }

    // Always reference the existing element, never clone or create new
    return [labelText, tabContent];
  });

  // Compose table cells
  const cells = [headerRow, ...rows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original tabs block with the new table
  tabsBlock.replaceWith(block);
}
