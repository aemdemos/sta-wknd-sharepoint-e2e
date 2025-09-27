/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get all tab panels and their corresponding labels
  function getTabsAndPanels(tabsContainer) {
    const tabLabels = [];
    const tabContents = [];

    // Get tab labels (li elements inside ol[role=tablist])
    const tablist = tabsContainer.querySelector('.cmp-tabs__tablist');
    if (!tablist) return { tabLabels, tabContents };
    const tabItems = Array.from(tablist.querySelectorAll('li[role="tab"]'));

    // Get tab panels (div[role=tabpanel])
    const tabPanels = Array.from(tabsContainer.querySelectorAll('div[role="tabpanel"]'));

    tabItems.forEach((tab, i) => {
      // Tab label text
      tabLabels.push(tab.textContent.trim());
      // Find corresponding tabpanel by aria-controls
      const panelId = tab.getAttribute('aria-controls');
      const panel = tabsContainer.querySelector(`#${panelId}`);
      if (panel) {
        // Defensive: grab the contentfragment/article inside panel
        let content = null;
        const cf = panel.querySelector('article.cmp-contentfragment');
        if (cf) {
          // For the Overview tab, grab image and description
          if (tab.textContent.trim().toLowerCase() === 'overview') {
            // Try to get image
            const imgWrap = cf.querySelector('.cmp-image');
            const img = imgWrap ? imgWrap.querySelector('img') : null;
            const caption = imgWrap ? imgWrap.querySelector('.cmp-image__title') : null;
            // Try to get description
            const desc = cf.querySelector('p');
            // Compose content: image, caption, description
            const overviewContent = [];
            if (img) overviewContent.push(img);
            if (caption) overviewContent.push(caption);
            if (desc) overviewContent.push(desc);
            content = overviewContent.length ? overviewContent : cf;
          } else {
            // For other tabs, grab main content (paragraph or list)
            // Defensive: get first <p> or <ul> inside cf
            const p = cf.querySelector('p');
            const ul = cf.querySelector('ul');
            content = p || ul || cf;
          }
        } else {
          // Fallback: use panel itself
          content = panel;
        }
        tabContents.push(content);
      } else {
        tabContents.push(document.createTextNode(''));
      }
    });
    return { tabLabels, tabContents };
  }

  // Find the tabs block in the element
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels and tab contents
  const { tabLabels, tabContents } = getTabsAndPanels(tabsBlock);

  // Compose table rows
  const headerRow = ['Tabs (tabs18)'];
  const rows = [headerRow];
  for (let i = 0; i < tabLabels.length; i++) {
    rows.push([
      tabLabels[i],
      Array.isArray(tabContents[i]) ? tabContents[i] : [tabContents[i]]
    ]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
