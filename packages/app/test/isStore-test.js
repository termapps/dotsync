import { assert } from 'chai';
import isStore from '../src/utils/isStore';

describe('isStore', () => {
  it('should recognize official store', () => {
    assert.isTrue(isStore('@dotsync/storage-git'));
  });

  it('should recognize unofficial store', () => {
    assert.isTrue(isStore('dotsync-storage-git'));
  });

  it('should recognize unofficial scoped store', () => {
    assert.isTrue(isStore('@pksunkara/dotsync-storage-git'));
  });

  it('should not recognize unofficial scoped store without prefix', () => {
    assert.isFalse(isStore('@pksunkara/storage-git'));
  });

  it('should not recognize official plugin', () => {
    assert.isFalse(isStore('@dotsync/plugin-link'));
  });
});
