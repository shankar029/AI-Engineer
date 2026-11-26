import publication from '../book/publication.json' with { type: 'json' };

export const repositoryUrl = 'https://github.com/shankar029/AI-Engineer';
export const metadata = publication;
export const chapters = publication.parts.flatMap(part => part.chapters).map((chapter, index) => ({
  ...chapter, number: String(index + 1).padStart(2, '0'), type: 'chapter'
}));
export const bookOrder = [
  ...publication.frontMatter.map(page => ({ ...page, type: 'matter' })),
  ...publication.parts.flatMap(part => [
    { file: part.file, title: part.title, type: 'home' },
    ...chapters.filter(chapter => part.chapters.some(entry => entry.file === chapter.file))
  ]),
  ...publication.backMatter.map(page => ({ ...page, type: 'matter' }))
];
export const readingPages = [
  { file: 'index.html', title: publication.title, type: 'cover' }, ...bookOrder,
  { file: 'authoring.html', title: 'Authoring guide', type: 'guide' }
];
export const wholeBookFiles = {
  epub: 'becoming-an-ai-engineer-review.epub',
  digital: 'becoming-an-ai-engineer-reading-review.pdf',
  print: 'becoming-an-ai-engineer-6x9-print-review.pdf'
};
