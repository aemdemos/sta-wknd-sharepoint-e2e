/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block container
  const tabsContainer = element.querySelector('.tabs, .panelcontainer');
  if (!tabsContainer) return;

  // Find tab navigation (tab labels)
  const tabNav = tabsContainer.querySelector('.cmp-tabs__tablist');
  if (!tabNav) return;
  const tabLabels = Array.from(tabNav.querySelectorAll('.cmp-tabs__tab'));

  // Find tab panels (tab content)
  const tabPanels = Array.from(tabsContainer.querySelectorAll('.cmp-tabs__tabpanel'));

  // Defensive: ensure tabLabels and tabPanels have the same length
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Table header row
  const headerRow = ['Tabs (tabs10)'];
  const rows = [headerRow];

  // For each tab, extract label and content
  tabLabels.forEach((tabLabel, i) => {
    // Get label text
    const label = tabLabel.textContent.trim();

    // Get tab panel content
    const panel = tabPanels[i];
    if (!panel) return;

    // Find the contentfragment/article inside the panel
    const contentFragment = panel.querySelector('article.cmp-contentfragment');
    let tabContent;
    if (contentFragment) {
      // Add model field comment if present
      const model = contentFragment.getAttribute('data-cmp-contentfragment-model');
      if (model) {
        contentFragment.prepend(document.createComment(`model: ${model}`));
      }
      tabContent = contentFragment;
    } else {
      tabContent = panel;
    }

    rows.push([label, tabContent]);
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original element
  element.replaceWith(block);
}
