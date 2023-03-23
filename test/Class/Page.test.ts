import { Page } from '../../src/Class/Page';
import { Url } from '../../src/Class/Url';

describe('Page', () => {
  const url = new Url('http://example.com');
  let page: Page;

  beforeEach(() => {
    page = new Page(url);
  });

  describe('getUrl', () => {
    it('returns the URL as a string', () => {
      expect(page.getUrl()).toBe('http://example.com');
    });
  });

    describe('getLinks', () => {
        it('returns an empty array', () => {
            expect(page.getLinks()).toEqual([]);
        });
    });

    
});