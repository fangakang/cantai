<!--LOADING组件-->
<template>
    <div class="body_bg">
    <div class="lodingCover">
<!--         <div class="spinner">
            <div class="rect1"></div>
            <div class="rect2"></div>
            <div class="rect3"></div>
            <div class="rect4"></div>
            <div class="rect5"></div>
        </div> -->
        <div class="loader-inner ball-clip-rotate-multiple">
          <div></div>
          <div></div>

          <p>加载中…</p>
        </div>


    </div>
    </div>
</template>

<style>
    .lodingCover{position: fixed;top: 0;bottom: 0;left: 0;right: 0;width: 100%;height: 100%;z-index: 9999;background: rgba(0,0,0,.3);display: block}
    .spinner{margin: 0 auto;width: 50px;height: 60px;text-align: center;font-size: 10px;position: absolute;left: 50%;margin-left: -25px;top: 50%;margin-top: -30px;}
    .spinner > div{background-color: #fa8b2e;height: 100%;width: 6px;display: inline-block;-webkit-animation: stretchdelay 1.2s infinite ease-in-out;animation: stretchdelay 1.2s infinite ease-in-out;}
    .spinner .rect2{-webkit-animation-delay: -1.1s;animation-delay: -1.1s;}
    .spinner .rect3{-webkit-animation-delay: -1.0s;animation-delay: -1.0s;}
    .spinner .rect4{-webkit-animation-delay: -0.9s;animation-delay: -0.9s;}
    .spinner .rect5{-webkit-animation-delay: -0.8s;animation-delay: -0.8s;}
    @-webkit-keyframes stretchdelay{0%, 40%, 100%{-webkit-transform: scaleY(0.4)}
        20%{-webkit-transform: scaleY(1.0)}} @keyframes stretchdelay{0%, 40%, 100%{transform: scaleY(0.4);-webkit-transform: scaleY(0.4);}
                                                 20%{transform: scaleY(1.0);-webkit-transform: scaleY(1.0);}}




@keyframes rotate {
  0% {
    -webkit-transform: rotate(0deg) scale(1);
            transform: rotate(0deg) scale(1); }

  50% {
    -webkit-transform: rotate(180deg) scale(0.6);
            transform: rotate(180deg) scale(0.6); }

  100% {
    -webkit-transform: rotate(360deg) scale(1);
            transform: rotate(360deg) scale(1); } }

.ball-clip-rotate-multiple {
margin: 0 auto;width: 50px;height: 60px;text-align: center;font-size: 10px;position: absolute;left: 50%;margin-left: -25px;top: 50%;margin-top: -30px; }
  .ball-clip-rotate-multiple > div {
    -webkit-animation-fill-mode: both;
            animation-fill-mode: both;
    position: absolute;
    left: 0px;
    top: 0px;
    border: 4px solid #ff7400;
    border-bottom-color: transparent;
    border-top-color: transparent;
    border-radius: 100%;
    height: 70px;
    width: 70px;
    -webkit-animation: rotate 1s 0s ease-in-out infinite;
            animation: rotate 1s 0s ease-in-out infinite; }
    .ball-clip-rotate-multiple > div:last-child {
      display: inline-block;
      top: 20px;
      left: 20px;
      width: 30px;
      height: 30px;
      -webkit-animation-duration: 0.5s;
              animation-duration: 0.5s;
      border-color: #fa8b2e transparent #fa8b2e transparent;
      -webkit-animation-direction: reverse;
              animation-direction: reverse; }


</style>
