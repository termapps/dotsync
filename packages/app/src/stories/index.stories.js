/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/vue';

import Loading from '../components/Loading.vue';

storiesOf('Loading', module)
  .add('normal', () => ({
    components: { Loading },
    template: '<Loading></Loading>',
  }));
