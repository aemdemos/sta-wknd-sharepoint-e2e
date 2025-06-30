/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs component
  let tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock && element.classList.contains('cmp-tabs')) {
    tabsBlock = element;
  }
  if (!tabsBlock) return;

  // Find tab labels
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLis = tabList ? Array.from(tabList.querySelectorAll('[role="tab"]')) : [];

  // Ensure we have tabs, else nothing to do
  if (tabLis.length === 0) return;

  // Compose table rows
  const rows = [];
  rows.push(['Tabs (tabs6)']);

  tabLis.forEach(tabLi => {
    const label = tabLi.textContent.trim();
    // Find panel via aria-controls or id
    let contentPanel = null;
    const ariaControls = tabLi.getAttribute('aria-controls');
    if (ariaControls) {
      contentPanel = tabsBlock.querySelector(`#${ariaControls}`);
    } else {
      // fallback: try by id pattern
      const tabId = tabLi.getAttribute('id');
      if (tabId && tabId.endsWith('-tab')) {
        const panelId = tabId.replace(/-tab$/, '-tabpanel');
        contentPanel = tabsBlock.querySelector(`#${panelId}`);
      }
    }
    // Defensive: skip if no content panel found
    if (!contentPanel) {
      rows.push([label, document.createElement('div')]);
      return;
    }
    // Find the main content for each tab
    let contentNode = null;
    // Prefer a single contentfragment/article if present
    let cf = contentPanel.querySelector('.contentfragment, .cmp-contentfragment');
    if (!cf) {
      // or just all children except scripts/navs
      const panelChildren = Array.from(contentPanel.childNodes).filter(n => 
        n.nodeType === 1 && n.tagName.toLowerCase() !== 'script' && n.tagName.toLowerCase() !== 'nav');
      if (panelChildren.length === 1) {
        contentNode = panelChildren[0];
      } else if (panelChildren.length > 1) {
        const wrapper = document.createElement('div');
        panelChildren.forEach(child => wrapper.appendChild(child));
        contentNode = wrapper;
      }
    } else {
      contentNode = cf;
    }
    // Fallback: use panel itself
    if (!contentNode) {
      // Avoid duplicating the tab nav etc by using only the contentPanel's content
      const wrapper = document.createElement('div');
      Array.from(contentPanel.childNodes).forEach(n => wrapper.appendChild(n));
      contentNode = wrapper;
    }
    rows.push([label, contentNode]);
  });

  // Build and replace
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
