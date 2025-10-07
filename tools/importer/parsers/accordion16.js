/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main contentfragment block
  const cf = element.querySelector('.cmp-contentfragment__elements');
  if (!cf) return;

  // Helper: flatten children, unwrap images
  function getFlatChildren(parent) {
    const out = [];
    Array.from(parent.children).forEach(child => {
      // Unwrap image grid wrappers
      if (
        child.classList &&
        child.classList.contains('aem-Grid') &&
        child.querySelector('.cmp-image')
      ) {
        const img = child.querySelector('.cmp-image');
        if (img) out.push(img);
      } else {
        out.push(child);
      }
    });
    return out;
  }

  const children = getFlatChildren(cf);

  // Build accordion rows: [title, content]
  const rows = [];
  const headerRow = ['Accordion (accordion16)'];

  // First item: intro (title, intro p + image)
  const mainTitle = element.querySelector('.cmp-title h1');
  let introP = null;
  let introImg = null;
  for (let i = 0; i < children.length; i++) {
    if (!introP && children[i].tagName === 'P') introP = children[i].cloneNode(true);
    if (!introImg && children[i].classList && children[i].classList.contains('cmp-image')) introImg = children[i].cloneNode(true);
    if (introP && introImg) break;
  }
  if (mainTitle && (introP || introImg)) {
    const introContent = [];
    if (introP) introContent.push(introP);
    if (introImg) introContent.push(introImg);
    rows.push([mainTitle.textContent.trim(), introContent]);
  }

  // For each h2, collect title, image(s), and paragraph(s) until next h2
  for (let i = 0; i < children.length; i++) {
    if (children[i].tagName === 'H2') {
      const title = children[i].textContent.trim();
      const content = [];
      let j = i + 1;
      while (j < children.length && children[j].tagName !== 'H2') {
        if (
          children[j].classList &&
          children[j].classList.contains('cmp-image')
        ) {
          content.push(children[j].cloneNode(true));
        } else if (children[j].tagName === 'P') {
          content.push(children[j].cloneNode(true));
        }
        j++;
      }
      if (content.length) {
        rows.push([title, content]);
      }
    }
  }

  // Ensure at least one row is present after header
  if (rows.length === 0) return;

  // Build table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  // Replace original element
  if (table) {
    element.replaceWith(table);
  }
}
