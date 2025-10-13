/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header
  const headerRow = ['Accordion (accordion33)'];
  const rows = [headerRow];

  // Find the main contentfragment article
  const cfArticle = element.querySelector('.cmp-contentfragment__elements');
  if (!cfArticle) return;
  const cfChildren = Array.from(cfArticle.children);

  // Compose intro row: everything before first h2
  let firstH2Idx = cfChildren.findIndex(el => el.tagName === 'H2');
  if (firstH2Idx > 0) {
    const introContent = [];
    for (let i = 0; i < firstH2Idx; i++) {
      if (cfChildren[i]) {
        // Flatten nested divs/images
        if (cfChildren[i].tagName === 'DIV' && cfChildren[i].children.length > 0) {
          Array.from(cfChildren[i].children).forEach(child => introContent.push(child));
        } else {
          introContent.push(cfChildren[i]);
        }
      }
    }
    if (introContent.length) {
      rows.push(['Introduction', introContent]);
    }
  }

  // For each h2, collect its content until the next h2
  let i = firstH2Idx;
  while (i !== -1 && i < cfChildren.length) {
    if (cfChildren[i] && cfChildren[i].tagName === 'H2') {
      const titleText = cfChildren[i].textContent.trim();
      const contentEls = [];
      let j = i + 1;
      while (j < cfChildren.length && cfChildren[j] && cfChildren[j].tagName !== 'H2') {
        if (cfChildren[j].tagName === 'DIV' && cfChildren[j].children.length > 0) {
          Array.from(cfChildren[j].children).forEach(child => contentEls.push(child));
        } else {
          contentEls.push(cfChildren[j]);
        }
        j++;
      }
      // Always add the row, even if content is empty (to preserve all titles)
      rows.push([titleText, contentEls]);
      i = j;
    } else {
      i++;
    }
  }

  // If no accordion items found, try to extract all text content as a single row
  if (rows.length === 1) {
    const allContent = [];
    cfChildren.forEach(el => {
      if (el) {
        if (el.tagName === 'DIV' && el.children.length > 0) {
          Array.from(el.children).forEach(child => allContent.push(child));
        } else {
          allContent.push(el);
        }
      }
    });
    if (allContent.length) {
      rows.push(['Content', allContent]);
    }
  }

  // Replace original element with accordion block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
