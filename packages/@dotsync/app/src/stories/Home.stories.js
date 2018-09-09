/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/vue';
import mock from 'mock-require';

mock('electron', {
  remote: {
    app: {
      getPath() {
      },
    },
  },
});

storiesOf('Home', module);
