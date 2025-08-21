/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card rows for a group of contributor/guide sections
  function extractCards(sections) {
    const rows = [];
    sections.forEach(section => {
      const img = section.querySelector('.cmp-image__image');
      const rightCell = [];
      const nameTitle = section.querySelector('.title .cmp-title__text, .cmp-title h3.cmp-title__text');
      if (nameTitle) rightCell.push(nameTitle);
      const subtitleTitle = section.querySelector('.title ~ .title .cmp-title__text, .cmp-title--black .cmp-title__text, h5.cmp-title__text');
      if (subtitleTitle && (!nameTitle || subtitleTitle.textContent.trim() !== nameTitle.textContent.trim())) rightCell.push(subtitleTitle);
      const btnList = section.querySelector('.buildingblock, .cmp-buildingblock--btn-list');
      if (btnList) {
        const btns = Array.from(btnList.querySelectorAll('a.cmp-button'));
        if (btns.length) {
          const btnContainer = document.createElement('div');
          btns.forEach(btn => btnContainer.appendChild(btn));
          rightCell.push(btnContainer);
        }
      }
      if (img && rightCell.length) rows.push([img, rightCell]);
    });
    return rows;
  }

  // Find all contributor/guide cards sections
  const contributorSections = Array.from(element.querySelectorAll('section.cmp-experience-fragment--contributor'));
  const guideStartIdx = contributorSections.findIndex(sec => {
    return sec.querySelector('.cmp-title__text') && sec.querySelector('.cmp-title__text').textContent.trim() === 'Sofia Sjöberg';
  });
  const contributors = contributorSections.slice(0, guideStartIdx);
  const guides = contributorSections.slice(guideStartIdx);

  // Extract introductory heading and text for contributors
  const contributorsTitle = element.querySelectorAll('.title.cmp-title--underline .cmp-title__text')[0];
  const contributorsTextBlock = element.querySelectorAll('.text.cmp-text--font-small .cmp-text')[0];
  // Extract introductory heading and text for guides
  const guidesTitle = element.querySelectorAll('.title.cmp-title--underline .cmp-title__text')[1];
  const guidesTextBlock = element.querySelectorAll('.text.cmp-text--font-small .cmp-text')[1];

  // Build cards tables as required
  const contributorsTable = WebImporter.DOMUtils.createTable([
    ['Cards (cards24)'],
    ...extractCards(contributors)
  ], document);
  const guidesTable = WebImporter.DOMUtils.createTable([
    ['Cards (cards24)'],
    ...extractCards(guides)
  ], document);

  // Compose output nodes in the correct order
  const outputNodes = [];
  if (contributorsTitle) outputNodes.push(contributorsTitle);
  if (contributorsTextBlock) outputNodes.push(contributorsTextBlock);
  outputNodes.push(contributorsTable);
  if (guidesTitle) outputNodes.push(guidesTitle);
  if (guidesTextBlock) outputNodes.push(guidesTextBlock);
  outputNodes.push(guidesTable);

  element.replaceWith(...outputNodes);
}
