/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block within the element
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Get tab label elements in order
  const tabLabelElements = tabsBlock.querySelectorAll('.cmp-tabs__tablist [role="tab"]');
  const tabLabels = Array.from(tabLabelElements).map(el => el.textContent.trim());

  // Get all tab panels in order matching tabs
  const tabPanelElements = tabsBlock.querySelectorAll('.cmp-tabs__tabpanel');

  // Prepare the header row: block name per instructions
  const headerRow = ['Tabs (tabs11)'];

  // Build rows for each tab: [label, content]
  const rows = tabLabels.map((label, idx) => {
    const panel = tabPanelElements[idx];
    if (!panel) return [label, ''];

    // Reference the content fragment/article in the panel, if present
    let mainContent = panel.querySelector('article');
    if (!mainContent) {
      // fallback: use tabpanel itself if no article
      mainContent = panel;
    }
    // Remove the h3.title if present (it's usually a duplicate of the main heading)
    const contentElements = [];
    Array.from(mainContent.children).forEach(child => {
      // Only skip .cmp-contentfragment__title h3
      if (child.classList && child.classList.contains('cmp-contentfragment__title')) {
        return;
      }
      contentElements.push(child);
    });
    // If no children, fallback to panel's innerHTML as text
    return [label, contentElements.length > 0 ? contentElements : mainContent];
  });

  // Assemble the table array
  const cells = [headerRow, ...rows];

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the tabs block with the block table in the DOM
  tabsBlock.parentNode.replaceChild(blockTable, tabsBlock);
}
