/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container (cmp-tabs)
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels from tablist
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('.cmp-tabs__tab'));

  // Get all tab panels
  const tabPanels = Array.from(tabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Defensive: Ensure number of labels matches number of panels
  if (tabLabels.length !== tabPanels.length) return;

  // Build table rows
  const rows = [];
  // Header row
  rows.push(['Tabs (tabs20)']);

  // If model is present, add HTML comments for fields
  let modelComment = null;
  const modelFragment = element.querySelector('[data-cmp-contentfragment-model]');
  if (modelFragment) {
    const modelName = modelFragment.getAttribute('data-cmp-contentfragment-model');
    // Try to extract fields from the sidebar contentfragment
    const fieldEls = Array.from(element.querySelectorAll('.cmp-contentfragment__element-title'));
    const modelFields = fieldEls.map(el => el.textContent.trim()).join(', ');
    modelComment = document.createComment(` model: ${modelName}, fields: ${modelFields} `);
  }

  // For each tab, add a row: [label, content]
  for (let i = 0; i < tabLabels.length; i += 1) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];

    // Defensive: Find the main content inside the tab panel
    let content = null;
    const article = panel.querySelector('article');
    if (article) {
      content = article.cloneNode(true);
    } else {
      content = panel.cloneNode(true);
    }

    // Compose cell content: tab content + model comment (for every tab)
    const wrapper = document.createElement('div');
    wrapper.appendChild(content);
    if (modelComment) wrapper.appendChild(modelComment.cloneNode());
    rows.push([label, wrapper]);
  }

  // Create block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace original element with the new table
  element.replaceWith(table);
}
