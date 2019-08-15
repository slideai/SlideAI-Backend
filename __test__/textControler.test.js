/**
 * @jest-environment node
 */

const Robot = require('../src/Robots/Text');
require ('dotenv').config()

const localOfAplication = process.env.PLACE

describe('Text Robot', () => {
if(localOfAplication === 'Continuos Integration'){
  it('fetch content from Wikipedia', async () => {
		const contentLang = 'pt';
		const contentSearchTerm = 'Bill Gates';
	  
		const wikipidiaContent = await Robot.fetchContentFromWikipedia(contentSearchTerm, contentLang)
		expect(wikipidiaContent).toBeDefined();
	}	
  )};


  it('remove blank lines and markdown', () => {
  	const markdown = '===== Bill Gates =====\n\n\n\nBill Gates\n\nBill Gates';

  	const contentWithoutBlankLinesAndMarkdown = Robot.removeBlankLinesAndMarkdown(markdown)
  	expect(contentWithoutBlankLinesAndMarkdown).toBe('Bill Gates Bill Gates')
  });

  it('remove dates in parentheses', () => {
  	const dateInParentheses = 'Real Instituto de Tecnologia (2002)';

  	const dateWithoutParentheses = Robot.removeDatesInParentheses(dateInParentheses)
  	expect(dateWithoutParentheses).toBe('Real Instituto de Tecnologia ')
  });

  it('sanianizeContent', () =>{
	const originalContent = '===== Bill Gates =====\n\n\n\nBill Gates(1950)\n\nBill Gates'
	const cleanContent = Robot.sanitizeContent(originalContent)
	expect(cleanContent).toBe("Bill Gates Bill Gates")
  });

  it('break content into sentences', () => {
  	const sourceContentSanitized = 'Bill Gates is a great person. Bill Gates is cool.Bill gates has a lot of money';

  	const sentences = Robot.breakContentIntoSentences(sourceContentSanitized);
  	expect(sentences.length).toBe(3);
  });

  it('limit maximum sentences', () => {
  	const sentences = ['Bill Gates is a great person.', 'Bill Gates is cool.', 'Bill Gates is very rich.']
  	const maximumSentences = 2;

  	const limitedSentences = Robot.limitMaximumSentences(sentences, maximumSentences)
  	expect(limitedSentences.length).toBe(2)
  });
  if(localOfAplication === 'Continuos Integration'){
	it('fetch Watson and return keywords', async () => {
		const sentenceText = 'Bill Gates is a great person.'
		const keywords = await Robot.fetchWatsonAndReturnKeywords(sentenceText)
		expect(JSON.stringify(keywords)).toBe(JSON.stringify(["Bill Gates", "great person"]))
	},30000);
  };
})