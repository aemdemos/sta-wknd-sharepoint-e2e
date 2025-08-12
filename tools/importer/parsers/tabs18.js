/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  let tabsEl = element.querySelector('.cmp-tabs');
  if (!tabsEl) {
    // fallback: search for tabs in document
    tabsEl = document.querySelector('.cmp-tabs');
    if (!tabsEl) return;
  }

  // Get tab labels
  const tabList = tabsEl.querySelector('[role="tablist"]');
  if (!tabList) return;
  const tabLabelEls = Array.from(tabList.querySelectorAll('[role="tab"]'));
  const tabLabels = tabLabelEls.map(li => li.textContent.trim());

  // Get tab panel elements (content)
  const tabPanelEls = Array.from(tabsEl.querySelectorAll('[role="tabpanel"]'));

  // Compose header row (block name exactly as specified)
  const headerRow = ['Tabs (tabs18)'];

  // Compose tab labels row, using <strong> to match example (reference, not clone)
  const tabHeaderRow = tabLabels.map(label => {
    const strong = document.createElement('strong');
    strong.textContent = label;
    return strong;
  });

  // Compose tab content row
  const tabContentRow = tabPanelEls.map(tabPanel => {
    // Find contentfragment inside panel
    const cf = tabPanel.querySelector('article.cmp-contentfragment');
    if (!cf) return tabPanel; // fallback: panel itself
    const elements = cf.querySelector('.cmp-contentfragment__elements');
    if (!elements) return cf;

    // Overview tab: try to include image and description
    if (tabPanel.classList.contains('cmp-tabs__tabpanel--active') || tabPanel.id.includes('8008bf39fa')) {
      // Get image div if present
      const imgWrap = elements.querySelector('.cmp-image');
      // Get all text paragraphs (outside .cmp-image)
      const ps = Array.from(elements.querySelectorAll('p'));
      // Combine image (if exists) and all paragraphs
      const content = [];
      if (imgWrap) content.push(imgWrap);
      ps.forEach(p => content.push(p));
      // If nothing found, fallback to all of elements
      if (content.length === 0) return elements;
      return content.length === 1 ? content[0] : content;
    }

    // Itinerary tab: collect <h2> and <p> in order
    if (tabPanel.id.includes('46a9651aa5')) {
      const nodes = [];
      // Extract all <h2> and <p> in correct order under elements
      Array.from(elements.children).forEach(child => {
        if (child.tagName === 'H2' || child.tagName === 'P') {
          nodes.push(child);
        } else if (child.tagName === 'DIV') {
          Array.from(child.children).forEach(grand => {
            if (grand.tagName === 'H2' || grand.tagName === 'P') {
              nodes.push(grand);
            }
          });
        }
      });
      // Fallback: all of elements if nothing found
      if (nodes.length === 0) return elements;
      return nodes.length === 1 ? nodes[0] : nodes;
    }

    // What to Bring tab: include <ul> list
    if (tabPanel.id.includes('ea4a0e39bf')) {
      const ul = elements.querySelector('ul');
      if (ul) return ul;
      return elements;
    }

    // Fallback for unexpected tab
    return elements;
  });

  // Final block table
  const cells = [
    headerRow,
    tabHeaderRow,
    tabContentRow
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the tabs block in the DOM
  tabsEl.replaceWith(table);
}
