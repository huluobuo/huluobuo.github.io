// ==UserScript==
// @name         盒子IM · 更多动画
// @namespace    boxim.anim
// @version      1.0.0
// @description  为盒子IM网页版添加可配置的界面动画：侧边导航、会话列表、未读徽标、消息气泡、页面过渡等
// @match        https://www.boximchat.com/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  if (window.__boximMoreAnim) return;
  window.__boximMoreAnim = true;

  // ==================================================================
  // 设置
  // ==================================================================
  var KEY = '__boxim_more_anim_v1';

  var reduceMotion = false;
  try {
    reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  } catch (e) {}

  var DEFAULTS = {
    enabled: !reduceMotion,
    nav: true,      // 侧边导航动效
    ui: true,       // 按钮 / 筛选条 / 悬停反馈
    route: true,    // 页面切换过渡
    list: true,     // 会话列表入场
    flash: true,    // 新消息闪动
    unread: true,   // 未读徽标呼吸
    avatar: true,   // 头像与在线光晕
    bubble: true,   // 消息气泡入场
    bg: false,      // 聊天背景流光
    speed: 1        // 动画速度倍率
  };

  var CLASS_MAP = {
    enabled: 'bxm-on',
    nav: 'bxm-nav',
    ui: 'bxm-ui',
    route: 'bxm-route',
    list: 'bxm-list',
    flash: 'bxm-flash-on',
    unread: 'bxm-unread',
    avatar: 'bxm-avatar',
    bubble: 'bxm-bubble',
    bg: 'bxm-bg'
  };

  function clampSpeed(v) {
    v = Number(v);
    if (!isFinite(v)) v = 1;
    return Math.min(2, Math.max(0.6, Math.round(v * 10) / 10));
  }

  function loadSettings() {
    var s = {};
    for (var k in DEFAULTS) s[k] = DEFAULTS[k];
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) {
        var o = JSON.parse(raw);
        if (o && typeof o === 'object') {
          for (var k2 in DEFAULTS) {
            if (o[k2] === undefined || o[k2] === null) continue;
            s[k2] = (k2 === 'speed') ? clampSpeed(o[k2]) : !!o[k2];
          }
        }
      }
    } catch (e) {}
    return s;
  }

  function saveSettings() {
    try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {}
  }

  var S = loadSettings();
  var flashReadyAt = Date.now() + 1600;   // 页面刚打开时不闪动

  // ==================================================================
  // 样式
  // ==================================================================
  var CSS = [
    /* ---------- 变量与关键帧 ---------- */
    'html{--bxm-speed:1}',
    '@keyframes bxm-list-in{0%{opacity:0;transform:translate3d(-16px,4px,0) scale(.985)}100%{opacity:1;transform:none}}',
    '@keyframes bxm-msg-in-left{0%{opacity:0;transform:translate3d(-20px,10px,0) scale(.94)}100%{opacity:1;transform:none}}',
    '@keyframes bxm-msg-in-right{0%{opacity:0;transform:translate3d(20px,10px,0) scale(.94)}100%{opacity:1;transform:none}}',
    '@keyframes bxm-nav-in{0%{opacity:0;transform:translate3d(-12px,0,0)}100%{opacity:1;transform:none}}',
    '@keyframes bxm-nav-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-2.5px)}}',
    '@keyframes bxm-badge{0%,100%{transform:scale(1)}50%{transform:scale(1.14)}}',
    '@keyframes bxm-online{0%{box-shadow:0 0 0 0 rgba(52,199,89,.6)}70%{box-shadow:0 0 0 5px rgba(52,199,89,0)}100%{box-shadow:0 0 0 0 rgba(52,199,89,0)}}',
    '@keyframes bxm-flash{0%{box-shadow:inset 0 0 0 999px rgba(82,197,255,.22)}100%{box-shadow:inset 0 0 0 999px rgba(82,197,255,0)}}',
    '@keyframes bxm-route-in{0%{opacity:.3;transform:translateY(10px) scale(.998)}100%{opacity:1;transform:none}}',
    '@keyframes bxm-bg-drift{0%{background-position:0% 50%}100%{background-position:200% 50%}}',

    /* ---------- 侧边导航 ---------- */
    'html.bxm-on.bxm-nav .home-page .navi-bar .menu .link{animation:bxm-nav-in calc(.5s / var(--bxm-speed)) cubic-bezier(.2,.8,.2,1) backwards}',
    'html.bxm-on.bxm-nav .home-page .navi-bar .menu .link:nth-child(1){animation-delay:0s}',
    'html.bxm-on.bxm-nav .home-page .navi-bar .menu .link:nth-child(2){animation-delay:.04s}',
    'html.bxm-on.bxm-nav .home-page .navi-bar .menu .link:nth-child(3){animation-delay:.08s}',
    'html.bxm-on.bxm-nav .home-page .navi-bar .menu .link:nth-child(4){animation-delay:.12s}',
    'html.bxm-on.bxm-nav .home-page .navi-bar .menu .link:nth-child(5){animation-delay:.16s}',
    'html.bxm-on.bxm-nav .home-page .navi-bar .menu .link:nth-child(6){animation-delay:.2s}',
    'html.bxm-on.bxm-nav .home-page .navi-bar .link .menu-item{transition:transform .32s cubic-bezier(.34,1.56,.64,1),background-color .25s ease,color .2s ease,box-shadow .3s ease}',
    'html.bxm-on.bxm-nav .home-page .navi-bar .link:hover .menu-item{transform:translateY(-3px)}',
    'html.bxm-on.bxm-nav .home-page .navi-bar .link:active .menu-item{transform:scale(.94)}',
    'html.bxm-on.bxm-nav .home-page .navi-bar .menu-item .icon{transition:transform .38s cubic-bezier(.34,1.56,.64,1)}',
    'html.bxm-on.bxm-nav .home-page .navi-bar .link:hover .menu-item .icon{transform:scale(1.16) rotate(-8deg)}',
    'html.bxm-on.bxm-nav .home-page .navi-bar .menu-item .label{transition:transform .25s ease}',
    'html.bxm-on.bxm-nav .home-page .navi-bar .link:hover .menu-item .label{transform:translateY(-1px)}',
    'html.bxm-on.bxm-nav .home-page .navi-bar .link.router-link-active .menu-item{box-shadow:0 6px 18px rgba(0,0,0,.14),inset 0 0 0 1px rgba(255,255,255,.28)}',
    'html.bxm-on.bxm-nav .home-page .navi-bar .link.router-link-active .menu-item .icon{animation:bxm-nav-float calc(2.8s / var(--bxm-speed)) ease-in-out infinite}',

    /* ---------- 会话列表 ---------- */
    'html.bxm-on.bxm-list .chat-page .chat-item{transition:transform .3s cubic-bezier(.2,.8,.2,1),box-shadow .3s ease,background-color .2s ease}',
    'html.bxm-on.bxm-list .chat-page .chat-item:hover{transform:translate3d(3px,0,0);box-shadow:0 6px 18px rgba(70,130,190,.12)}',
    'html.bxm-on.bxm-list .chat-page .chat-item:active{transform:scale(.985)}',
    'html.bxm-on.bxm-list .chat-page .chat-item.bxm-in{animation:bxm-list-in calc(.42s / var(--bxm-speed)) cubic-bezier(.2,.8,.2,1) backwards}',
    'html.bxm-on.bxm-list .chat-page .chat-item.active::before{content:"";position:absolute;left:0;top:14px;bottom:14px;width:3px;border-radius:3px;background:linear-gradient(180deg,#52c5ff,#7f8cff);box-shadow:0 0 8px rgba(82,197,255,.55)}',

    /* ---------- 未读徽标 ---------- */
    'html.bxm-on.bxm-unread .chat-page .chat-item .unread-text,html.bxm-on.bxm-unread .home-page .navi-bar .menu-item .unread-text,html.bxm-on.bxm-unread .chat-unread{animation:bxm-badge calc(2s / var(--bxm-speed)) ease-in-out infinite;transform-origin:center}',
    'html.bxm-on.bxm-unread .chat-filter-bar .filter-count.emphasis{display:inline-block;transform-origin:center;animation:bxm-badge calc(2s / var(--bxm-speed)) ease-in-out infinite}',

    /* ---------- 头像 / 在线状态 ---------- */
    'html.bxm-on.bxm-avatar .head-image .avatar-image{transition:transform .35s cubic-bezier(.34,1.56,.64,1),box-shadow .35s ease}',
    'html.bxm-on.bxm-avatar .home-page .navi-bar .avatar:hover .head-image .avatar-image{transform:scale(1.12) rotate(4deg);box-shadow:0 0 0 3px rgba(255,255,255,.45),0 8px 18px rgba(0,0,0,.18)}',
    'html.bxm-on.bxm-avatar .chat-page .chat-item:hover .head-image .avatar-image{transform:scale(1.07);box-shadow:0 0 0 2px rgba(82,197,255,.45),0 4px 10px rgba(0,0,0,.12)}',
    'html.bxm-on.bxm-avatar .head-image .online{animation:bxm-online calc(2.4s / var(--bxm-speed)) ease-out infinite}',

    /* ---------- 按钮与交互反馈 ---------- */
    'html.bxm-on.bxm-ui .chat-page .header .add-btn{transition:transform .38s cubic-bezier(.34,1.56,.64,1),background-color .25s ease,color .25s ease}',
    'html.bxm-on.bxm-ui .chat-page .header .add-btn:hover{transform:rotate(90deg) scale(1.06)}',
    'html.bxm-on.bxm-ui .chat-page .el-button,html.bxm-on.bxm-ui .chat-page .tool-btn,html.bxm-on.bxm-ui .chat-page .bottom-btn,html.bxm-on.bxm-ui .chat-page .text-btn{transition:transform .2s ease,box-shadow .2s ease,opacity .2s ease}',
    'html.bxm-on.bxm-ui .chat-page .el-button:active,html.bxm-on.bxm-ui .chat-page .tool-btn:active,html.bxm-on.bxm-ui .chat-page .bottom-btn:active{transform:scale(.95)}',
    'html.bxm-on.bxm-ui .home-page .navi-bar .bottom-item{transition:transform .3s cubic-bezier(.34,1.56,.64,1),color .2s ease,background-color .2s ease}',
    'html.bxm-on.bxm-ui .home-page .navi-bar .bottom-item:hover{transform:scale(1.15)}',
    'html.bxm-on.bxm-ui .chat-filter-bar .filter-item::after{content:"";position:absolute;left:0;right:0;bottom:0;height:2px;border-radius:2px;background:linear-gradient(90deg,var(--im-color-primary,#52c5ff),rgba(82,197,255,0));transform:scaleX(0);transform-origin:left center;transition:transform .3s cubic-bezier(.2,.8,.2,1)}',
    'html.bxm-on.bxm-ui .chat-filter-bar .filter-item:hover::after{transform:scaleX(.55)}',
    'html.bxm-on.bxm-ui .chat-filter-bar .filter-item.active::after{transform:scaleX(1)}',

    /* ---------- 新消息闪动 ---------- */
    'html.bxm-on.bxm-flash-on .chat-page .chat-item.bxm-flash{animation:bxm-flash calc(1.2s / var(--bxm-speed)) ease-out}',

    /* ---------- 消息气泡 ---------- */
    'html.bxm-on.bxm-bubble .chat-box .chat-message-item.bxm-msg-in{animation:bxm-msg-in-left calc(.42s / var(--bxm-speed)) cubic-bezier(.2,.9,.25,1.15) backwards}',
    'html.bxm-on.bxm-bubble .chat-box .chat-message-item.bxm-msg-in:has(.message-normal.message-mine){animation-name:bxm-msg-in-right}',
    'html.bxm-on.bxm-bubble .chat-box .chat-message-item .message-normal .content .bottom .message-text{transition:box-shadow .28s ease,transform .28s ease}',
    'html.bxm-on.bxm-bubble .chat-box .chat-message-item:hover .message-normal .content .bottom .message-text{box-shadow:0 6px 18px rgba(60,120,190,.16);transform:translateY(-1px)}',
    'html.bxm-on.bxm-bubble .chat-box .chat-message-item .avatar .head-image .avatar-image{transition:transform .3s cubic-bezier(.34,1.56,.64,1)}',
    'html.bxm-on.bxm-bubble .chat-box .chat-message-item:hover .avatar .head-image .avatar-image{transform:scale(1.08)}',

    /* ---------- 路由过渡 ---------- */
    'html.bxm-on.bxm-route.bxm-routing .content-box{animation:bxm-route-in calc(.4s / var(--bxm-speed)) cubic-bezier(.2,.8,.2,1)}',

    /* ---------- 聊天背景流光 ---------- */
    'html.bxm-on.bxm-bg .chat-box .im-chat-main{position:relative}',
    'html.bxm-on.bxm-bg .chat-box .im-chat-main::after{content:"";position:absolute;inset:0;z-index:0;pointer-events:none;background:linear-gradient(115deg,rgba(82,197,255,0) 0%,rgba(82,197,255,.1) 30%,rgba(147,112,255,.09) 55%,rgba(82,197,255,0) 85%);background-size:220% 220%;animation:bxm-bg-drift calc(16s / var(--bxm-speed)) linear infinite}',
    'html.bxm-on.bxm-bg .chat-box .im-chat-main .im-chat-scroll{position:relative;z-index:1}',

    /* ---------- 设置页入口 ---------- */
    'html .setting-page .nav-menu .nav-item.__bxm_settings_item .el-icon{display:flex;align-items:center;justify-content:center}',
    'html .setting-page .nav-menu .nav-item.__bxm_settings_item .el-icon svg{width:1em;height:1em;display:block}',

    /* ---------- 设置页：动画设置 ---------- */
    '#bxm-settings-pane{background:#fff}',
    '#bxm-settings-pane *{box-sizing:border-box}',
    '#bxm-settings-pane .bxm-s-wrap{max-width:760px;margin:0 auto;padding:24px 40px 60px;color:#3b4a5a;font:14px/1.6 -apple-system,"Segoe UI","Microsoft YaHei",sans-serif;text-align:left}',
    '#bxm-settings-pane .bxm-s-desc{margin:0 0 18px;color:#8b9aa9;font-size:13px}',
    '#bxm-settings-pane .bxm-s-card{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:14px 18px;border:1px solid #e3f2fd;border-radius:12px;background:linear-gradient(135deg,#f2fbff,#f9f7ff)}',
    '#bxm-settings-pane .bxm-s-card-t{font-size:14px;font-weight:600;color:#28455f}',
    '#bxm-settings-pane .bxm-s-card-s{margin-top:2px;font-size:12px;color:#92a4b5}',
    '#bxm-settings-pane .bxm-s-block{margin-top:18px;padding:14px 18px;border:1px solid #eef4f9;border-radius:12px}',
    '#bxm-settings-pane .bxm-s-block-head{display:flex;align-items:center;justify-content:space-between;font-size:13px;color:#5d7186}',
    '#bxm-settings-pane .bxm-s-block-head b{font-size:13px;color:#3aa6e0}',
    '#bxm-settings-pane input[type=range]{-webkit-appearance:none;appearance:none;display:block;width:100%;height:4px;margin:12px 0 2px;border-radius:3px;background:linear-gradient(90deg,#52c5ff,#8a7bff);outline:none;cursor:pointer}',
    '#bxm-settings-pane input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:14px;border-radius:50%;background:#fff;border:3px solid #52c5ff;box-shadow:0 1px 4px rgba(0,0,0,.18);cursor:pointer}',
    '#bxm-settings-pane .bxm-s-group-title{margin:22px 0 2px;font-size:12px;letter-spacing:.8px;color:#9aa9b8}',
    '#bxm-settings-pane .bxm-s-row{position:relative;display:flex;align-items:center;justify-content:space-between;gap:16px;margin:0 -10px;padding:11px 10px;border-bottom:1px solid #f1f5f9;border-radius:8px;cursor:pointer;transition:background .15s ease}',
    '#bxm-settings-pane .bxm-s-row:hover{background:#f8fcff}',
    '#bxm-settings-pane .bxm-s-row>span{font-size:13.5px;color:#41536a}',
    '#bxm-settings-pane .bxm-s-row input{position:absolute;width:0;height:0;opacity:0;pointer-events:none}',
    '#bxm-settings-pane .bxm-s-row-plain{margin:0;padding:0;border:none;border-radius:0;background:none}',
    '#bxm-settings-pane .bxm-s-row-plain:hover{background:none}',
    '#bxm-settings-pane .bxm-s-sw{position:relative;flex:0 0 auto;width:38px;height:22px;border-radius:11px;background:#dfe6ee;transition:background .2s ease}',
    '#bxm-settings-pane .bxm-s-sw::after{content:"";position:absolute;left:2px;top:2px;width:18px;height:18px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.2);transition:transform .22s cubic-bezier(.2,.8,.2,1)}',
    '#bxm-settings-pane input:checked+.bxm-s-sw{background:linear-gradient(135deg,#52c5ff,#7f8cff)}',
    '#bxm-settings-pane input:checked+.bxm-s-sw::after{transform:translateX(16px)}',
    '#bxm-settings-pane input:focus-visible+.bxm-s-sw{box-shadow:0 0 0 3px rgba(82,197,255,.35)}',
    '#bxm-settings-pane .bxm-s-body{transition:opacity .2s ease}',
    '#bxm-settings-pane.bxm-off .bxm-s-body{opacity:.45;pointer-events:none}',
    '#bxm-settings-pane .bxm-s-foot{display:flex;align-items:center;gap:10px;margin-top:26px;padding-top:18px;border-top:1px solid #eef4f9}',
    '#bxm-settings-pane .bxm-s-btn{padding:8px 20px;border:1px solid #d9e8f5;border-radius:6px;background:#fff;color:#3d8fd0;font-size:13px;cursor:pointer;transition:background .18s ease,border-color .18s ease,transform .18s ease}',
    '#bxm-settings-pane .bxm-s-btn:hover{background:#f2fbff;border-color:#b7e2ff}',
    '#bxm-settings-pane .bxm-s-btn:active{transform:scale(.97)}',
    '#bxm-settings-pane .bxm-s-btn.primary{border-color:#52c5ff;background:#52c5ff;color:#fff}',
    '#bxm-settings-pane .bxm-s-btn.primary:hover{filter:brightness(1.05);background:#52c5ff}',
    '#bxm-settings-pane .bxm-s-hint{margin-left:auto;font-size:12px;color:#a8b7c6}'
  ].join('\n');

  function injectStyle() {
    if (document.getElementById('bxm-style')) return;
    var st = document.createElement('style');
    st.id = 'bxm-style';
    st.textContent = CSS;
    (document.head || document.documentElement).appendChild(st);
  }

  // ==================================================================
  // 应用 / 保存设置
  // ==================================================================
  function applySettings() {
    var de = document.documentElement;
    de.style.setProperty('--bxm-speed', String(clampSpeed(S.speed)));
    for (var k in CLASS_MAP) {
      if (S.enabled && S[k]) de.classList.add(CLASS_MAP[k]);
      else de.classList.remove(CLASS_MAP[k]);
    }
  }

  function saveAndApply(replayIfEnabled) {
    saveSettings();
    applySettings();
    syncPanel();
    if (replayIfEnabled) replayAll();
  }

  // ==================================================================
  // 设置面板
  // ==================================================================
  var ICON_SPARK =
    '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">' +
    '<path fill="currentColor" d="M12 2.6l1.86 4.9 4.9 1.86-4.9 1.86L12 16.12l-1.86-4.9-4.9-1.86 4.9-1.86L12 2.6z"/>' +
    '<path fill="currentColor" d="M19.2 13.7l.94 2.46 2.46.94-2.46.94-.94 2.46-.94-2.46-2.46-.94 2.46-.94.94-2.46z"/>' +
    '<path fill="currentColor" d="M5.2 15.4l.72 1.88 1.88.72-1.88.72-.72 1.88-.72-1.88-1.88-.72 1.88-.72.72-1.88z"/>' +
    '</svg>';

  var GROUPS = [
    {
      title: '界面',
      rows: [
        { k: 'nav', label: '侧边导航动效' },
        { k: 'ui', label: '按钮与悬停反馈' },
        { k: 'route', label: '页面切换过渡' }
      ]
    },
    {
      title: '会话列表',
      rows: [
        { k: 'list', label: '会话列表入场' },
        { k: 'flash', label: '新消息闪动提示' },
        { k: 'unread', label: '未读徽标呼吸' },
        { k: 'avatar', label: '头像与在线光晕' }
      ]
    },
    {
      title: '消息区域',
      rows: [
        { k: 'bubble', label: '消息气泡入场' },
        { k: 'bg', label: '聊天背景流光' }
      ]
    }
  ];

  var paneEl = null;
  var paneOpen = false;

  function rowHtml(k, label) {
    return '<label class="bxm-s-row"><span>' + label + '</span>' +
      '<input type="checkbox" data-k="' + k + '"><i class="bxm-s-sw"></i></label>';
  }

  function loadDefaults() {
    var s = {};
    for (var k in DEFAULTS) s[k] = DEFAULTS[k];
    return s;
  }

  function paneMarkup() {
    var body = '';
    for (var i = 0; i < GROUPS.length; i++) {
      var g = GROUPS[i];
      body += '<div class="bxm-s-group-title">' + g.title + '</div>';
      for (var j = 0; j < g.rows.length; j++) body += rowHtml(g.rows[j].k, g.rows[j].label);
    }

    return '<div class="bxm-s-wrap">' +
      '<p class="bxm-s-desc">为盒子IM 的界面添加动效。设置保存在本机，切换页面后依然生效。</p>' +
      '<div class="bxm-s-card">' +
        '<div><div class="bxm-s-card-t">启用动画</div>' +
        '<div class="bxm-s-card-s">关闭后恢复原始界面</div></div>' +
        '<label class="bxm-s-row bxm-s-row-plain">' +
          '<input type="checkbox" data-k="enabled"><i class="bxm-s-sw"></i></label>' +
      '</div>' +
      '<div class="bxm-s-body">' +
        '<div class="bxm-s-block">' +
          '<div class="bxm-s-block-head"><span>动画速度</span>' +
          '<b id="bxm-s-speed-val">1.0×</b></div>' +
          '<input id="bxm-s-speed" type="range" min="0.6" max="2" step="0.1" value="1">' +
        '</div>' +
        body +
      '</div>' +
      '<div class="bxm-s-foot">' +
        '<button class="bxm-s-btn primary" type="button" id="bxm-s-replay">重播动画</button>' +
        '<button class="bxm-s-btn" type="button" id="bxm-s-reset">恢复默认</button>' +
        '<span class="bxm-s-hint">设置自动保存在本机</span>' +
      '</div>' +
    '</div>';
  }

  function bindPane(pane) {
    pane.addEventListener('change', function (e) {
      var t = e.target;
      if (!t || !t.getAttribute) return;
      var k = t.getAttribute('data-k');
      if (!k) return;
      S[k] = !!t.checked;
      saveAndApply(false);
    });

    pane.addEventListener('input', function (e) {
      if (!e.target || e.target.id !== 'bxm-s-speed') return;
      S.speed = clampSpeed(e.target.value);
      saveSettings();
      applySettings();
      var v = pane.querySelector('#bxm-s-speed-val');
      if (v) v.textContent = S.speed.toFixed(1) + '×';
    });

    pane.querySelector('#bxm-s-replay').addEventListener('click', replayAll);
    pane.querySelector('#bxm-s-reset').addEventListener('click', function () {
      S = loadDefaults();
      saveAndApply(true);
    });
  }

  function syncPanel() {
    if (!paneEl) return;
    var inputs = paneEl.querySelectorAll('input[data-k]');
    for (var i = 0; i < inputs.length; i++) {
      inputs[i].checked = !!S[inputs[i].getAttribute('data-k')];
    }
    var r = paneEl.querySelector('#bxm-s-speed');
    if (r) r.value = clampSpeed(S.speed);
    var v = paneEl.querySelector('#bxm-s-speed-val');
    if (v) v.textContent = clampSpeed(S.speed).toFixed(1) + '×';
    paneEl.classList.toggle('bxm-off', !S.enabled);
  }

  // ==================================================================
  // 设置页：动画设置标签
  // ==================================================================
  function onSettingsRoute() {
    return (location.hash || '').indexOf('/home/setting') >= 0;
  }

  function settingRoot() {
    if (!onSettingsRoute()) return null;
    var page = document.querySelector('.setting-page');
    if (!page) return null;
    var main = page.querySelector('.setting-main');
    if (!main) return null;
    var head = main.querySelector('.content-header');
    var body = main.querySelector('.content-body');
    if (!head || !body) return null;
    return { page: page, main: main, head: head, body: body };
  }

  function copyScope(from, to) {
    if (!from || !to) return;
    for (var i = 0; i < from.attributes.length; i++) {
      var a = from.attributes[i];
      if (a.name.indexOf('data-v-') === 0) to.setAttribute(a.name, a.value);
    }
  }

  function ensurePane(root) {
    var pane = document.getElementById('bxm-settings-pane');
    if (pane && pane.parentNode === root.main) { paneEl = pane; return pane; }
    if (pane && pane.parentNode) pane.parentNode.removeChild(pane);

    pane = document.createElement('div');
    pane.id = 'bxm-settings-pane';
    copyScope(root.body.querySelector('.tab-content'), pane);
    pane.style.cssText = 'display:none;flex:1 1 auto;min-height:0;overflow:auto;';
    pane.innerHTML = paneMarkup();
    bindPane(pane);
    root.main.appendChild(pane);

    paneEl = pane;
    syncPanel();
    return pane;
  }

  function applyPageState() {
    var root = settingRoot();
    if (!root) return;
    var pane = ensurePane(root);

    var title = root.head.querySelector('.header-title');
    var menu = root.page.querySelector('.nav-menu');
    var self = menu ? menu.querySelector('.__bxm_settings_item') : null;

    if (paneOpen) {
      pane.style.display = 'block';
      root.body.style.display = 'none';
      if (title) {
        if (!title.dataset.bxmOrigTitle) title.dataset.bxmOrigTitle = title.textContent;
        if (title.textContent !== '动画设置') title.textContent = '动画设置';
      }
      if (menu) {
        var acts = menu.querySelectorAll('.nav-item.active');
        for (var i = 0; i < acts.length; i++) acts[i].classList.remove('active');
      }
      if (self) self.classList.add('active');
    } else {
      pane.style.display = 'none';
      root.body.style.display = '';
      if (title && title.dataset.bxmOrigTitle) {
        title.textContent = title.dataset.bxmOrigTitle;
        delete title.dataset.bxmOrigTitle;
      }
      if (self) self.classList.remove('active');
    }
  }

  function showPane() {
    if (!settingRoot()) return;
    paneOpen = true;
    applyPageState();
    syncPanel();
  }

  function hidePane() {
    if (!paneOpen) return;
    paneOpen = false;
    applyPageState();
  }

  function installMenu() {
    var root = settingRoot();
    if (!root) return false;

    var menu = root.page.querySelector('.nav-menu');
    if (!menu) return false;
    if (!menu.querySelector('.nav-item')) return false;   // 菜单还没渲染

    var self = menu.querySelector('.__bxm_settings_item');
    if (!self) {
      var tpl = menu.querySelector('.nav-item');
      self = document.createElement('div');
      self.className = 'nav-item __bxm_settings_item';
      self.title = '动画设置';
      copyScope(tpl, self);
      self.innerHTML = '<i class="el-icon"></i><span></span>';

      var icon = self.querySelector('.el-icon');
      copyScope(tpl.querySelector('.el-icon'), icon);
      icon.innerHTML = ICON_SPARK;

      var label = self.querySelector('span');
      copyScope(tpl.querySelector('span'), label);
      label.textContent = '动画设置';

      self.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        showPane();
      });
      menu.appendChild(self);
    }

    // 点击站点自己的菜单项 → 收起动画设置（capture 先于 Vue 处理）
    if (!menu.__bxmSettingsBound) {
      menu.__bxmSettingsBound = true;
      menu.addEventListener('click', function (e) {
        var t = e.target;
        while (t && t !== menu) {
          if (t.classList && t.classList.contains('nav-item')) {
            if (!t.classList.contains('__bxm_settings_item')) hidePane();
            break;
          }
          t = t.parentNode;
        }
      }, true);
    }

    var prev = document.getElementById('bxm-settings-pane');
    if (!prev || prev.parentNode !== root.main) {
      paneOpen = false;
      paneEl = null;
    }
    applyPageState();
    return true;
  }

  var settingsRetryTimer = 0;

  function ensureSettingsPage(retry) {
    var ok = installMenu();
    if (ok || !retry || !onSettingsRoute()) return;
    clearInterval(settingsRetryTimer);
    var n = 0;
    settingsRetryTimer = setInterval(function () {
      if (installMenu() || ++n > 60) {
        clearInterval(settingsRetryTimer);
        settingsRetryTimer = 0;
      }
    }, 250);
  }

  // ==================================================================
  // 列表 / 消息入场动画
  // ==================================================================
  var seen = new WeakSet();

  function playItems(nodes, cls, force) {
    var list = Array.prototype.slice.call(nodes, 0, 40);
    var i = 0;
    for (var n = 0; n < list.length; n++) {
      var el = list[n];
      if (!el || !el.classList) continue;
      if (!force && seen.has(el)) continue;
      seen.add(el);

      var delay = Math.min(i++, 14) * 38;
      clearTimeout(el.__bxmTimer);
      el.classList.remove(cls);
      el.style.animation = 'none';
      void el.offsetWidth;
      el.style.animation = '';
      el.style.animationDelay = (delay / clampSpeed(S.speed)) + 'ms';
      el.classList.add(cls);

      (function (node, d) {
        node.__bxmTimer = setTimeout(function () {
          node.classList.remove(cls);
          node.style.animationDelay = '';
        }, (520 + d) / clampSpeed(S.speed) + 90);
      })(el, delay);
    }
  }

  function flashItems(items) {
    if (!S.enabled || !S.flash) return;
    var now = Date.now();
    if (now < flashReadyAt) return;
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      if (!item) continue;
      if (item.__bxmFlashAt && now - item.__bxmFlashAt < 2500) continue;
      item.__bxmFlashAt = now;

      item.classList.remove('bxm-flash');
      void item.offsetWidth;
      item.classList.add('bxm-flash');
      (function (el) {
        clearTimeout(el.__bxmFlashTimer);
        el.__bxmFlashTimer = setTimeout(function () {
          el.classList.remove('bxm-flash');
        }, 1400 / clampSpeed(S.speed) + 80);
      })(item);
    }
  }

  function replayAll() {
    if (!S.enabled) return;
    playItems(document.querySelectorAll('.chat-page .chat-item'), 'bxm-in', true);
    playItems(document.querySelectorAll('.chat-box .chat-message-item'), 'bxm-msg-in', true);

    var links = document.querySelectorAll('.navi-bar .menu .link');
    for (var i = 0; i < links.length; i++) {
      links[i].style.animation = 'none';
      void links[i].offsetWidth;
      links[i].style.animation = '';
    }
  }

  // ==================================================================
  // 观察 DOM
  // ==================================================================
  var pendingList = [];
  var pendingMsg = [];
  var flushScheduled = false;
  var ensureScheduled = false;

  function scheduleEnsure() {
    if (ensureScheduled) return;
    ensureScheduled = true;
    requestAnimationFrame(function () {
      ensureScheduled = false;
      ensureUnreadWatcher();
      if (onSettingsRoute()) ensureSettingsPage(false);
    });
  }

  function queueNodes(list, msgs) {
    if (list.length) pendingList = pendingList.concat(list);
    if (msgs.length) pendingMsg = pendingMsg.concat(msgs);
    if (flushScheduled) return;
    flushScheduled = true;
    requestAnimationFrame(flushNodes);
  }

  function flushNodes() {
    flushScheduled = false;
    var l = pendingList;
    var m = pendingMsg;
    pendingList = [];
    pendingMsg = [];

    if (!S.enabled) return;
    if (l.length && S.list) playItems(l, 'bxm-in', false);
    if (m.length && S.bubble) playItems(m, 'bxm-msg-in', false);
  }

  function collect(nodes, sel, out) {
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      if (!n || n.nodeType !== 1) continue;
      if (n.matches && n.matches(sel)) out.push(n);
      if (n.querySelectorAll) {
        var inner = n.querySelectorAll(sel);
        for (var j = 0; j < inner.length; j++) out.push(inner[j]);
      }
    }
  }

  function startObserver() {
    var mo = new MutationObserver(function (muts) {
      var list = [];
      var msgs = [];
      for (var i = 0; i < muts.length; i++) {
        var add = muts[i].addedNodes;
        if (!add || !add.length) continue;
        collect(add, '.chat-item', list);
        collect(add, '.chat-message-item', msgs);
      }
      if (list.length || msgs.length) queueNodes(list, msgs);
      scheduleEnsure();
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });
  }

  var unreadBox = null;
  var unreadSettleAt = 0;

  function ensureUnreadWatcher() {
    var box = document.querySelector('.chat-page .scroll-box');
    if (!box || box === unreadBox) return;
    unreadBox = box;
    unreadSettleAt = Date.now() + 1500;
    if (box.__bxmUnreadObserver) return;
    box.__bxmUnreadObserver = true;

    var mo = new MutationObserver(function (muts) {
      if (!S.enabled || !S.flash) return;
      if (Date.now() < unreadSettleAt) return;

      var items = [];
      for (var i = 0; i < muts.length; i++) {
        var t = muts[i].target;
        var el = t && t.nodeType === 3 ? t.parentElement : t;
        if (!el || !el.closest) continue;
        var badge = el.closest('.unread-text');
        if (!badge) continue;
        var item = badge.closest('.chat-item');
        if (!item) continue;
        var txt = (badge.textContent || '').trim();
        if (badge.style.display === 'none' || !txt || txt === '0') continue;
        items.push(item);
      }
      if (items.length) flashItems(items);
    });
    mo.observe(box, {
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class'],
      characterData: true
    });
  }

  // ==================================================================
  // 路由切换过渡
  // ==================================================================
  var routeTimer = 0;

  function onRouteChange() {
    if (!onSettingsRoute()) paneOpen = false;
    if (!S.enabled || !S.route) return;
    var de = document.documentElement;
    de.classList.remove('bxm-routing');
    void de.offsetWidth;
    de.classList.add('bxm-routing');
    clearTimeout(routeTimer);
    routeTimer = setTimeout(function () {
      de.classList.remove('bxm-routing');
    }, 520 / clampSpeed(S.speed) + 80);
  }

  // ==================================================================
  // 启动
  // ==================================================================
  function bindStorage() {
    window.addEventListener('storage', function (e) {
      if (e.key !== KEY) return;
      S = loadSettings();
      applySettings();
      syncPanel();
    });
  }

  function boot() {
    injectStyle();
    applySettings();
    bindStorage();
    startObserver();
    ensureSettingsPage(true);
    ensureUnreadWatcher();

    function onRoute() {
      onRouteChange();
      ensureSettingsPage(true);
    }
    window.addEventListener('hashchange', onRoute);
    window.addEventListener('popstate', onRoute);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  function openSettings() {
    if (onSettingsRoute()) { showPane(); return; }
    paneOpen = true;
    location.hash = '#/home/setting';
  }

  // 便于调试：window.__boximMoreAnimAPI.open() / .replay()
  window.__boximMoreAnimAPI = {
    open: openSettings,
    close: hidePane,
    replay: replayAll,
    get settings() { return S; },
    apply: applySettings
  };
})();
