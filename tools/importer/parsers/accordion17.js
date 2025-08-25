/* global WebImporter */
export default function parse(element, { document }) {
  // Header row
  const headerRow = ['Accordion (accordion17)'];
  const rows = [headerRow];

  // Find the main contentfragment
  const cf = element.querySelector('.contentfragment');
  if (!cf) return;
  const contentRoot = cf.querySelector('.cmp-contentfragment__elements') || cf;
  const children = Array.from(contentRoot.children);

  // Find the main h1 title for intro section
  const mainTitleEl = element.querySelector('h1.cmp-title__text, h1');
  const introTitle = mainTitleEl ? mainTitleEl.textContent.trim() : '';

  // Partition children into sections (intro, then each h2 section)
  let sections = [];
  let i = 0;
  // 1. Intro section: all content before first h2
  let introContent = [];
  while (
    i < children.length &&
    !(
      children[i].querySelector && children[i].querySelector('h2.cmp-title__text')
    )
  ) {
    introContent.push(children[i]);
    i++;
  }
  if (introContent.length) {
    sections.push({
      title: introTitle,
      content: introContent,
    });
  }

  // 2. Now parse all h2-based sections
  while (i < children.length) {
    // Look for the h2 section title
    let node = children[i];
    let h2 = node.querySelector && node.querySelector('h2.cmp-title__text');
    if (h2) {
      const sectionTitle = h2.textContent.trim();
      let content = [];
      // Collect all subsequent nodes until the next h2 section
      i++;
      while (
        i < children.length &&
        !(children[i].querySelector && children[i].querySelector('h2.cmp-title__text'))
      ) {
        content.push(children[i]);
        i++;
      }
      sections.push({
        title: sectionTitle,
        content,
      });
    } else {
      i++;
    }
  }

  // Create a row per section: [title, content]
  sections.forEach(({ title, content }) => {
    let titleCell = document.createTextNode(title);
    // Remove empty text nodes
    const filteredContent = (content || []).filter(n => {
      if (n.nodeType === 3) return Boolean(n.textContent.trim());
      if (n.nodeType === 1 && n.textContent.trim() === '') return false;
      return true;
    });
    let contentCell;
    if (filteredContent.length === 1) {
      contentCell = filteredContent[0];
    } else if (filteredContent.length > 1) {
      contentCell = filteredContent;
    } else {
      contentCell = '';
    }
    rows.push([titleCell, contentCell]);
  });

  // Make the table and replace the element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
