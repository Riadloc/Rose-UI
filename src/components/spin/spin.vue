<template>
  <div class="more-spin">
    <svg
      class="more-spin-circular"
      viewBox="25 25 50 50"
    >
      <circle
        class="more-spin-path"
        cx="50"
        cy="50"
        r="20"
        fill="none"
        stroke-width="5"
        stroke-miterlimit="10"
      ></circle>
    </svg>
  </div>
</template>

<script>
export default {

}
</script>
<style lang="scss">
.more-spin  {
  width: 30px;
  height: 30px;
  position: relative;
  &-circular {
    animation: rotate 2s linear infinite;
    height: 100%;
    transform-origin: center center;
    width: 100%;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
  &-path {
    stroke-dasharray: 1,200;
    stroke-dashoffset: 0;
    animation: dash 1.5s ease-in-out infinite,color 6s ease-in-out infinite;
    stroke-linecap: round;
  }
}

@keyframes rotate {
  100% {
    -webkit-transform: rotate(1turn);
    transform: rotate(1turn);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1,200;
    stroke-dashoffset: 0;
  }

  50% {
    stroke-dasharray: 89,200;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 89,200;
    stroke-dashoffset: -124;
  }
}

@keyframes color {
  0%, 100% {
    stroke: #d62d20;
  }

  40% {
    stroke: #0057e7;
  }
  66% {
    stroke: #008744;
  }
  80%, 90% {
    stroke: #ffa700;
  }
}
</style>
