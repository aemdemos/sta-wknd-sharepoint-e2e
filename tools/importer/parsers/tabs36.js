/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block root
  const tabsRoot = element.querySelector('.tabs.panelcontainer, .cmp-tabs');
  if (!tabsRoot) return;

  // Find the cmp-tabs element (the actual tabs container)
  const cmpTabs = tabsRoot.querySelector('.cmp-tabs') || tabsRoot;
  if (!cmpTabs) return;

  // Get tab labels from the tablist
  const tabList = cmpTabs.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('.cmp-tabs__tab')).map(tab => tab.textContent.trim());

  // Get tab panels (content)
  const tabPanels = Array.from(cmpTabs.querySelectorAll('[role="tabpanel"]'));

  // Defensive: match labels to panels by order
  const rows = [];
  const headerRow = ['Tabs (tabs36)'];
  rows.push(headerRow);

  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (!panel) continue;

    // Find the main content fragment/article inside the tab panel
    const contentFragment = panel.querySelector('article.cmp-contentfragment') || panel;
    let tabContentNodes = [];

    // Try to extract the main content area (skip repeated titles)
    // For Overview: image + description
    // For Itinerary: description
    // For What to Bring: list
    // We'll use the .cmp-contentfragment__elements or the first meaningful child
    const elements = contentFragment.querySelector('.cmp-contentfragment__elements') || contentFragment;
    // For Overview, also look for an image
    let img = elements.querySelector('img');
    if (img) {
      // If the image has a caption, include it
      const imgContainer = img.closest('[data-cmp-is="image"]') || img.parentElement;
      const imgNodes = [img];
      const caption = imgContainer.querySelector('.cmp-image__title');
      if (caption) {
        imgNodes.push(document.createElement('br'));
        imgNodes.push(caption);
      }
      tabContentNodes.push(...imgNodes);
    }
    // Now add the main text or list content
    // Find the first <p> or <ul> or <ol> inside elements
    const mainContent = elements.querySelector('p, ul, ol');
    if (mainContent) {
      tabContentNodes.push(mainContent);
    }

    // Defensive: If nothing found, fallback to all children except h3
    if (tabContentNodes.length === 0) {
      tabContentNodes = Array.from(elements.children).filter(
        (el) => el.tagName.toLowerCase() !== 'h3'
      );
    }

    // Defensive: If still nothing, fallback to panel innerHTML
    if (tabContentNodes.length === 0) {
      tabContentNodes = [panel.cloneNode(true)];
    }

    rows.push([label, tabContentNodes]);
  }

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the tabs block with the new table
  tabsRoot.replaceWith(table);
}
