/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container
  const tabsContainer = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  let cmpTabs;
  if (tabsContainer && tabsContainer.classList.contains('cmp-tabs')) {
    cmpTabs = tabsContainer;
  } else if (tabsContainer) {
    cmpTabs = tabsContainer.querySelector('.cmp-tabs');
  } else {
    cmpTabs = element.querySelector('.cmp-tabs');
  }
  if (!cmpTabs) return;

  // Get tab headers
  const tabHeaders = Array.from(cmpTabs.querySelectorAll('.cmp-tabs__tablist > li'));

  // Get tab panels
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[role="tabpanel"]'));

  // Defensive: Ensure headers and panels match
  if (tabHeaders.length === 0 || tabPanels.length === 0 || tabHeaders.length !== tabPanels.length) return;

  // Block header row
  const headerRow = ['Tabs (tabs37)'];
  const rows = [headerRow];

  // For each tab, extract label and content
  tabHeaders.forEach((tabHeader, idx) => {
    // Tab label
    const label = tabHeader.textContent.trim();

    // Tab content
    const panel = tabPanels[idx];
    // Defensive: panel may have a contentfragment/article or just direct children
    let content = [];
    // Try to find main content fragment/article
    const contentFragment = panel.querySelector('.cmp-contentfragment') || panel.querySelector('article');
    if (contentFragment) {
      // For 'Overview' tab, also include image if present
      const image = contentFragment.querySelector('img');
      if (image) {
        content.push(image);
        // If caption exists, add it
        const caption = contentFragment.querySelector('.cmp-image__title');
        if (caption) {
          content.push(caption);
        }
      }
      // Find main description paragraph(s) or list(s)
      const richContent = Array.from(contentFragment.querySelectorAll('p, ul, ol'));
      if (richContent.length) {
        content = content.concat(richContent);
      }
      // If nothing found, fallback to all children
      if (content.length === 0) {
        content.push(...Array.from(contentFragment.children));
      }
    } else {
      // Fallback: use all children of panel
      content = Array.from(panel.children);
    }
    // Defensive: if content is empty, fallback to panel text
    if (content.length === 0) {
      content = [document.createTextNode(panel.textContent.trim())];
    }
    rows.push([label, content]);
  });

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
