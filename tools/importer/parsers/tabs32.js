/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Find tab labels (li elements inside tablist)
  const tabList = tabsBlock.querySelector('ol[role="tablist"]');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li[role="tab"]'));

  // Find tab panels (divs with role="tabpanel")
  const tabPanels = Array.from(tabsBlock.querySelectorAll('div[role="tabpanel"]'));

  // Defensive: Only proceed if we have labels and panels and they match
  if (tabLabels.length === 0 || tabPanels.length === 0 || tabLabels.length !== tabPanels.length) return;

  // Header row: use target block name exactly
  const headerRow = ['Tabs (tabs32)'];
  const rows = [headerRow];

  // For each tab, build a row [label, content]
  tabLabels.forEach((labelEl, idx) => {
    // Get label text
    const label = labelEl.textContent.trim();

    // Get panel content
    const panel = tabPanels[idx];
    let tabContent = [];
    // Find contentfragment/article inside the panel
    const contentFragment = panel.querySelector('article.cmp-contentfragment');
    if (contentFragment) {
      // Exclude h3 title
      tabContent = Array.from(contentFragment.children).filter(child => {
        return !(child.tagName === 'H3' && child.classList.contains('cmp-contentfragment__title'));
      });
    } else {
      // Fallback: use all children of the panel
      tabContent = Array.from(panel.children);
    }
    // Defensive: if no content, push empty string
    if (tabContent.length === 0) {
      rows.push([label, '']);
    } else if (tabContent.length === 1) {
      rows.push([label, tabContent[0]]);
    } else {
      // If multiple elements, wrap in a div for semantic grouping
      const wrapper = document.createElement('div');
      tabContent.forEach(child => wrapper.appendChild(child));
      rows.push([label, wrapper]);
    }
  });

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs block with the new table
  tabsBlock.replaceWith(block);
}
