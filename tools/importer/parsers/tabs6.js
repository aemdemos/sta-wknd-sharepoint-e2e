/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-tabs block within the element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get all tab labels
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabelEls = Array.from(tabList ? tabList.querySelectorAll('li[role="tab"]') : []);

  // Get all tab panels (in order in the DOM)
  const panelEls = Array.from(tabs.querySelectorAll('[role="tabpanel"]'));

  // Build the table
  const rows = [];
  // Header row as in the prompt
  rows.push(['Tabs (tabs6)']);

  // For each tab, extract label and panel content
  for (let i = 0; i < tabLabelEls.length; i++) {
    const label = tabLabelEls[i].textContent.trim();
    let panel = null;
    // Use aria-controls to match tab to panel if possible
    const panelId = tabLabelEls[i].getAttribute('aria-controls');
    if (panelId) {
      panel = tabs.querySelector(`#${panelId}`);
    }
    // Fallback to panel by order
    if (!panel && panelEls[i]) {
      panel = panelEls[i];
    }
    // The panel may include a contentfragment; we want the content displayed for that tab
    let panelContent;
    if (panel) {
      // Some panels contain a single child holding all content (e.g. <div class="contentfragment"> or <article>), others may have multiple children
      // We will reference the first element child if there's only one, else wrap all in a div to preserve structure
      const childElements = Array.from(panel.children);
      if (childElements.length === 1) {
        panelContent = childElements[0];
      } else {
        // For panels with multiple direct children, wrap them in a div
        const wrapper = document.createElement('div');
        childElements.forEach(el => wrapper.appendChild(el));
        panelContent = wrapper;
      }
    } else {
      // If panel not found, fallback to empty div
      panelContent = document.createElement('div');
    }
    rows.push([label, panelContent]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace only the cmp-tabs element with the block table
  tabs.replaceWith(block);
}
