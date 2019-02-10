const { assert } = require('chai');
const isPlugin = require('../src/utils/isPlugin');

describe('isPlugin', () => {
  it('should recognize official plugin', () => {
    assert.isTrue(isPlugin('@dotsync/plugin-link'));
  });

  it('should recognize unofficial plugin', () => {
    assert.isTrue(isPlugin('dotsync-plugin-link'));
  });

  it('should recognize unofficial scoped plugin', () => {
    assert.isTrue(isPlugin('@pksunkara/dotsync-plugin-link'));
  });

  it('should not recognize unofficial scoped plugin without prefix', () => {
    assert.isFalse(isPlugin('@pksunkara/plugin-link'));
  });

  it('should not recognize official store', () => {
    assert.isFalse(isPlugin('@dotsync/storage-git'));
  });
});
