import { assert } from 'chai';
import fs from 'fs';
import path from 'path';
import rimraf from 'rimraf';
import configdir from '../src/utils/configdir';

const cwd = path.resolve(__dirname);

describe('configdir', () => {
  describe('with just existing directory', () => {
    it('should have directory', () => {
      assert.isTrue(fs.existsSync(cwd));
    });

    it('should not have Dotsync directory', () => {
      assert.isFalse(fs.existsSync(path.join(cwd, 'Dotsync')));
    });

    describe('when executed', () => {
      before((done) => {
        configdir(cwd, done);
      });

      it('should create Dotsync directory', () => {
        assert.isTrue(fs.existsSync(path.join(cwd, 'Dotsync')));
      });

      after((done) => {
        rimraf(path.join(cwd, 'Dotsync'), done);
      });
    });
  });

  describe('with non existing directory', () => {
    const tmp = path.join(cwd, 'tmp');

    it('should not have directory', () => {
      assert.isFalse(fs.existsSync(tmp));
    });

    it('should not have Dotsync directory', () => {
      assert.isFalse(fs.existsSync(path.join(tmp, 'Dotsync')));
    });

    describe('when executed', () => {
      before((done) => {
        configdir(tmp, done);
      });

      it('should create Dotsync directory', () => {
        assert.isTrue(fs.existsSync(path.join(tmp, 'Dotsync')));
      });
    });

    after((done) => {
      rimraf(tmp, done);
    });
  });

  describe('with existing directory', () => {
    before((done) => {
      fs.mkdir(path.join(cwd, 'Dotsync'), done);
    });

    it('should have directory', () => {
      assert.isTrue(fs.existsSync(cwd));
    });

    it('should have Dotsync directory', () => {
      assert.isTrue(fs.existsSync(path.join(cwd, 'Dotsync')));
    });

    describe('when executed', () => {
      before((done) => {
        configdir(cwd, done);
      });

      it('should not change anything', () => {
        assert.isTrue(fs.existsSync(path.join(cwd, 'Dotsync')));
      });
    });

    after((done) => {
      rimraf(path.join(cwd, 'Dotsync'), done);
    });
  });
});
