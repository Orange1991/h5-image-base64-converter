/**
 * Scripts used in the demo of IBConverter
 * @Author: https://github.com/Orange1991
 */

/**
 * Whether File Api supported
 * @return {Boolean} return true if supported, otherwise return false
 */
var isSupportFileApi = function () {
  return !!(window.File && window.FileList && window.FileReader && window.Blob);
};

var notificationWrapper, notificationContent, notificationCloseBtn;
var imgFilePicker, imgField, strField, imgFieldContainer, btnCpStr, cpResult, btnSwitch, btnConvertToImg, btnConvertToStr;

var initElements = function() {
  notificationWrapper = document.querySelector('#notification');
  notificationContent = document.querySelector('#notification-content');
  notificationCloseBtn = document.querySelector('#notification .icon-close');
  imgFilePicker = document.getElementById('img-file');
  imgField = document.getElementById('img-field');
  strField = document.getElementById('str-field');
  imgFieldContainer = document.getElementById('img-field-container');
  btnCpStr = document.getElementById('btn-cp-str');
  cpResult = document.getElementById('cp-result');
  btnSwitch = document.getElementById('btn-switch');
  btnConvertToStr = document.getElementById('convert-to-str');
  btnConvertToImg = document.getElementById('convert-to-img');
};

var MODE_ITB = 0, MODE_BTI = 1;
var mode;
var imgMaxWidth, imgMaxHeight, imgNaturalWidth, imgNaturalHeight;
var imgShowing;
var shownClass;

var initVariables = function() {
  mode = MODE_ITB;
  imgShowing = false;
  imgNaturalWidth = 0, imgNaturalHeight = 0;
  setImgMaxSize();
  shownClass = 'show';
};

/**
 * Show notification
 * @param {String} msg - the notification content
 */
var showNotification = function(msg) {
  msg = msg || 'Invalid parameter!'
  if (notificationWrapper && notificationContent) {
    notificationWrapper.classList.add(shownClass);
    notificationContent.innerText = msg;
  } else {
    alert(msg);
  }
};

var closeNotification = function() {
  if (notificationWrapper) {
    notificationWrapper.classList.remove(shownClass);
  }
};

var setImgMaxSize = function() {
  if (imgFieldContainer) {
    imgMaxWidth = parseInt(window.getComputedStyle(imgFieldContainer).width);
    imgMaxHeight = parseInt(window.getComputedStyle(imgFieldContainer).height);
  }
};

var adaptImgSize = function() {
  if (imgField) {
    var setImgSize = function(width, height) {
      imgField.style.width = width;
      imgField.style.height = height;
    };
    var ratioX = imgNaturalWidth / imgMaxWidth;
    var ratioY = imgNaturalHeight / imgMaxHeight;
    if (ratioX > 1 || ratioY > 1) {
      if (ratioX > ratioY) {
        setImgSize(imgNaturalWidth / ratioX + 'px', 'auto');
      } else {
        setImgSize('auto', imgNaturalHeight / ratioY + 'px');
      }
    } else {
      setImgSize('auto', 'auto');
    }
  }
};

var imgToBase64Str = function() {
  if (mode === MODE_ITB) {
    imgShowing = false;
    imgField.src = '';
    strField.value = '';
    showNotification('Converting...');
    var reader = new FileReader();
    reader.onload = function(e) {
      imgField.src = this.result;
      strField.value = this.result;
    };
    reader.readAsDataURL(imgFilePicker.files[0]);
  }
};

var base64StrToImg = function() {
  if (mode === MODE_BTI) {
    imgShowing = false;
    imgField.src = '';
    showNotification('Converting...');
    imgField.src = strField.value;
  }
};

var initListeners = function() {
  // Add listener to close notification
  notificationCloseBtn && notificationCloseBtn.addEventListener('click', closeNotification);
  // Add listeners to clear everything
  document.querySelectorAll('.icon-clear').forEach(function(btn) {
    btn.addEventListener('click', function() {
      imgNaturalWidth = 0;
      imgNaturalHeight = 0;
      imgField.src = '';
      strField.value = '';
      adaptImgSize();
    });
  });
  // Add listener to copy string
  btnCpStr.addEventListener('click', function() {
    var s = strField && strField.value;
    if (s) {
      strField.select();
      document.execCommand('Copy');
      cpResult.classList.add(shownClass);
      setTimeout(function() {
        cpResult.classList.remove(shownClass);
      }, 3000);
    } else {
      showNotification('No text found!');
    }
  });
  // Add listener to switch function
  btnSwitch.addEventListener('click', function() {
    var bToIClass = 'b-to-i';
    if (mode === MODE_ITB) {
      mode = MODE_BTI;
      document.body.classList.add(bToIClass);
      imgFilePicker.disabled = 'disabled';
    } else {
      mode = MODE_ITB;
      document.body.classList.remove(bToIClass);
      imgFilePicker.disabled = '';
    }
  });

  if (isSupportFileApi()) {
    // When the window's size changes, reset the max size of image element
    var resizeTimer;
    document.body.onresize = function() {
      if (resizeTimer) {
        clearTimeout(resizeTimer);
      }
      resizeTimer = setTimeout(function() {
        setImgMaxSize();
        if (imgShowing) {
          adaptImgSize();
        }
        resizeTimer = null;
      }, 100);
    };

    // When a new new image is loaded, save its width and height
    imgField.onload = function() {
      imgNaturalWidth = this.naturalWidth;
      imgNaturalHeight = this.naturalHeight;
      imgShowing = true;
      adaptImgSize();
      closeNotification();
    };

    imgFilePicker.onchange = imgToBase64Str;
    btnConvertToStr.addEventListener('click', imgToBase64Str);
    btnConvertToImg.addEventListener('click', base64StrToImg);
  }
};

(function() {
  initElements();
  initVariables();
  initListeners();
  if (!isSupportFileApi()) {
    showNotification('IBConverter is supported for your browser. Please try other modern browser, i.e. Chrome, Firefox, Safari');
  }
})();
