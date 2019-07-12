<template>
  <div>
    <div class="progress-list">
      <vs-alert active=true v-for="(item, index) in messages" :key="index" :icon="item.icon" :color="item.color">
        {{item.message}}
      </vs-alert>
    </div>
    <div class="progress-list">
      <ul>
        <li v-for="(item, index) in done" :key="index">
          <span class="mi mi-done"></span>
          <span>{{item.message}}</span>
          <pre v-if="item.logs">{{item.logs}}</pre>
        </li>
        <li v-if="current">
          <bounce-loader class="loading" loading color="#5b3cc4" :size="24"></bounce-loader>
          <span>{{current}}</span>
        </li>
        <li v-if="error">
          <span class="mi mi-clear"></span>
          <span><a @click="showDetails()">{{error}}</a></span>
        </li>
        <pre v-if="logs">{{logs}}</pre>
      </ul>
      <vs-popup v-if="error" title="Error Details" :active.sync="detailsPopup">
        <pre>{{errorDetails}}</pre>
      </vs-popup>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { BounceLoader } from '@saeris/vue-spinners';

export default {
  components: {
    BounceLoader,
  },
  computed: {
    ...mapState('Progress', [
      'messages',
      'done',
      'current',
      'logs',
      'error',
      'errorDetails',
    ]),
  },
  methods: {
    showDetails() {
      this.detailsPopup = true;
    },
  },
  data() {
    return {
      detailsPopup: false,
    };
  },
};
</script>

<style lang="less">
.progress-list {
  margin: 20px 50px 0;

  ul {
    list-style: none;

    li {
      display: flex;
      margin-bottom: 5px;

      .loading {
        margin-right: 20px;
      }

      span {
        line-height: 24px;
        font-size: 16px;

        &.mi {
          margin-right: 20px;
          font-size: 24px;
        }

        &.mi-clear {
          color: rgba(var(--vs-danger), 1);

          & + span a {
            color: rgba(242, 19, 93, 1);
          }
        }

        &.mi-done {
          color: rgba(var(--vs-success), 1);

          & + span {
            color: rgba(23, 201, 100, 1);
          }
        }
      }
    }
  }

  .con-vs-alert {
    font-size: 16px;
    text-align: left;
    margin-top: 10px;
    box-shadow: none !important;
    height: auto !important;
  }
}
</style>
