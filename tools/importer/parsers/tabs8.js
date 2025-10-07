/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Extract tab labels and panels
  const tabHeaders = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li'));
  const tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));

  // Defensive: Only proceed if headers and panels match
  if (tabHeaders.length === 0 || tabPanels.length === 0 || tabHeaders.length !== tabPanels.length) return;

  // Header row as required
  const headerRow = ['Tabs (tabs8)'];
  const rows = [headerRow];

  tabHeaders.forEach((tabHeader, i) => {
    const label = tabHeader.textContent.trim();
    const panel = tabPanels[i];
    if (!panel) return;

    // Find the main content fragment within each panel
    const cf = panel.querySelector('.contentfragment > article') || panel.querySelector('.contentfragment') || panel;
    let tabContent = [];

    if (cf) {
      if (label.toLowerCase() === 'overview') {
        // Only include the actual content heading, image, caption, and description
        // Remove the duplicate block title h3 ("Napa Wine Tasting")
        const headings = Array.from(cf.querySelectorAll('h3'));
        let contentHeading = headings.find(h => h.textContent.trim() !== 'Napa Wine Tasting');
        const image = cf.querySelector('img');
        const caption = cf.querySelector('.cmp-image__title') || (image && image.nextElementSibling && image.nextElementSibling.tagName === 'SPAN' ? image.nextElementSibling : null);
        const desc = cf.querySelector('p');
        if (contentHeading) tabContent.push(contentHeading);
        if (image) tabContent.push(image);
        if (caption) tabContent.push(caption);
        if (desc) tabContent.push(desc);
      } else if (label.toLowerCase() === 'what to bring') {
        // For What to Bring, preserve the <ul> structure with <li> children
        const elements = cf.querySelector('.cmp-contentfragment__elements');
        if (elements) {
          const ul = elements.querySelector('ul');
          if (ul) {
            // Clone the ul and its li children only
            const newUl = document.createElement('ul');
            Array.from(ul.querySelectorAll('li')).forEach(li => {
              newUl.appendChild(li.cloneNode(true));
            });
            tabContent.push(newUl);
          }
        } else {
          tabContent = [cf];
        }
      } else {
        // For Itinerary, preserve all <h3> and <p> in order
        const elements = cf.querySelector('.cmp-contentfragment__elements');
        if (elements) {
          tabContent = Array.from(elements.querySelectorAll('h3, p')).filter(e => e.textContent.trim());
        } else {
          tabContent = [cf];
        }
      }
    } else {
      tabContent = [panel];
    }

    rows.push([label, tabContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  tabsBlock.replaceWith(block);
}
