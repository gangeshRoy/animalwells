; (function (define) { define(['jquery'], function ($) { return (function () { var $container; var listener; var toastId = 0; var toastType = { error: 'error', info: 'info', success: 'success', warning: 'warning' }; var toastr = { clear: clear, remove: remove, error: error, getContainer: getContainer, info: info, options: {}, subscribe: subscribe, success: success, version: '2.1.1', warning: warning }; var previousToast; return toastr; function error(message, title, optionsOverride) { return notify({ type: toastType.error, iconClass: getOptions().iconClasses.error, message: message, optionsOverride: optionsOverride, title: title }); } function getContainer(options, create) { if (!options) { options = getOptions(); } $container = $('#' + options.containerId); if ($container.length) { return $container; } if (create) { $container = createContainer(options); } return $container; } function info(message, title, optionsOverride) { return notify({ type: toastType.info, iconClass: getOptions().iconClasses.info, message: message, optionsOverride: optionsOverride, title: title }); } function subscribe(callback) { listener = callback; } function success(message, title, optionsOverride) { return notify({ type: toastType.success, iconClass: getOptions().iconClasses.success, message: message, optionsOverride: optionsOverride, title: title }); } function warning(message, title, optionsOverride) { return notify({ type: toastType.warning, iconClass: getOptions().iconClasses.warning, message: message, optionsOverride: optionsOverride, title: title }); } function clear($toastElement, clearOptions) { var options = getOptions(); if (!$container) { getContainer(options); } if (!clearToast($toastElement, options, clearOptions)) { clearContainer(options); } } function remove($toastElement) { var options = getOptions(); if (!$container) { getContainer(options); } if ($toastElement && $(':focus', $toastElement).length === 0) { removeToast($toastElement); return; } if ($container.children().length) { $container.remove(); } } function clearContainer(options) { var toastsToClear = $container.children(); for (var i = toastsToClear.length - 1; i >= 0; i--) { clearToast($(toastsToClear[i]), options); } } function clearToast($toastElement, options, clearOptions) { var force = clearOptions && clearOptions.force ? clearOptions.force : false; if ($toastElement && (force || $(':focus', $toastElement).length === 0)) { $toastElement[options.hideMethod]({ duration: options.hideDuration, easing: options.hideEasing, complete: function () { removeToast($toastElement); } }); return true; } return false; } function createContainer(options) { $container = $('<div/>').attr('id', options.containerId).addClass(options.positionClass).attr('aria-live', 'polite').attr('role', '///alert'); $container.appendTo($(options.target)); return $container; } function getDefaults() { return { tapToDismiss: true, toastClass: 'toast', containerId: 'toast-container', debug: false, showMethod: 'fadeIn', showDuration: 300, showEasing: 'swing', onShown: undefined, hideMethod: 'fadeOut', hideDuration: 1000, hideEasing: 'swing', onHidden: undefined, extendedTimeOut: 1000, iconClasses: { error: 'toast-error', info: 'toast-info', success: 'toast-success', warning: 'toast-warning' }, iconClass: 'toast-info', positionClass: 'toast-top-right', timeOut: 5000, titleClass: 'toast-title', messageClass: 'toast-message', target: 'body', closeHtml: '<button type="button"></button>', newestOnTop: true, preventDuplicates: true, progressBar: true }; } function publish(args) { if (!listener) { return; } listener(args); } function notify(map) { var options = getOptions(); var iconClass = map.iconClass || options.iconClass; if (typeof (map.optionsOverride) !== 'undefined') { options = $.extend(options, map.optionsOverride); iconClass = map.optionsOverride.iconClass || iconClass; } if (shouldExit(options, map)) { return; } toastId++; $container = getContainer(options, true); var intervalId = null; var $toastElement = $('<div/>'); var $titleElement = $('<div/>'); var $messageElement = $('<div/>'); var $progressElement = $('<div/>'); var $closeElement = $(options.closeHtml); var progressBar = { intervalId: null, hideEta: null, maxHideTime: null }; var response = { toastId: toastId, state: 'visible', startTime: new Date(), options: options, map: map }; personalizeToast(); displayToast(); handleEvents(); publish(response); if (options.debug && console) { } return $toastElement; function personalizeToast() { setIcon(); setTitle(); setMessage(); setCloseButton(); setProgressBar(); setSequence(); } function handleEvents() { $toastElement.hover(stickAround, delayedHideToast); if (!options.onclick && options.tapToDismiss) { $toastElement.click(hideToast); } if (options.closeButton && $closeElement) { $closeElement.click(function (event) { if (event.stopPropagation) { event.stopPropagation(); } else if (event.cancelBubble !== undefined && event.cancelBubble !== true) { event.cancelBubble = true; } hideToast(true); }); } if (options.onclick) { $toastElement.click(function () { options.onclick(); hideToast(); }); } } function displayToast() { $toastElement.hide(); $toastElement[options.showMethod]({ duration: options.showDuration, easing: options.showEasing, complete: options.onShown }); if (options.timeOut > 0) { intervalId = setTimeout(hideToast, options.timeOut); progressBar.maxHideTime = parseFloat(options.timeOut); progressBar.hideEta = new Date().getTime() + progressBar.maxHideTime; if (options.progressBar) { progressBar.intervalId = setInterval(updateProgress, 10); } } } function setIcon() { if (map.iconClass) { $toastElement.addClass(options.toastClass).addClass(iconClass); } } function setSequence() { if (options.newestOnTop) { $container.prepend($toastElement); } else { $container.append($toastElement); } } function setTitle() { if (map.title) { $titleElement.append(map.title).addClass(options.titleClass); $toastElement.append($titleElement); } } function setMessage() { if (map.message) { $messageElement.append(map.message).addClass(options.messageClass); $toastElement.append($messageElement); } } function setCloseButton() { if (options.closeButton) { $closeElement.addClass('toast-close-button').attr('role', 'button'); $toastElement.prepend($closeElement); } } function setProgressBar() { if (options.progressBar) { $progressElement.addClass('toast-progress'); $toastElement.prepend($progressElement); } } function shouldExit(options, map) { if (options.preventDuplicates) { if (map.message === previousToast) { return true; } else { previousToast = map.message; } } return false; } function hideToast(override) { if ($(':focus', $toastElement).length && !override) { return; } clearTimeout(progressBar.intervalId); return $toastElement[options.hideMethod]({ duration: options.hideDuration, easing: options.hideEasing, complete: function () { removeToast($toastElement); if (options.onHidden && response.state !== 'hidden') { options.onHidden(); } response.state = 'hidden'; response.endTime = new Date(); publish(response); } }); } function delayedHideToast() { if (options.timeOut > 0 || options.extendedTimeOut > 0) { intervalId = setTimeout(hideToast, options.extendedTimeOut); progressBar.maxHideTime = parseFloat(options.extendedTimeOut); progressBar.hideEta = new Date().getTime() + progressBar.maxHideTime; } } function stickAround() { clearTimeout(intervalId); progressBar.hideEta = 0; $toastElement.stop(true, true)[options.showMethod]({ duration: options.showDuration, easing: options.showEasing }); } function updateProgress() { var percentage = ((progressBar.hideEta - (new Date().getTime())) / progressBar.maxHideTime) * 100; $progressElement.width(percentage + '%'); } } function getOptions() { return $.extend({}, getDefaults(), toastr.options); } function removeToast($toastElement) { if (!$container) { $container = getContainer(); } if ($toastElement.is(':visible')) { return; } $toastElement.remove(); $toastElement = null; if ($container.children().length === 0) { $container.remove(); previousToast = undefined; } } })(); }); }(typeof define === 'function' && define.amd ? define : function (deps, factory) { if (typeof module !== 'undefined' && module.exports) { module.exports = factory(require('jquery')); } else { window['toastr'] = factory(window['jQuery']); } }));

var win;
var inedit = 0;
var mobApp = false;
var check = 0;
var common = new Common();
var isLoginUser = (commonPre.readFromStorage('animalwells') && commonPre.readFromStorage('key')) ? 1 : 0;
function Common() {
  var _this = this;
  var input_selector =
    'input[type=text], input[type=password], input[type=email], input[type=url], input[type=tel], input[type=number], input[type=search], textarea, input[type=radio]';

  var $toastlast = '';
  (this.msg = function (t, e) {
    if ($toastlast !== '') toastr.clear();
    if (t == 0) t = 'danger';
    if (t == 2) t = 'info';
    if (t == 1) t = 'success';
    if (t == 3) t = 'warning';
    $('danger' === t ? function () {toastr.error(e);}  : 'info' === t ? function () { toastr.info(e); } : 'success' === t ? function () { toastr.success(e); } : 'warning' === t ? function () { toastr.warning(e); }: function () { } );
    $toastlast = toastr;
  }), (toastr.options = {
    closeButton: false,
    debug: false,
    newestOnTop: true,
    progressBar: true,
    positionClass: 'toast-top-right',
    preventDuplicates: true,
    onclick: null,
    showDuration: '300',
    hideDuration: '1000',
    timeOut: '5000',
    extendedTimeOut: '1000',
    showEasing: 'swing',
    hideEasing: 'linear',
    showMethod: 'fadeIn',
    hideMethod: 'fadeOut',
  }), (this.decodeMsg = function (t) {
    return decodeURIComponent(t.replace(/\+/g, ' '));
  }), (this.encodeMsg = function (t) {
    return encodeURIComponent(t);
  }), (this.uid = function () {
    var t = webstore.get('uid');
    return t;
  }), (this.appendDiv = function (t, e, n) {
    if ('' != n) {
      var o = document.getElementById(t);
      o.innerHTML = e ? n : o.innerHTML + n;
    }
  }), (this.replaceURLWithHTMLLinks = function (t) {
    var e = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
    return t.replace(e, "<a href='$1' target='_blank'>$1</a>");
  }), (this.getParameterByName = function (t) {
    t = t.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var e = new RegExp('[\\?&]' + t + '=([^&#]*)'),
      n = e.exec(location.search);
    return null == n ? '' : decodeURIComponent(n[1].replace(/\+/g, ' '));
  }), (this.redirect = function (t) {
    window.location = t;
  }), (this.capitaliseFirstLetter = function (t) {
    var e = t.value;
    '' != e && (t.value = e.charAt(0).toUpperCase() + e.slice(1));
  }), (this.capitalize = function (t) {
    var e = t.value.toLowerCase();
    '' != e &&
      (t.value = e.replace(/\w\S*/g, function (t) {
        return t.charAt(0).toUpperCase() + t.substr(1).toLowerCase();
      }));
  }), (this.castLowerCase = function (t) {
    document.getElementById(t).value = document
      .getElementById(t)
      .value.toLowerCase();
  });

  this.validateEmail = function (email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };

  this.validateCharacter = function (char) {
    var re = /^([a-zA-Z])$/;
    return re.test(char);
  };

 
  this.validateMobile = function (mobno) {
    var mobExp = /^[7,8,9]{1}[0-9]{9}$/;
    if (mobno.length == 11) mobExp = /^[0,7,8,9]{1}[0-9]{10}$/;
    var flag = true;
    if (mobno === '' || mobno === null || mobno === undefined) 
      flag = false;
    else if (mobExp.test(mobno) === false) 
      flag = false;
    return flag;
  };


  this.isNumberKey = function (evt) {
    var charCode = evt.which ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) 
      return false;
     else if (charCode == 13) 
      return false;
    return true;
  };



  this.getParameterByName = function (name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  };

  this.generateId = function () {
    var dTime = new Date().getTime();
    var genaratedId;
    var rNum = Math.floor(Math.random() * (9 - 1)) + 1;
    genaratedId = '' + dTime + '' + rNum;
    return genaratedId;
  };

  this.isOnline = function () {
    var online = navigator.onLine;
    $(window).on('offline', function () {online = false;}, false );

    $(window).on('online',function () { online = true;},false);
    return online;
  };


  this.getMsg = function (id) {
    var msgArray = [ 
     [0, 'Please enter bag number'],
      [1, 'Please enter pat type'],
      [2, 'Please enter flight number'],
      [3, 'Please enter station']
    ]
    var myMap = new Map(msgArray);
    return myMap.get(id);
  };

  this.storageClear = function () {
    _this.deleteAllCookies();
    localStorage.clear();
  };

  this.addToStorage = function (id, val) {
    localStorage.setItem(id, val);
  };

  this.readFromStorage = function (id) {
    if(id=='key'){
      var isInUrl = location.href.indexOf('?userid=');
      if(isInUrl!=-1){
        var isInUrl = location.href.split('?userid=')
        return isInUrl[1];
      }else{
        return localStorage.getItem(id);
      }
    }
    else
      return localStorage.getItem(id);
    
    
  };

  this.nFormatter = function (num, digits) {
    var si = [
      { value: 1, symbol: "" },
      { value: 1E3, symbol: "k" },
      { value: 1E6, symbol: "M" },
      { value: 1E9, symbol: "G" },
      { value: 1E12, symbol: "T" },
      { value: 1E15, symbol: "P" },
      { value: 1E18, symbol: "E" }
    ];
    var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var i;
    for (i = si.length - 1; i > 0; i--) {
      if (num >= si[i].value) {
        break;
      }
    }
    return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
  }

  this.deleteAllCookies = function () {
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
      if (cookies[i] != undefined)
        _this.deleteCookie(cookies[i].split('=')[0]);
    }
  };

  this.setCookie = function (name, value, expirydays) {
    var d = new Date();
    d.setTime(d.getTime() + expirydays * 24 * 60 * 60 * 1000);
    var expires = 'expires=' + d.toUTCString();
    document.cookie = name + '=' + value + ';' + expires + ';path=/;';
  };

  this.deleteCookie = function (name) {
    _this.setCookie(name, 'NULL', -1);
  };

  this.getCookie = function (cn) {
    if (document.cookie.length > 0) {
      var c_start = document.cookie.indexOf(cn + '=');
      if (c_start != -1) {
        c_start = c_start + cn.length + 1;
        var c_end = document.cookie.indexOf(';', c_start);
        if (c_end == -1) c_end = document.cookie.length;
        var cvalue = _this.cookie_unescape(
          document.cookie.substring(c_start, c_end)
        );
        return unescape(cvalue);
      }
    }
    return '';
  };

  this.cookie_unescape = function (str) {
    str = '' + str;
    while (true) {
      var i = str.indexOf('+');
      if (i < 0) break;
      str = str.substring(0, i) + '%20' + str.substring(i + 1, str.length);
    }
    return unescape(str);
  };

  this.removeFromStorage = function (id) {
    if (typeof Storage !== 'undefined') {
      localStorage.removeItem(id);
    }
    else {
      date = new Date();
      date.setYear(date.getFullYear() - 4);
      document.cookie = id + '=;' + date + ';path=/;';
    }
  };


  this.containsObject = function (obj, list, k) {
    for (var i = 0; i < list.length; i++) {
      if (list[i][k] == obj[k]) {
        return true;
      }
    }
    return false;
  };


  this.logout = function (t) {
    if (isLogin) {
        common.removeFromStorage('key');
        common.removeFromStorage('animalwells');
        common.removeFromStorage('token');
        var mobApp = common.readFromStorage('isMobApp');
        common.storageClear();
        common.addToStorage('loginStatus', 0);
        common.addToStorage('isLogout', 1);
        
        if(mobApp){
          var shrdObj = {};
          shrdObj.eventFlag=1;
          window.postMessage(JSON.stringify(shrdObj)); //for app logout
        }else{
          setTimeout(function () {
            if(!mobApp)
                window.location = '/logout';
          }, 360);
        }
        return;
    }
  };



  this.hManage = function () {
    $('.editable').focusout(function () {
      _this.removeStyleChilds($(this));
      var id = $('.activate').attr('data-id');
      $('.activateTxt').removeClass('activateTxt');
    });

    $('.editable').unbind('paste keyup cut');

    $('.editable,.txtEditable').bind('paste', function (e) {
      var text = '';
      var that = $(this);

      if (e.clipboardData) text = e.clipboardData.getData('text/plain');
      else if (window.clipboardData)
        text = window.clipboardData.getData('Text');
      else if (e.originalEvent.clipboardData)
        text = $('<div></div>').text(
          e.originalEvent.clipboardData.getData('text')
        );

      if (document.queryCommandSupported('insertText')) {
        document.execCommand('insertHTML', false, $(text).html());
        return false;
      } else {
        that.find('*').each(function () {
          $(this).addClass('within');
        });

        setTimeout(function () {
          that.find('*').each(function () {
            $(this).not('.within').contents().unwrap();
          });
        }, 1);
      }
    });

    $('.editable').bind('cut', function (e) {
      _this.managePlaceHolder($(this));
    });

    $('.editable').bind('keyup', function (e) {
      _this.managePlaceHolder($(this));
    });
  };



  this.checkLength = function (obj, event) {
    if ($(obj).text().length === 1500) {
      event.preventDefault();
    }
  };



  this.removeStyleChilds = function (obj) {
    $(obj).children().each(function (i) {
      var st = $(this);
      var st1 = $(this).attr('style');
      $(this).removeAttr('style');
      var ln = $(this).children().length;
      if (ln > 0) _this.removeStyleChilds($(this));
    });
  };


  this.dbDate = function (dt) {
    var dtChek = new Date(dt);
    if (dtChek == 'Invalid Date') {
      dt = dt.replace(/-/g, '/')
      dt = new Date(dt);
      if (dt == 'Invalid Date') return '';
      var dbFomrdate = dt.getFullYear() + '-' + (dt.getMonth() < 10 ? '0' + (dt.getMonth() + 1) : dt.getMonth() + 1) + '-' + (dt.getDate() < 10 ? '0' + dt.getDate() : dt.getDate());
      return dbFomrdate;
    } else {
      dt = new Date(dt);
      if (dt == 'Invalid Date') return '';
      var dbFomrdate = dt.getFullYear() + '-' + (dt.getMonth() < 10 ? '0' + (dt.getMonth() + 1) : dt.getMonth() + 1) + '-' + (dt.getDate() < 10 ? '0' + dt.getDate() : dt.getDate());
      return dbFomrdate;
    }
  };

  




  this.formatDate = function (date) {
    var d = new Date(date),
      month = '' + (d.getMonth()),
      day = '' + d.getDate(),
      year = d.getFullYear();
    if (day.length < 2) day = '0' + day;

    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    return (day + " " + monthNames[month] + ', ' + year);
  }

  this.getMonthYear = function (date) {
    var d = new Date(date),
      month = '' + (d.getMonth()),
      day = '' + d.getDate(),
      year = d.getFullYear();
    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    return (monthNames[month] + ', ' + year);
  }



  this.checkCount = function (evt, max) {
    var val = $(evt.target).val().split(' ').length;
    var charCode = evt.which ? evt.which : evt.keyCode;
    if (charCode == 8) return true;
    if (val >= max) {
      common.msg(0, common.getMsg(80))
      return false;
    }
    else return true;
  };

 

}


var ki = 0;
var kounter = 0;
function letterSwitch(e) {
  $(".showImg").removeClass("showImg"), $(".panel").eq(e).addClass("showImg");
}
function checktime() {
  ki >= 200 && (ki = 0, kounter = (kounter + 1) % 5, letterSwitch(kounter)), ki++ , requestAnimationFrame(checktime);
}

var ui = {};
$(document).ready(function () {

  letterSwitch(0);
  checktime();
  $(window).scroll(function () {
    var elem = document.getElementById('secondOne');
    var third = document.getElementById('thirdSec');
    var scrolVal = window.scrollY;
    $('#thirdSec').css('transform', 'translateY(' + scrolVal + 'px)');
  });

  

  ui = {
    duration: 300,
    easing: '0.77, 0, 0.175, 1',
    fadeIn: function (id) {
      if(typeof isVelocity != 'undefined')
        $('#' + id).velocity({ opacity: [1, 0] },{ duration: 300, display: 'block' });
      else{
        $("#"+id).css("display","block");
        $("#"+id).animate({opacity: 1}, 300,function() {});
      }
    },
    fadeOut: function (id) {
      if(typeof isVelocity != 'undefined')
        $('#' + id).velocity({ opacity: [0, 1] },{ duration: 300, display: 'none' });
      else{
        
        $("#"+id).animate({opacity: 0}, 300,function() {
            $("#"+id).css("display","none");
        });
      }
    },
    showOverlay: function (overlayId) {
      overlayId ='overlayLogin';
      var oLen = $('#overlayLogin').length;
      if(!oLen){
        var str ='<div class="overlaySh" id="overlayLogin"></div>';
        $('body').append(str);
      }

      var oId = 'overlayLogin';
      if (overlayId) {
        oId = overlayId;
      }
     

      if(typeof isVelocity != 'undefined')
        $('#overlayLogin').velocity({ opacity: [1, 0] },{ duration: 200, display: 'block' });
      else{

        $("#overlayLogin").css("display","block");
        $( "#overlayLogin" ).animate({
          opacity: 1}, 200, function() {// callback
          });
          
      }
    },
    hideOverlay: function (overlayId) {
      var oId = 'overlayLogin';
      if (overlayId) {
        oId = overlayId;
      }
      

      if(typeof isVelocity != 'undefined')
        $('#overlayLogin').velocity({ opacity: [0, 1] },{ duration: 200, display: 'none' });
    else{

      $("#overlayLogin").animate({opacity: 0}, 200,function() {
        $("#overlayLogin").css("display","none");
      });

    }
  },
    popup: {
      show: function (id, overlayId) {
          ui.showOverlay(overlayId);
        if(typeof isVelocity != 'undefined')
          $('#' + id).velocity({ opacity: [1, 0], translateY: ['0%', '100%'] },{ duration: 300, display: 'block', easing: [0.77, 0, 0.175, 1] });
        else{
            $("#"+id).css({"-webkit-transform":"translateY(100%)","-ms-transform":"translateY(100%)","transform":"translateY(100%)"});
            $("#"+id).css("display","block");
            $("#"+id).addClass('transition300');
            $("#"+id).animate({opacity: 1}, 100,function() {
            $("#"+id).css({"-webkit-transform":"translateY(0%)","-ms-transform":"translateY(0%)","transform":"translateY(0%)"});
            setTimeout(function(){
              // ///alert("hereeeee in time out");
              $("#"+id).removeClass('transition300');
            },400)
          });
        }
      },
      hide: function (id, overlayId) {
        ui.hideOverlay(overlayId);
        if(typeof isVelocity != 'undefined')
          $('#' + id).velocity({ opacity: [0, 1], translateY: ['100%', '0%'] },{ duration: 300, display: 'none', easing: [0.77, 0, 0.175, 1] });
        else{
          $("#"+id).addClass('transition300');
          $("#"+id).css({"-webkit-transform":"translateY(100%)","-ms-transform":"translateY(100%)","transform":"translateY(100%)"});
          setTimeout(function(){
            $("#"+id).animate({opacity: 0}, 300,function() {
              $("#"+id).removeClass('transition300');
              $("#"+id).css("display","none");
            });
          },300)
        }
      },
    },
// call if  overlay not needed 
    rareCase: {
      show: function (id, overlayId) {
        if(typeof isVelocity != 'undefined')
          $('#' + id).velocity({ opacity: [1, 0], translateY: ['0%', '100%'] },{ duration: 300, display: 'block', easing: [0.77, 0, 0.175, 1] });
        else{
            $("#"+id).css({"-webkit-transform":"translateY(100%)","-ms-transform":"translateY(100%)","transform":"translateY(100%)"});
            $("#"+id).css("display","block");
            $("#"+id).addClass('transition300');
            $("#"+id).animate({opacity: 1}, 100,function() {
            $("#"+id).css({"-webkit-transform":"translateY(0%)","-ms-transform":"translateY(0%)","transform":"translateY(0%)"});
            setTimeout(function(){
              // ///alert("hereeeee in time out");
              $("#"+id).removeClass('transition300');
            },400)
          });
        }
      },
      hide: function (id, overlayId) {
        if(typeof isVelocity != 'undefined')
          $('#' + id).velocity({ opacity: [0, 1], translateY: ['100%', '0%'] },{ duration: 300, display: 'none', easing: [0.77, 0, 0.175, 1] });
        else{
          $("#"+id).addClass('transition300');
          $("#"+id).css({"-webkit-transform":"translateY(100%)","-ms-transform":"translateY(100%)","transform":"translateY(100%)"});
          setTimeout(function(){
            $("#"+id).animate({opacity: 0}, 300,function() {
              $("#"+id).removeClass('transition300');
              $("#"+id).css("display","none");
            });
          },300)
        }
      },
    },
   
    panel: {
      show: function (id) {
        if(typeof isVelocity != 'undefined')
          $('#' + id).velocity({ translateX: ['0%', '100%'] },{ duration: 300, display: 'block', easing: [0.77, 0, 0.175, 1] });
        else{
          $("#"+id).css("display","block");
          $("#"+id).css({"-webkit-transform":"translateX(100%)","-ms-transform":"translateX(100%)","transform":"translateX(100%)"});
          $("#"+id).addClass('transition300');
          $("#"+id).animate({opacity: 1}, 0,function() {
            $("#"+id).css({"-webkit-transform":"translateX(0%)","-ms-transform":"translateX(0%)","transform":"translateX(0%)"});
            setTimeout(function(){
              $("#"+id).removeClass('transition300');
            },400)
          });
        }
      },
      hide: function (id) {
        if(typeof isVelocity != 'undefined')
          $('#' + id).velocity({ translateX: ['100%', '0%'] },{ duration: 300, display: 'none', easing: [0.77, 0, 0.175, 1] });
        else{
          $("#"+id).addClass('transition300');
          $("#"+id).css({"-webkit-transform":"translateX(100%)","-ms-transform":"translateX(100%)","transform":"translateX(100%)"});
            setTimeout(function(){
              $("#"+id).css("display","none");
              $("#"+id).removeClass('transition300');
            },400)
          
        }
      },
    },
   
    panelVertical: {
      show: function (id) {
        if(typeof isVelocity != 'undefined')
          $('#' + id).velocity({ translateY: [0, '100%'] },{ duration: 200, display: 'block', easing: [0.77, 0, 0.175, 1] });
        else{
          $("#"+id).css({"-webkit-transform":"translateY(100%)","-ms-transform":"translateY(100%)","transform":"translateY(100%)"});
          $("#"+id).css("display","block");
          $("#"+id).addClass('transition300');
          $("#"+id).animate({opacity: 1}, 0,function() {
            $("#"+id).css({"-webkit-transform":"translateY(0%)","-ms-transform":"translateY(0%)","transform":"translateY(0%)"});
            setTimeout(function(){
              $("#"+id).removeClass('transition300');
            },400)
          });
        }
      },
      hide: function (id) {
        if(typeof isVelocity != 'undefined')
          $('#' + id).velocity({ translateY: ['100%', 0] },{ duration: 200, display: 'none', easing: [0.77, 0, 0.175, 1] });
        else{
          $("#"+id).addClass('transition300');
          $("#"+id).css({"-webkit-transform":"translateY(100%)","-ms-transform":"translateY(100%)","transform":"translateY(100%)"});
          $("#"+id).animate({opacity: 1}, 300,function() {
            
            setTimeout(function(){
              $("#"+id).removeClass('transition300');
              $("#"+id).css("display","none");
            },0)
          });
        }
      },
    },
    filter: {
      show: function (id) {
        if ($('#' + id).hasClass('dn')) {
          $('#' + id).removeClass('dn');
        } else {
          $('#' + id).addClass('dn');
        }
      },
      slideDown: function (th, container) {
        if (container !== null) {
          $('#' + container)
            .find('.filter_dropdown')
            .addClass('inContainer');
        }
        $(th).addClass('point_none');
        $(th).removeClass('inContainer');
        $('.inContainer')
          .siblings('.jquery_slide')
          .delay(50)
          .slideUp('fast', function () {
            $('.inContainer').removeClass('point_none');
          });
        $('.inContainer').removeClass('active');
        $(th)
          .siblings('.jquery_slide')
          .delay(50)
          .slideToggle('fast', function () {
            $(th).removeClass('point_none');
          });
        $(th).toggleClass('active');
      },
    },
    nav: {
      slideDown: function (th) {
        $(th).siblings('.jquery_slide').slideToggle();
      },
    },
   
    toggle: {
      trigger: function (ele) {
        var $ele = $(ele);
        $ele.addClass('point_none');
        var fin = function () {
          $ele.removeClass('point_none');
          $ele.unbind(
            'transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd',
            function () {
            }
          );
        };
        if ($ele.hasClass('active')) {
          $ele.removeClass('active');
        } else {
          $ele.addClass('active');
        }
        $ele.bind(
          'transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd',
          fin
        );
      },
    }
  };


});





$(document).ready(function () {
  document.execCommand("insertHTML", false, "<br>");
  document.execCommand('insertHTML', false, 'br');


  $('input[type="date"]').change(function () {

    if (this.value) {
      $(this).removeAttr('placeholder');
    } else {
      var plval = $(this).attr('data-placeholder');
      $(this).attr({ 'placeholder': plval });
    }
  });

  $(document).mouseup(function (e) {
    var likecontainer = $(".like_tooltip");
    if (!likecontainer.is(e.target) && likecontainer.has(e.target).length === 0) {
      $(".like_tooltip").removeClass("active")
    }
    var sharecontainer = $(".share_tooltip");
    if (!sharecontainer.is(e.target) && sharecontainer.has(e.target).length === 0) {
      $(".share_tooltip").removeClass("active")
    }
  });





});






$(document).on('keypress', function (e) {
  var id = $(e.target).attr('id');
  var txt = $(e.target).text();
  var $this = $(this),
    val = $this.val(),
    code = e.keyCode || e.which;
  if (txt.indexOf('@') !== -1) {
    strData.push(String.fromCharCode(code));
    strDataCommon.push(String.fromCharCode(code));
    strDataCommonStry.push(String.fromCharCode(code));
    strDataPost.push(String.fromCharCode(code));
  }
});




  $(document).ready(function () {
  document.addEventListener("message", function(data) {
    let values=data.data
    var obj = JSON.parse(values)
    var isloginType =  obj.isLoginType ? obj.isLoginType : '3' ;
    var version =  obj.version ? obj.version : 0;
    var os =  obj.os ? obj.os : '';

    if(common.readFromStorage('key')){
      var isUpdate = false;
      if(os=='ios'){
        if(version !== '1.2.0'){
          isUpdate = true;
        }
      }
      else if(os =='android') {
        if(version !== '1.1.0'){
          isUpdate = true;
        }
      }else{
        isUpdate = true;
      }
      return;
    }
  });
});




