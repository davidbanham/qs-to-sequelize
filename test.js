const queryLib = require('./index');
const expect = require('must');

describe('query', () => {
  it('must transform per_page into limit', () => {
    const result = queryLib({ per_page: 20 });
    expect(result.limit).to.equal(20);
  });

  it('must transform page into offset', () => {
    const result = queryLib({ per_page: 20, page: 3 });
    expect(result.offset).to.equal(40);

    const result2 = queryLib({ per_page: 10, page: 3 });
    expect(result2.offset).to.equal(20);
  });

  it('must throw if passed a page without a per_page', () => {
    let thrown = false;

    try {
      queryLib({ page: 3 });
    } catch (e) {
      thrown = true;
      expect(e.message).to.equal('Cannot calculate page without per_page');
    }

    if (!thrown) throw new Error('did not throw');
  });

  it('must transmute sort', () => {
    const result = queryLib({ sort: 'created_at' });
    expect(Array.isArray(result.order));
    expect(result.order[0]).to.eql(['created_at', 'ASC']);
  });

  it('must allow desc sort', () => {
    const result = queryLib({ sort: '-created_at' });
    expect(Array.isArray(result.order));
    expect(result.order[0]).to.eql(['created_at', 'DESC']);
  });

  it('must barf on csv sort props', () => {
    let thrown = false;

    try {
      queryLib({ sort: '-created_at,foo' });
    } catch (e) {
      thrown = true;
      expect(e.message).to.equal('Cannot sort by multiple properties');
    }

    if (!thrown) throw new Error('did not throw');
  });

  it('must transmute created_since', () => {
    const ts = '2016-12-07T00:28:40.480Z';
    const result = queryLib({ created_since: ts });
    expect(result.where.created_at).to.eql({ $gt: ts });
  });

  it('must transmute updated_since', () => {
    const ts = '2016-12-07T00:28:40.480Z';
    const result = queryLib({ updated_since: ts });
    expect(result.where.updated_at).to.eql({ $gt: ts });
  });

  it('must transmute created_before', () => {
    const ts = '2016-12-07T00:28:40.480Z';
    const result = queryLib({ created_before: ts });
    expect(result.where.created_at).to.eql({ $lt: ts });
  });

  it('must transmute updated_before', () => {
    const ts = '2016-12-07T00:28:40.480Z';
    const result = queryLib({ updated_before: ts });
    expect(result.where.updated_at).to.eql({ $lt: ts });
  });

  it('must transmute user_id', () => {
    const result = queryLib({ 'filter[user_id]': 'fred' });
    expect(result.where.user_id).to.eql('fred');
  });
});
