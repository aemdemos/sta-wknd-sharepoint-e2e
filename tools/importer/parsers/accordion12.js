/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main contentfragment inside the element
  const contentFragment = element.querySelector('article.cmp-contentfragment');
  if (!contentFragment) return;

  // Get the cmp-contentfragment__elements
  const cfElements = contentFragment.querySelector('.cmp-contentfragment__elements');
  if (!cfElements) return;
  const cfChildren = Array.from(cfElements.children);

  // Find all h2s and their index in cfChildren
  const accordionSections = [];
  for (let i = 0; i < cfChildren.length; i++) {
    const child = cfChildren[i];
    const h2 = child.querySelector && child.querySelector('h2.cmp-title__text');
    if (h2) {
      accordionSections.push({ idx: i, h2 });
    }
  }

  if (!accordionSections.length) return;

  // For each accordion section, gather content after title up to next title
  const rows = [];
  for (let i = 0; i < accordionSections.length; i++) {
    const { idx, h2 } = accordionSections[i];
    const nextIdx = (accordionSections[i + 1] ? accordionSections[i + 1].idx : cfChildren.length);
    // Gather all elements between idx+1 and nextIdx, ignoring empty grids
    const contentEls = [];
    for (let j = idx + 1; j < nextIdx; j++) {
      const el = cfChildren[j];
      if (el.matches && el.matches('.aem-Grid') && el.innerText.trim() === '') continue;
      // Also skip totally empty divs
      if (el.innerText.trim() === '' && el.querySelectorAll('img, video, iframe').length === 0) continue;
      contentEls.push(el);
    }
    if (contentEls.length === 0) continue;
    let contentCell;
    if (contentEls.length === 1) {
      contentCell = contentEls[0];
    } else {
      const wrapper = document.createElement('div');
      contentEls.forEach(el => wrapper.appendChild(el));
      contentCell = wrapper;
    }
    rows.push([h2, contentCell]);
  }

  if (!rows.length) return;

  // Compose table: header, then one row for each accordion item
  const cells = [['Accordion (accordion12)'], ...rows];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
