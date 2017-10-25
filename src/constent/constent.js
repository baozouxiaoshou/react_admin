/* eslint-disable no-underscore-dangle */
/**
 * 导出常量
 */
import _isEmpty from 'lodash/isEmpty'
import _isUndefined from 'lodash/isUndefined'
import _assign from 'lodash/assign'

/**
 window.___INITIAL_ENV__.version = '1.0.0';
 window.___INITIAL_ENV__.host = '${ctx}'; // 项目根路径
 window.___INITIAL_ENV__.routerRoot = '${ctxpath}/dist'; // web路由根路径
 window.___INITIAL_ENV__.logoutUrl = // 退出地址
 window.___INITIAL_ENV__.apiHost = '${ctx}api/secure/v1/chat';
 window.___INITIAL_ENV__.userId = '9999';
 window.___INITIAL_ENV__.userName = '系统用户';
 window.___INITIAL_ENV__.socketHost = '${ctxpath}ws/&inquiryId=ps';
 window.___INITIAL_ENV__.refrashTime = 120;//刷新时间2分钟
 */

/* global window */
const env = _assign(window.___INITIAL_ENV__, {
        // 用来存放state,先前在各个功能块中写法getApp()._store.getState()会造成无法匹配路由的bug
        appStore: null,
        dispatch: null
      }),
      /*  if (env && env.routerRoot !== '/' && _startsWith(env.routerRoot, '/')) {
       env.routerRoot = env.routerRoot.substring(1)
       }*/
      // 初始化默认的session(用户信息)和menus(菜单)值
      initData = window.___INITIAL_INIT__,
      session = _isEmpty(initData.session) ? {} : initData.session,
      menus = _isEmpty(initData.menus) ? [] : initData.menus,
      token = _isUndefined(window.___INITIAL_INIT__.token) ? '' : window.___INITIAL_INIT__.token,
      init = {
        session: session,
        menus: menus
      },
      // 页面的最小宽度 (需要和theme中的@coreLayout_minWidth大小一致)
      minWidth = 900,
      // 初始化导航条的宽度
      initNavWidth = 205,
      // 初始化项目header的高度
      initHeaderHeight = 48,
      // contentlayout外边距
      contentLayOutMargin = 0,
      // 单条参数区的高度
      rowHeight = 42,
      // 分页条高度
      paginationHeight = 40,
      // 用户信息
      personInfoHeight = 90,
      // 版权区域
      copyRightHeight = 28,
      // 工具栏高度
      tabOperationHeight = 44,
      // tab标签的高度
      tabsHeight = 30,
      // 通用字典editor距离iframe上方高度
      dictEditorTop = 40

module.exports = {
  // 环境变量
  environments: env,
  // 初始值
  initData: init,
  token,
  initNavWidth,
  initHeaderHeight,
  contentLayOutMargin,
  rowHeight,
  paginationHeight,
  minWidth,
  personInfoHeight,
  copyRightHeight,
  tabOperationHeight,
  tabsHeight,
  dictEditorTop
}

