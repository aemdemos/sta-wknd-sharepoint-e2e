/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container
  const tabsContainer = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  const tabsEl = tabsContainer || element.querySelector('.cmp-tabs') || element;

  // Get tab labels
  const tabList = tabsEl.querySelector('.cmp-tabs__tablist');
  const tabLabels = Array.from(tabList ? tabList.children : []).map(li => li.textContent.trim());

  // Get tab panels (content)
  const tabPanels = Array.from(tabsEl.querySelectorAll('[role="tabpanel"]'));

  // Build rows: first row is header
  const rows = [['Tabs (tabs38)']];

  // For each tab, add a row with [label, content]
  tabLabels.forEach((label, i) => {
    const panel = tabPanels[i];
    let content = '';
    if (panel) {
      // Only extract visible content for each tab
      const fragment = panel.querySelector('.cmp-contentfragment');
      if (fragment) {
        if (i === 0) {
          // Overview: image, caption, paragraph
          const img = fragment.querySelector('img');
          const caption = fragment.querySelector('.cmp-image__title');
          const desc = fragment.querySelector('p');
          const contentArr = [];
          if (img) contentArr.push(img);
          if (caption) contentArr.push(caption);
          if (desc) contentArr.push(desc);
          content = contentArr.length ? contentArr : '';
        } else {
          // Itinerary and What to Bring: paragraph or list
          const p = fragment.querySelector('p');
          const ul = fragment.querySelector('ul');
          content = p || ul || '';
        }
      } else {
        content = panel;
      }
    }
    rows.push([label, content]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
