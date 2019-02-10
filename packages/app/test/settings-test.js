const { assert } = require('chai');
const fs = require('fs');
const path = require('path');
const settings = require('../src/utils/settings');

const cwd = path.resolve(__dirname);

describe('settings', () => {
  describe('reading non-existent setting', () => {
    it('should make sure file doesnt exist', () => {
      assert.isFalse(fs.existsSync(path.resolve(cwd, 'tmp.json')));
    });

    it('should return empty', () => {
      assert.deepEqual(settings.read(cwd, 'tmp'), {});
    });
  });

  describe('reading existent setting', () => {
    before((done) => {
      fs.writeFile(path.resolve(cwd, 'tmp.json'), '{ "id": 1 }', 'utf8', done);
    });

    it('should make sure file exist', () => {
      assert.isTrue(fs.existsSync(path.resolve(cwd, 'tmp.json')));
    });

    it('should return setting', () => {
      assert.deepEqual(settings.read(cwd, 'tmp'), { id: 1 });
    });

    after((done) => {
      fs.unlink(path.resolve(cwd, 'tmp.json'), done);
    });
  });

  describe('writing non-existent setting', () => {
    it('should make sure file doesnt exist', () => {
      assert.isFalse(fs.existsSync(path.resolve(cwd, 'tmp.json')));
    });

    it('should create file', (done) => {
      settings.write(cwd, 'tmp', { id: 1 });

      fs.readFile(path.resolve(cwd, 'tmp.json'), { encoding: 'utf8' }, (err, data) => {
        assert.deepEqual(data, '{\n  "id": 1\n}\n');
        done(err);
      });
    });

    after((done) => {
      fs.unlink(path.resolve(cwd, 'tmp.json'), done);
    });
  });

  describe('writing existent setting', () => {
    before((done) => {
      fs.writeFile(path.resolve(cwd, 'tmp.json'), '{ "id": 1 }', 'utf8', done);
    });

    it('should make sure file exist', () => {
      assert.isTrue(fs.existsSync(path.resolve(cwd, 'tmp.json')));
    });

    it('should edit file', (done) => {
      settings.write(cwd, 'tmp', { hello: 'tag' });

      fs.readFile(path.resolve(cwd, 'tmp.json'), { encoding: 'utf8' }, (err, data) => {
        assert.deepEqual(data, '{\n  "hello": "tag"\n}\n');
        done(err);
      });
    });

    after((done) => {
      fs.unlink(path.resolve(cwd, 'tmp.json'), done);
    });
  });
});
