/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main contentfragment article block
  const contentFragment = element.querySelector('article.contentfragment');
  if (!contentFragment) return;

  // Compose the header row
  const headerRow = ['Accordion (accordion32)'];
  const rows = [];

  // Find the main title (h3 inside contentfragment)
  const mainTitle = contentFragment.querySelector('h3.cmp-contentfragment__title');
  // Find author (h4 inside contentfragment)
  const authorTitle = contentFragment.querySelector('h4.cmp-title__text');

  // Find the main content container
  const cfElements = contentFragment.querySelector('.cmp-contentfragment__elements');
  if (!cfElements) return;
  const children = Array.from(cfElements.childNodes);

  // Helper to find the first element node after a given index
  function nextElementIdx(start) {
    for (let i = start; i < children.length; i++) {
      if (children[i].nodeType === 1) return i;
    }
    return children.length;
  }

  // Find all h2 indices (accordion section starts)
  const h2Indices = [];
  children.forEach((el, idx) => {
    if (
      el.nodeType === 1 &&
      el.querySelector &&
      el.querySelector('h2.cmp-title__text')
    ) {
      h2Indices.push(idx);
    }
  });

  // First accordion section: everything before first h2
  let firstContentEnd = h2Indices.length > 0 ? h2Indices[0] : children.length;
  const introContent = [];
  if (authorTitle) introContent.push(authorTitle.cloneNode(true));
  for (let i = 0; i < firstContentEnd; i++) {
    const el = children[i];
    if (el.nodeType !== 1) continue;
    // Flatten grids
    if (el.tagName === 'DIV' && el.querySelector('.aem-Grid')) {
      el.querySelectorAll('p, blockquote, img').forEach(n => introContent.push(n.cloneNode(true)));
    } else {
      if (el.tagName === 'P') introContent.push(el.cloneNode(true));
      const bq = el.querySelector && el.querySelector('blockquote');
      if (bq) introContent.push(bq.cloneNode(true));
      const img = el.querySelector && el.querySelector('img');
      if (img) introContent.push(img.cloneNode(true));
    }
  }
  if (mainTitle && introContent.length > 0) {
    rows.push([mainTitle.cloneNode(true), introContent]);
  }

  // For each h2 section, collect its content until the next h2
  for (let i = 0; i < h2Indices.length; i++) {
    const h2Idx = h2Indices[i];
    const h2El = children[h2Idx].querySelector('h2.cmp-title__text');
    const nextIdx = h2Indices[i + 1] !== undefined ? h2Indices[i + 1] : children.length;
    const sectionContent = [];
    for (let j = h2Idx + 1; j < nextIdx; j++) {
      const el = children[j];
      if (!el || el.nodeType !== 1) continue;
      if (el.tagName === 'DIV' && el.querySelector('.aem-Grid')) {
        el.querySelectorAll('p, blockquote, img').forEach(n => sectionContent.push(n.cloneNode(true)));
      } else {
        if (el.tagName === 'P') sectionContent.push(el.cloneNode(true));
        const bq = el.querySelector && el.querySelector('blockquote');
        if (bq) sectionContent.push(bq.cloneNode(true));
        const img = el.querySelector && el.querySelector('img');
        if (img) sectionContent.push(img.cloneNode(true));
      }
    }
    if (h2El && sectionContent.length > 0) {
      rows.push([h2El.cloneNode(true), sectionContent]);
    }
  }

  // Only output the block if there is at least one accordion item
  if (rows.length > 0) {
    const cells = [headerRow, ...rows];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  }
}
