/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs block inside the supplied element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Extract all tab labels
  const tabLabelElements = Array.from(tabs.querySelectorAll('.cmp-tabs__tablist > li'));
  // Extract all tab panels (in order)
  const tabPanels = Array.from(tabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Sanity check: match tab count
  if (tabLabelElements.length !== tabPanels.length) {
    // Sometimes hidden panels are present, so we'll match by index
    // But if the number differs, prefer only visible/meaningful ones
    // We'll use tabPanels as the source of truth
    // Try to get the label for each panel by its aria-labelledby
    const labelsById = {};
    tabLabelElements.forEach(lbl => {
      labelsById[lbl.id] = lbl;
    });
    var tabRows = tabPanels.map(panel => {
      const labelId = panel.getAttribute('aria-labelledby');
      let labelElem = labelsById[labelId] || null;
      return { labelElem, panel };
    });
  } else {
    // Labels and panels match, simple zip
    var tabRows = tabLabelElements.map((labelElem, idx) => ({
      labelElem,
      panel: tabPanels[idx],
    }));
  }

  // Compose the block header row
  const headerRow = ['Tabs (tabs23)'];

  // Compose each tab row: [ Tab Label, Tab Content ]
  const tabTableRows = tabRows.map(({ labelElem, panel }) => {
    // Use the label element as first cell (span for neutral styling, keep text content)
    let labelCell;
    if (labelElem) {
      // Use the element textContent, wrap in <strong> if active, else normal
      const tabLabelText = labelElem.textContent.trim();
      if (labelElem.classList.contains('cmp-tabs__tab--active')) {
        const strong = document.createElement('strong');
        strong.textContent = tabLabelText;
        labelCell = strong;
      } else {
        labelCell = document.createTextNode(tabLabelText);
      }
    } else {
      labelCell = document.createTextNode('');
    }

    // For the content cell, reference everything INSIDE the tab panel (not the panel itself)
    // Find the .contentfragment article inside panel
    let contentCell = [];
    const article = panel.querySelector('article');
    if (article) {
      // Ignore the h3.cmp-contentfragment__title (redundant, tab label is already present)
      let foundTitle = false;
      Array.from(article.childNodes).forEach(node => {
        // Omit first h3
        if (!foundTitle && node.nodeType === 1 && node.tagName.toLowerCase() === 'h3') {
          foundTitle = true;
        } else {
          contentCell.push(node);
        }
      });
    } else {
      // Fallback: use all childNodes (in case structure is different)
      Array.from(panel.childNodes).forEach(node => {
        contentCell.push(node);
      });
    }

    // Remove empty text nodes
    contentCell = contentCell.filter(n => {
      if (n.nodeType === 3) {
        // Text node
        return n.textContent.trim().length > 0;
      }
      // Keep elements
      return true;
    });
    return [labelCell, contentCell.length === 1 ? contentCell[0] : contentCell];
  });

  // Compose all rows: header, ...tab rows
  const cells = [headerRow, ...tabTableRows];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  element.replaceWith(block);
}
