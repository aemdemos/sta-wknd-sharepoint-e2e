/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main contentfragment article
  const contentFragment = element.querySelector('.contentfragment article.cmp-contentfragment');
  if (!contentFragment) return;

  // Get the main article title
  const fragmentTitle = contentFragment.querySelector('.cmp-contentfragment__title');
  // Get the content container
  const elementsContainer = contentFragment.querySelector('.cmp-contentfragment__elements');
  if (!elementsContainer) return;

  // We'll collect accordion items as [title, content] pairs
  const accordionItems = [];

  // Gather all direct children of elementsContainer
  const children = Array.from(elementsContainer.children);

  // Find all h2 section titles and their content
  let sections = [];
  let currentSection = null;
  children.forEach((node) => {
    const h2 = node.querySelector && node.querySelector('h2.cmp-title__text');
    if (h2) {
      if (currentSection && currentSection.content.length > 0) sections.push(currentSection);
      currentSection = { title: h2, content: [] };
      return;
    }
    if (currentSection) {
      if (node.querySelector && node.querySelector('.cmp-image__image')) {
        const imgDiv = node.querySelector('.cmp-image');
        if (imgDiv) currentSection.content.push(imgDiv);
        return;
      }
      if (node.querySelector && node.querySelector('blockquote')) {
        currentSection.content.push(node);
        return;
      }
      if (node.tagName === 'P') {
        currentSection.content.push(node);
        return;
      }
      if (node.tagName === 'DIV') {
        const ps = node.querySelectorAll('p');
        if (ps.length) {
          ps.forEach(p => currentSection.content.push(p));
          return;
        }
      }
    }
  });
  if (currentSection && currentSection.content.length > 0) sections.push(currentSection);

  // Gather intro content (before first h2)
  let introContent = [];
  for (let node of children) {
    const h2 = node.querySelector && node.querySelector('h2.cmp-title__text');
    if (h2) break;
    if (node.querySelector && node.querySelector('.cmp-image__image')) {
      const imgDiv = node.querySelector('.cmp-image');
      if (imgDiv) introContent.push(imgDiv);
      continue;
    }
    if (node.querySelector && node.querySelector('blockquote')) {
      introContent.push(node);
      continue;
    }
    if (node.tagName === 'P') {
      introContent.push(node);
      continue;
    }
    if (node.tagName === 'DIV') {
      const ps = node.querySelectorAll('p');
      if (ps.length) {
        ps.forEach(p => introContent.push(p));
        continue;
      }
    }
  }
  if (fragmentTitle && introContent.length > 0) {
    accordionItems.push([fragmentTitle, introContent.length === 1 ? introContent[0] : introContent]);
  }

  // Add all sections as accordion items
  sections.forEach(section => {
    if (section.title && section.content.length > 0) {
      accordionItems.push([section.title, section.content.length === 1 ? section.content[0] : section.content]);
    }
  });

  // Build the table rows
  const headerRow = ['Accordion (accordion3)'];
  const rows = [headerRow];
  accordionItems.forEach(([title, content]) => {
    rows.push([title, content]);
  });

  // If there are no accordion items, do not output the block
  if (rows.length === 1) return;

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the root element with the block
  element.replaceWith(block);
}
