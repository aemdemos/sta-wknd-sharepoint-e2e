/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get text content from a dt/dd pair
  function getElementText(dl, selector) {
    const el = dl.querySelector(selector);
    return el ? el.textContent.trim() : '';
  }

  // Find the left column contentfragment (with the details)
  const cfDetails = element.querySelector('article.cmp-contentfragment--napa-wine-tasting');
  let detailsRow = [];
  if (cfDetails) {
    // Get the <dl> with all the details
    const dl = cfDetails.querySelector('dl.cmp-contentfragment__elements');
    if (dl) {
      dl.querySelectorAll('.cmp-contentfragment__element').forEach(div => {
        const label = getElementText(div, '.cmp-contentfragment__element-title');
        const value = getElementText(div, '.cmp-contentfragment__element-value');
        if (label && value) {
          detailsRow.push(`${label}: ${value}`);
        }
      });
    }
  }

  // Find the right column: the tab content (Overview tab)
  let overviewContent = '';
  const tabs = element.querySelector('.cmp-tabs');
  if (tabs) {
    // Find the Overview tabpanel by its aria-label or by its tab label text
    const tabPanels = tabs.querySelectorAll('.cmp-tabs__tabpanel');
    let overviewPanel = null;
    tabPanels.forEach(panel => {
      const tabId = panel.getAttribute('aria-labelledby');
      if (tabId) {
        const tab = tabs.querySelector(`#${tabId}`);
        if (tab && tab.textContent.trim().toLowerCase() === 'overview') {
          overviewPanel = panel;
        }
      }
    });
    // fallback to first tabpanel if not found
    if (!overviewPanel && tabPanels.length) overviewPanel = tabPanels[0];
    if (overviewPanel) {
      // Collect all content under .cmp-contentfragment__elements
      const cfOverview = overviewPanel.querySelector('article.cmp-contentfragment--napa-wine-tasting');
      if (cfOverview) {
        const elementsDiv = cfOverview.querySelector('.cmp-contentfragment__elements');
        if (elementsDiv) {
          // Collect all child nodes except empty grid wrappers
          overviewContent = '';
          Array.from(elementsDiv.childNodes).forEach(node => {
            if (
              node.nodeType === 1 &&
              node.matches('div') &&
              node.querySelector('.aem-Grid')
            ) {
              return;
            }
            if (node.nodeType === 1) {
              overviewContent += node.outerHTML;
            } else if (node.nodeType === 3) {
              overviewContent += node.textContent;
            }
          });
        }
      }
    }
  }

  // Compose the block table
  const headerRow = ['Table (striped, tableStriped8)'];
  const rows = [headerRow];
  if (detailsRow.length) rows.push(detailsRow);
  if (overviewContent.trim()) {
    rows.push([WebImporter.DOMUtils.createTag('div', {}, overviewContent)]);
  }

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
