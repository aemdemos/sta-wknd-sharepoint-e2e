/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block element (by class matching)
  let tabsEl = element.querySelector('.tabs.panelcontainer');
  if (!tabsEl && element.classList.contains('tabs')) {
    tabsEl = element;
  }
  if (!tabsEl) return;
  const cmpTabs = tabsEl.querySelector('.cmp-tabs');
  if (!cmpTabs) return;

  // Get tab labels from the tablist
  const tabLabels = Array.from(
    cmpTabs.querySelectorAll('.cmp-tabs__tablist > li')
  ).map(tab => tab.textContent.trim());

  // Get tab panels (order matches tabLabels)
  const tabPanels = Array.from(
    cmpTabs.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // Compose rows for block table
  const headerRow = ['Tabs (tabs13)'];
  // Each row: [Tab Label, Tab Content]
  const rows = [headerRow];
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    // Content extraction:
    // Find the main article (contentfragment) inside panel
    let contentEl = null;
    if (panel) {
      const article = panel.querySelector('article.cmp-contentfragment');
      if (article) {
        // Use .cmp-contentfragment__elements if present (usually all relevant content)
        const elements = article.querySelector('.cmp-contentfragment__elements');
        if (elements) {
          // Only include meaningful children (not empty or grid)
          const children = Array.from(elements.children).filter(child => {
            // Ignore .aem-Grid or empty divs
            if (child.classList.contains('aem-Grid')) return false;
            if (child.tagName === 'DIV' && child.textContent.trim() === '' && child.children.length === 0) return false;
            return true;
          });
          if (children.length) {
            contentEl = children;
          }
        }
        // If not found, use all children except the title (h3)
        if (!contentEl) {
          contentEl = Array.from(article.children).filter(e => e.tagName !== 'H3');
        }
      } else {
        // If no article, use all children in panel
        contentEl = Array.from(panel.children);
      }
    } else {
      contentEl = [];
    }
    // If only one meaningful element, use it directly
    if (Array.isArray(contentEl) && contentEl.length === 1) {
      contentEl = contentEl[0];
    }
    rows.push([label, contentEl]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace original element
  tabsEl.replaceWith(block);
}
