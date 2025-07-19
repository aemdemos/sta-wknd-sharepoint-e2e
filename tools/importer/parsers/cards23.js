/* global WebImporter */
export default function parse(element, { document }) {
  // Find all relevant card sections in DOM order
  const allCardSections = Array.from(element.querySelectorAll('section.cmp-experience-fragment--contributor'));

  // Find H2 headings and associated descriptions (the next .cmp-text--font-small after each h2)
  const h2s = Array.from(element.querySelectorAll('h2.cmp-title__text'));
  const descs = Array.from(element.querySelectorAll('.cmp-text--font-small'));

  // Helper to find description (cmp-text) following a given heading
  function getDescriptionAfter(heading) {
    // Find the closest cmp-text--font-small after the heading in the DOM
    let next = heading.parentElement;
    while (next && next.nextElementSibling && !next.nextElementSibling.classList.contains('cmp-text--font-small')) {
      next = next.nextElementSibling;
    }
    if (next && next.nextElementSibling && next.nextElementSibling.classList.contains('cmp-text--font-small')) {
      // Return the <div class="cmp-text"> inside this
      const descDiv = next.nextElementSibling.querySelector('.cmp-text');
      return descDiv || next.nextElementSibling;
    }
    return null;
  }

  // Find indices of the H2s in DOM order
  let contributorsTitleIdx = -1, guidesTitleIdx = -1;
  h2s.forEach((h2, idx) => {
    if (h2.textContent.trim() === 'Our Contributors') contributorsTitleIdx = idx;
    if (h2.textContent.trim() === 'WKND Guides') guidesTitleIdx = idx;
  });

  // Get contributor and guides h2 elements
  const contributorsTitle = contributorsTitleIdx !== -1 ? h2s[contributorsTitleIdx] : null;
  const guidesTitle = guidesTitleIdx !== -1 ? h2s[guidesTitleIdx] : null;

  // Get their descriptions
  const contributorsDesc = contributorsTitle ? getDescriptionAfter(contributorsTitle) : null;
  const guidesDesc = guidesTitle ? getDescriptionAfter(guidesTitle) : null;

  // Determine card group boundaries based on order in DOM
  let contributors = [], guides = [];
  if (contributorsTitle && guidesTitle) {
    allCardSections.forEach(sec => {
      if (sec.compareDocumentPosition(guidesTitle) & Node.DOCUMENT_POSITION_FOLLOWING) {
        contributors.push(sec);
      } else {
        guides.push(sec);
      }
    });
    // Fallback if not all cards are assigned
    if (contributors.length + guides.length !== allCardSections.length) {
      contributors = allCardSections.slice(0, 4);
      guides = allCardSections.slice(4);
    }
  } else {
    // fallback: use 4/3 split as in screenshots
    contributors = allCardSections.slice(0, 4);
    guides = allCardSections.slice(4);
  }

  // Helper: extract card row content from section
  function extractCard(section) {
    // First cell: the image (reference existing img element)
    const img = section.querySelector('img');
    // Second cell: text content, including all .cmp-title__text (h3, h5), plus all anchor tags for social, in DOM order
    const content = [];
    // Add all .cmp-title__text (h3, h5, etc.) in order
    section.querySelectorAll('.cmp-title__text').forEach(el => content.push(el));
    // Add all social links as they appear in DOM order
    section.querySelectorAll('a.cmp-button').forEach(a => content.push(a));
    return [img || '', content.length === 1 ? content[0] : content.length ? content : ''];
  }

  // Compose tables for contributors and guides, with description as the first content row after the header
  const contributorCells = [['Cards (cards23)']];
  if (contributorsDesc) contributorCells.push([contributorsDesc]);
  contributors.forEach(section => contributorCells.push(extractCard(section)));
  const guideCells = [['Cards (cards23)']];
  if (guidesDesc) guideCells.push([guidesDesc]);
  guides.forEach(section => guideCells.push(extractCard(section)));

  // Create tables
  const contributorsBlock = WebImporter.DOMUtils.createTable(contributorCells, document);
  const guidesBlock = WebImporter.DOMUtils.createTable(guideCells, document);

  // Replace the whole element with the two tables, separated by a <br>
  element.replaceWith(contributorsBlock, document.createElement('br'), guidesBlock);
}
