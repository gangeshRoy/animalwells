var commonPre = new CommonPre();
function CommonPre() {
  var _this = this;
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


}



function storageChange(event) {
  if (!commonPre.readFromStorage('addJson')) {
    if (event.key === 'loginStatus') {
      if (event.newValue == 0) {
        commonPre.storageClear();
        localStorage.clear();
        
        commonPre.addToStorage('isLogout', 1);
        setTimeout(function(){
          location.href = UDOMAIN;  
        },250)
      } else if (event.newValue == 1) {

        location.href = UDOMAIN + '?tab=1';

      }
    }
  }
}


window.addEventListener('storage', storageChange, false);

