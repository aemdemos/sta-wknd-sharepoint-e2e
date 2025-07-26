/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-tabs element inside the block
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Gather all tab labels from the tablist (li elements inside the ol)
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabelEls = tabList ? Array.from(tabList.querySelectorAll('li')) : [];
  const tabLabels = tabLabelEls.map(li => li.textContent.trim());

  // For each tab, get its corresponding tabpanel element and find its main content
  const tabPanels = Array.from(tabs.querySelectorAll('[role="tabpanel"]'));
  // Prepare to reference the elements directly
  const tabContents = tabPanels.map(tabPanel => {
    // Try to find the article (the contentfragment) as the main tab content
    const article = tabPanel.querySelector('article');
    if (article) {
      return article;
    }
    // If not found, fallback to tabPanel's children
    // Create a fragment with all children nodes
    const frag = document.createDocumentFragment();
    Array.from(tabPanel.childNodes).forEach(n => frag.appendChild(n));
    return frag;
  });

  // Construct the table rows array: header row with single cell, then one row per tab (label, content)
  const rows = [];
  rows.push(['Tabs (tabs33)']);
  tabLabels.forEach((label, i) => {
    rows.push([label, tabContents[i]]);
  });

  // Build the table for the block
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the tabs element with the block table
  tabs.replaceWith(table);
}
