<template>
  <div class="loader-main">
    <div class="loader-out box">
      <div class="loader-in box"></div>
      <div class="ballbox box">
        <div class="first-in ball"></div>
        <div class="second-in ball"></div>
      </div>
    </div>
    <div class="ballbox box">
      <div class="first-out ball"></div>
      <div class="second-out ball"></div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { remote } from 'electron';
import { configdir, Settings } from '@dotsync/core';

// TODO: Catch the thrown errors from everywhere
export default {
  computed: {
    ...mapState('Global', [
      'configdir',
    ]),
  },
  methods: {
    ...mapMutations('Global', [
      'setConfigdir',
      'setStoreSettings',
      'setVersionSettings',
    ]),
  },
  mounted() {
    this.setConfigdir(configdir(remote.app.getPath('appData')));

    this.setStoreSettings(new Settings(this.configdir, 'store').read());
    this.setVersionSettings(new Settings(this.configdir, 'version').read());

    this.$router.push({ name: 'StoreSettings' });
  },
};
</script>

<style lang="less" scoped>
@size: 160px;
@color: rgb(107, 216, 97);

@keyframes rotate-out {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(220deg);
  }
}

@keyframes rotate-in {
  0% {
    transform: rotate(-140deg);
  }
  100% {
    transform: rotate(140deg);
  }
}

@keyframes borderbox {
  0%, 100% {
    box-shadow: inset @color 0 0 0 16px;
  }
  50% {
    box-shadow: inset @color 0 0 0 2px;
  }
}

@keyframes firstball {
  0%, 50% {
    opacity: 1;
  }
  51%, 100% {
    opacity: 0;
  }
}

@keyframes secondball {
  0%, 50% {
    opacity: 0;
  }
  51%, 100% {
    opacity: 1;
  }
}

@keyframes borderball {
  0%, 100% {
    width: 16px;
    height: 16px;
    left: (@size / 2) - 8px;
  }
  50% {
    width: 2px;
    height: 2px;
    left: (@size / 2) - 2px;
  }
}

.loader-main {
  width: @size;
  margin: 100px auto;

  .box {
    width: @size;
    height: @size;
  }

  .ball {
    position: absolute;
    background: @color;
    border-radius: 50%;
  }

  .loader-out {
    position: absolute;
    clip: rect(0, @size, @size, @size / 2);

    &, + .ballbox {
      animation: rotate-out 1.5s linear infinite;
    }
  }

  .loader-in {
    position: absolute;
    clip: rect(0, @size, @size, @size / 2);
    border-radius: 50%;
    animation: rotate-in 1.5s ease-in-out infinite, borderbox 1.5s ease-in-out infinite;

    + .ballbox {
      animation: rotate-in 1.5s ease-in-out infinite;
    }
  }

  .first-in, .second-in {
    animation: borderball 1.5s ease-in-out infinite;
  }

  .second-in {
    bottom: 0;
  }

  .first-out {
    animation: borderball 1.5s ease-in-out infinite, firstball 1.5s ease-in-out infinite;
  }

  .second-out {
    bottom: 0;
    opacity: 0;
    animation: borderball 1.5s ease-in-out infinite, secondball 1.5s ease-in-out infinite;
  }
}
</style>
