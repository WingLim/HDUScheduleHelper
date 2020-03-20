// Utility function
function Util () {};

/* 
	class manipulation functions
*/
Util.hasClass = function(el, className) {
	if (el.classList) return el.classList.contains(className);
	else return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
};

Util.addClass = function(el, className) {
	var classList = className.split(' ');
 	if (el.classList) el.classList.add(classList[0]);
 	else if (!Util.hasClass(el, classList[0])) el.className += " " + classList[0];
 	if (classList.length > 1) Util.addClass(el, classList.slice(1).join(' '));
};

Util.removeClass = function(el, className) {
	var classList = className.split(' ');
	if (el.classList) el.classList.remove(classList[0]);	
	else if(Util.hasClass(el, classList[0])) {
		var reg = new RegExp('(\\s|^)' + classList[0] + '(\\s|$)');
		el.className=el.className.replace(reg, ' ');
	}
	if (classList.length > 1) Util.removeClass(el, classList.slice(1).join(' '));
};

Util.toggleClass = function(el, className, bool) {
	if(bool) Util.addClass(el, className);
	else Util.removeClass(el, className);
};

Util.setAttributes = function(el, attrs) {
  for(var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
};

/* 
  DOM manipulation
*/
Util.getChildrenByClassName = function(el, className) {
  var children = el.children,
    childrenByClass = [];
  for (var i = 0; i < el.children.length; i++) {
    if (Util.hasClass(el.children[i], className)) childrenByClass.push(el.children[i]);
  }
  return childrenByClass;
};

Util.is = function(elem, selector) {
  if(selector.nodeType){
    return elem === selector;
  }

  var qa = (typeof(selector) === 'string' ? document.querySelectorAll(selector) : selector),
    length = qa.length,
    returnArr = [];

  while(length--){
    if(qa[length] === elem){
      return true;
    }
  }

  return false;
};

/* 
	Animate height of an element
*/
Util.setHeight = function(start, to, element, duration, cb) {
	var change = to - start,
	    currentTime = null;

  var animateHeight = function(timestamp){  
    if (!currentTime) currentTime = timestamp;         
    var progress = timestamp - currentTime;
    var val = parseInt((progress/duration)*change + start);
    element.style.height = val+"px";
    if(progress < duration) {
        window.requestAnimationFrame(animateHeight);
    } else {
    	cb();
    }
  };
  
  //set the height of the element before starting animation -> fix bug on Safari
  element.style.height = start+"px";
  window.requestAnimationFrame(animateHeight);
};

/* 
	Smooth Scroll
*/

Util.scrollTo = function(final, duration, cb, scrollEl) {
  var element = scrollEl || window;
  var start = element.scrollTop || document.documentElement.scrollTop,
    currentTime = null;

  if(!scrollEl) start = window.scrollY || document.documentElement.scrollTop;
      
  var animateScroll = function(timestamp){
  	if (!currentTime) currentTime = timestamp;        
    var progress = timestamp - currentTime;
    if(progress > duration) progress = duration;
    var val = Math.easeInOutQuad(progress, start, final-start, duration);
    element.scrollTo(0, val);
    if(progress < duration) {
        window.requestAnimationFrame(animateScroll);
    } else {
      cb && cb();
    }
  };

  window.requestAnimationFrame(animateScroll);
};

/* 
  Focus utility classes
*/

//Move focus to an element
Util.moveFocus = function (element) {
  if( !element ) element = document.getElementsByTagName("body")[0];
  element.focus();
  if (document.activeElement !== element) {
    element.setAttribute('tabindex','-1');
    element.focus();
  }
};

/* 
  Misc
*/

Util.getIndexInArray = function(array, el) {
  return Array.prototype.indexOf.call(array, el);
};

Util.cssSupports = function(property, value) {
  if('CSS' in window) {
    return CSS.supports(property, value);
  } else {
    var jsProperty = property.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase();});
    return jsProperty in document.body.style;
  }
};

// merge a set of user options into plugin defaults
// https://gomakethings.com/vanilla-javascript-version-of-jquery-extend/
Util.extend = function() {
  // Variables
  var extended = {};
  var deep = false;
  var i = 0;
  var length = arguments.length;

  // Check if a deep merge
  if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
    deep = arguments[0];
    i++;
  }

  // Merge the object into the extended object
  var merge = function (obj) {
    for ( var prop in obj ) {
      if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
        // If deep merge and property is an object, merge properties
        if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
          extended[prop] = extend( true, extended[prop], obj[prop] );
        } else {
          extended[prop] = obj[prop];
        }
      }
    }
  };

  // Loop through each object and conduct a merge
  for ( ; i < length; i++ ) {
    var obj = arguments[i];
    merge(obj);
  }

  return extended;
};

// Check if Reduced Motion is enabled
Util.osHasReducedMotion = function() {
  if(!window.matchMedia) return false;
  var matchMediaObj = window.matchMedia('(prefers-reduced-motion: reduce)');
  if(matchMediaObj) return matchMediaObj.matches;
  return false; // return false if not supported
}; 

/* 
	Polyfills
*/
//Closest() method
if (!Element.prototype.matches) {
	Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
	Element.prototype.closest = function(s) {
		var el = this;
		if (!document.documentElement.contains(el)) return null;
		do {
			if (el.matches(s)) return el;
			el = el.parentElement || el.parentNode;
		} while (el !== null && el.nodeType === 1); 
		return null;
	};
}

//Custom Event() constructor
if ( typeof window.CustomEvent !== "function" ) {

  function CustomEvent ( event, params ) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent( 'CustomEvent' );
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    return evt;
   }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
}

/* 
	Animation curves
*/
Math.easeInOutQuad = function (t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2*t*t + b;
	t--;
	return -c/2 * (t*(t-2) - 1) + b;
};


/* JS Utility Classes */
(function() {
  // make focus ring visible only for keyboard navigation (i.e., tab key) 
  var focusTab = document.getElementsByClassName('js-tab-focus');
  function detectClick() {
    if(focusTab.length > 0) {
      resetFocusTabs(false);
      window.addEventListener('keydown', detectTab);
    }
    window.removeEventListener('mousedown', detectClick);
  };

  function detectTab(event) {
    if(event.keyCode !== 9) return;
    resetFocusTabs(true);
    window.removeEventListener('keydown', detectTab);
    window.addEventListener('mousedown', detectClick);
  };

  function resetFocusTabs(bool) {
    var outlineStyle = bool ? '' : 'none';
    for(var i = 0; i < focusTab.length; i++) {
      focusTab[i].style.setProperty('outline', outlineStyle);
    }
  };
  window.addEventListener('mousedown', detectClick);
}());
function insert (id, html) {
    ul = document.getElementById(id)
    ul.insertAdjacentHTML('beforeend', html)
}

function findplace(weekday){
    switch (weekday) {
        case '周一':
            return '1';
        case '周二':
            return '2'
        case '周三':
            return '3'
        case '周四':
            return '4'
        case '周五':
            return '5'
        case '周六':
            return '6'
        case '周日':
            return '7'
    }
}
function create (course) {
    range = parseInt(Math.random() * 3 +1)
    time = course.timeinfo
    info = JSON.stringify(course)
    html = `<li class="cd-schedule__event">
        <a data-start="${time.start}" data-end="${time.end}" href="#0" data-content='${info}' data-event="event-${range}">
            <em class="cd-schedule__name">${course.title}</em>
           
        </a>
        </li>`
    return html
}


axios.get('https://api.limxw.com/schedule/json/18011317')
    .then(function (resp) {
        r = resp
        resp.data.forEach(course => {
            let ele = create(course)
            let place = findplace(course.timeinfo.weekday)
            insert(place, ele)
        });
        renderSchedule()
    })
    .catch(function (err) {
        console.log(err)
    });
// File#: _1_anim-menu-btn
// Usage: codyhouse.co/license
(function() {
    var menuBtns = document.getElementsByClassName('js-anim-menu-btn');
    if( menuBtns.length > 0 ) {
      for(var i = 0; i < menuBtns.length; i++) {(function(i){
        initMenuBtn(menuBtns[i]);
      })(i);}
  
      function initMenuBtn(btn) {
        btn.addEventListener('click', function(event){	
          event.preventDefault();
          var status = !Util.hasClass(btn, 'anim-menu-btn--state-b');
          Util.toggleClass(btn, 'anim-menu-btn--state-b', status);
          // emit custom event
          var event = new CustomEvent('anim-menu-btn-clicked', {detail: status});
          btn.dispatchEvent(event);
        });
      };
    }
  }());
// File#: _1_custom-select
// Usage: codyhouse.co/license
(function() {
    // NOTE: you need the js code only when using the --custom-dropdown variation of the Custom Select component. Default version does nor require JS.
    
    var CustomSelect = function(element) {
      this.element = element;
      this.select = this.element.getElementsByTagName('select')[0];
      this.optGroups = this.select.getElementsByTagName('optgroup');
      this.options = this.select.getElementsByTagName('option');
      this.selectedOption = getSelectedOptionText(this);
      this.selectId = this.select.getAttribute('id');
      this.trigger = false;
      this.dropdown = false;
      this.customOptions = false;
      this.arrowIcon = this.element.getElementsByTagName('svg');
      this.label = document.querySelector('[for="'+this.selectId+'"]');
  
      this.optionIndex = 0; // used while building the custom dropdown
  
      initCustomSelect(this); // init markup
      initCustomSelectEvents(this); // init event listeners
    };
    
    function initCustomSelect(select) {
      // create the HTML for the custom dropdown element
      select.element.insertAdjacentHTML('beforeend', initButtonSelect(select) + initListSelect(select));
      
      // save custom elements
      select.dropdown = select.element.getElementsByClassName('js-select__dropdown')[0];
      select.trigger = select.element.getElementsByClassName('js-select__button')[0];
      select.customOptions = select.dropdown.getElementsByClassName('js-select__item');
      
      // hide default select
      Util.addClass(select.select, 'is-hidden');
      if(select.arrowIcon.length > 0 ) select.arrowIcon[0].style.display = 'none';
  
      // place dropdown
      placeDropdown(select);
    };
  
    function initCustomSelectEvents(select) {
      // option selection in dropdown
      initSelection(select);
  
      // click events
      select.trigger.addEventListener('click', function(){
        toggleCustomSelect(select, false);
      });
      if(select.label) {
        // move focus to custom trigger when clicking on <select> label
        select.label.addEventListener('click', function(){
          Util.moveFocus(select.trigger);
        });
      }
      // keyboard navigation
      select.dropdown.addEventListener('keydown', function(event){
        if(event.keyCode && event.keyCode == 38 || event.key && event.key.toLowerCase() == 'arrowup') {
          keyboardCustomSelect(select, 'prev', event);
        } else if(event.keyCode && event.keyCode == 40 || event.key && event.key.toLowerCase() == 'arrowdown') {
          keyboardCustomSelect(select, 'next', event);
        }
      });
      // native <select> element has been updated -> update custom select as well
      select.element.addEventListener('select-updated', function(event){
        resetCustomSelect(select);
      });
    };
  
    function toggleCustomSelect(select, bool) {
      var ariaExpanded;
      if(bool) {
        ariaExpanded = bool;
      } else {
        ariaExpanded = select.trigger.getAttribute('aria-expanded') == 'true' ? 'false' : 'true';
      }
      select.trigger.setAttribute('aria-expanded', ariaExpanded);
      if(ariaExpanded == 'true') {
        var selectedOption = getSelectedOption(select);
        Util.moveFocus(selectedOption); // fallback if transition is not supported
        select.dropdown.addEventListener('transitionend', function cb(){
          Util.moveFocus(selectedOption);
          select.dropdown.removeEventListener('transitionend', cb);
        });
        placeDropdown(select); // place dropdown based on available space
      }
    };
  
    function placeDropdown(select) {
      // remove placement classes to reset position
      Util.removeClass(select.dropdown, 'select__dropdown--right select__dropdown--up');
      var triggerBoundingRect = select.trigger.getBoundingClientRect();
      Util.toggleClass(select.dropdown, 'select__dropdown--right', (document.documentElement.clientWidth - 5 < triggerBoundingRect.left + select.dropdown.offsetWidth));
      // check if there's enough space up or down
      var moveUp = (window.innerHeight - triggerBoundingRect.bottom - 5) < triggerBoundingRect.top;
      Util.toggleClass(select.dropdown, 'select__dropdown--up', moveUp);
      // check if we need to set a max width
      var maxHeight = moveUp ? triggerBoundingRect.top - 20 : window.innerHeight - triggerBoundingRect.bottom - 20;
      // set max-height based on available space
      select.dropdown.setAttribute('style', 'max-height: '+maxHeight+'px; width: '+triggerBoundingRect.width+'px;');
    };
  
    function keyboardCustomSelect(select, direction, event) { // navigate custom dropdown with keyboard
      event.preventDefault();
      var index = Util.getIndexInArray(select.customOptions, document.activeElement);
      index = (direction == 'next') ? index + 1 : index - 1;
      if(index < 0) index = select.customOptions.length - 1;
      if(index >= select.customOptions.length) index = 0;
      Util.moveFocus(select.customOptions[index]);
    };
  
    function initSelection(select) { // option selection
      select.dropdown.addEventListener('click', function(event){
        var option = event.target.closest('.js-select__item');
        if(!option) return;
        selectOption(select, option);
      });
    };
    
    function selectOption(select, option) {
      if(option.hasAttribute('aria-selected') && option.getAttribute('aria-selected') == 'true') {
        // selecting the same option
        select.trigger.setAttribute('aria-expanded', 'false'); // hide dropdown
      } else { 
        var selectedOption = select.dropdown.querySelector('[aria-selected="true"]');
        if(selectedOption) selectedOption.setAttribute('aria-selected', 'false');
        option.setAttribute('aria-selected', 'true');
        select.trigger.getElementsByClassName('js-select__label')[0].textContent = option.textContent;
        select.trigger.setAttribute('aria-expanded', 'false');
        // new option has been selected -> update native <select> element _ arai-label of trigger <button>
        updateNativeSelect(select, option.getAttribute('data-index'));
        updateTriggerAria(select); 
      }
      // move focus back to trigger
      select.trigger.focus();
    };
  
    function updateNativeSelect(select, index) {
      select.select.selectedIndex = index;
      select.select.dispatchEvent(new CustomEvent('change', {bubbles: true})); // trigger change event
    };
  
    function updateTriggerAria(select) {
      select.trigger.setAttribute('aria-label', select.options[select.select.selectedIndex].innerHTML+', '+select.label.textContent);
    };
  
    function getSelectedOptionText(select) {// used to initialize the label of the custom select button
      var label = '';
      if('selectedIndex' in select.select) {
        label = select.options[select.select.selectedIndex].text;
      } else {
        label = select.select.querySelector('option[selected]').text;
      }
      return label;
  
    };
    
    function initButtonSelect(select) { // create the button element -> custom select trigger
      // check if we need to add custom classes to the button trigger
      var customClasses = select.element.getAttribute('data-trigger-class') ? ' '+select.element.getAttribute('data-trigger-class') : '';
  
      var label = select.options[select.select.selectedIndex].innerHTML+', '+select.label.textContent;
    
      var button = '<button type="button" class="js-select__button select__button'+customClasses+'" aria-label="'+label+'" aria-expanded="false" aria-controls="'+select.selectId+'-dropdown"><span aria-hidden="true" class="js-select__label select__label">'+select.selectedOption+'</span>';
      if(select.arrowIcon.length > 0 && select.arrowIcon[0].outerHTML) {
        var clone = select.arrowIcon[0].cloneNode(true);
        Util.removeClass(clone, 'select__icon');
        button = button +clone.outerHTML;
      }
      
      return button+'</button>';
  
    };
  
    function initListSelect(select) { // create custom select dropdown
      var list = '<div class="js-select__dropdown select__dropdown" aria-describedby="'+select.selectId+'-description" id="'+select.selectId+'-dropdown">';
      list = list + getSelectLabelSR(select);
      if(select.optGroups.length > 0) {
        for(var i = 0; i < select.optGroups.length; i++) {
          var optGroupList = select.optGroups[i].getElementsByTagName('option'),
            optGroupLabel = '<li><span class="select__item select__item--optgroup">'+select.optGroups[i].getAttribute('label')+'</span></li>';
          list = list + '<ul class="select__list" role="listbox">'+optGroupLabel+getOptionsList(select, optGroupList) + '</ul>';
        }
      } else {
        list = list + '<ul class="select__list" role="listbox">'+getOptionsList(select, select.options) + '</ul>';
      }
      return list;
    };
  
    function getSelectLabelSR(select) {
      if(select.label) {
        return '<p class="sr-only" id="'+select.selectId+'-description">'+select.label.textContent+'</p>'
      } else {
        return '';
      }
    };
    
    function resetCustomSelect(select) {
      // <select> element has been updated (using an external control) - update custom select
      var selectedOption = select.dropdown.querySelector('[aria-selected="true"]');
      if(selectedOption) selectedOption.setAttribute('aria-selected', 'false');
      var option = select.dropdown.querySelector('.js-select__item[data-index="'+select.select.selectedIndex+'"]');
      option.setAttribute('aria-selected', 'true');
      select.trigger.getElementsByClassName('js-select__label')[0].textContent = option.textContent;
      select.trigger.setAttribute('aria-expanded', 'false');
      updateTriggerAria(select); 
    };
  
    function getOptionsList(select, options) {
      var list = '';
      for(var i = 0; i < options.length; i++) {
        var selected = options[i].hasAttribute('selected') ? ' aria-selected="true"' : ' aria-selected="false"';
        list = list + '<li><button type="button" class="reset js-select__item select__item select__item--option" role="option" data-value="'+options[i].value+'" '+selected+' data-index="'+select.optionIndex+'">'+options[i].text+'</button></li>';
        select.optionIndex = select.optionIndex + 1;
      };
      return list;
    };
  
    function getSelectedOption(select) {
      var option = select.dropdown.querySelector('[aria-selected="true"]');
      if(option) return option;
      else return select.dropdown.getElementsByClassName('js-select__item')[0];
    };
  
    function moveFocusToSelectTrigger(select) {
      if(!document.activeElement.closest('.js-select')) return
      select.trigger.focus();
    };
    
    function checkCustomSelectClick(select, target) { // close select when clicking outside it
      if( !select.element.contains(target) ) toggleCustomSelect(select, 'false');
    };
    
    //initialize the CustomSelect objects
    var customSelect = document.getElementsByClassName('js-select');
    if( customSelect.length > 0 ) {
      var selectArray = [];
      for( var i = 0; i < customSelect.length; i++) {
        (function(i){selectArray.push(new CustomSelect(customSelect[i]));})(i);
      }
  
      // listen for key events
      window.addEventListener('keyup', function(event){
        if( event.keyCode && event.keyCode == 27 || event.key && event.key.toLowerCase() == 'escape' ) {
          // close custom select on 'Esc'
          selectArray.forEach(function(element){
            moveFocusToSelectTrigger(element); // if focus is within dropdown, move it to dropdown trigger
            toggleCustomSelect(element, 'false'); // close dropdown
          });
        } 
      });
      // close custom select when clicking outside it
      window.addEventListener('click', function(event){
        selectArray.forEach(function(element){
          checkCustomSelectClick(element, event.target);
        });
      });
    }
  }());
// File#: _2_flexi-header
// Usage: codyhouse.co/license
(function() {
    var flexHeader = document.getElementsByClassName('js-f-header');
    if(flexHeader.length > 0) {
      var menuTrigger = flexHeader[0].getElementsByClassName('js-anim-menu-btn')[0],
        firstFocusableElement = getMenuFirstFocusable();
  
      // we'll use these to store the node that needs to receive focus when the mobile menu is closed 
      var focusMenu = false;
  
      menuTrigger.addEventListener('anim-menu-btn-clicked', function(event){ // toggle menu visibility an small devices
        Util.toggleClass(document.getElementsByClassName('f-header__nav')[0], 'f-header__nav--is-visible', event.detail);
        menuTrigger.setAttribute('aria-expanded', event.detail);
        if(event.detail) firstFocusableElement.focus(); // move focus to first focusable element
        else if(focusMenu) {
          focusMenu.focus();
          focusMenu = false;
        }
      });
  
      // listen for key events
      window.addEventListener('keyup', function(event){
        // listen for esc key
        if( (event.keyCode && event.keyCode == 27) || (event.key && event.key.toLowerCase() == 'escape' )) {
          // close navigation on mobile if open
          if(menuTrigger.getAttribute('aria-expanded') == 'true' && isVisible(menuTrigger)) {
            focusMenu = menuTrigger; // move focus to menu trigger when menu is close
            menuTrigger.click();
          }
        }
        // listen for tab key
        if( (event.keyCode && event.keyCode == 9) || (event.key && event.key.toLowerCase() == 'tab' )) {
          // close navigation on mobile if open when nav loses focus
          if(menuTrigger.getAttribute('aria-expanded') == 'true' && isVisible(menuTrigger) && !document.activeElement.closest('.js-f-header')) menuTrigger.click();
        }
      });
  
      function getMenuFirstFocusable() {
        var focusableEle = flexHeader[0].getElementsByClassName('f-header__nav')[0].querySelectorAll('[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable], audio[controls], video[controls], summary'),
          firstFocusable = false;
        for(var i = 0; i < focusableEle.length; i++) {
          if( focusableEle[i].offsetWidth || focusableEle[i].offsetHeight || focusableEle[i].getClientRects().length ) {
            firstFocusable = focusableEle[i];
            break;
          }
        }
  
        return firstFocusable;
      };
      
      function isVisible(element) {
        return (element.offsetWidth || element.offsetHeight || element.getClientRects().length);
      };
    }
  }());
// File#: _1_modal-window
// Usage: codyhouse.co/license
(function() {
    var Modal = function(element) {
      this.element = element;
      this.triggers = document.querySelectorAll('[aria-controls="'+this.element.getAttribute('id')+'"]');
      this.firstFocusable = null;
      this.lastFocusable = null;
      this.selectedTrigger = null;
      this.showClass = "modal--is-visible";
      this.initModal();
    };
  
    Modal.prototype.initModal = function() {
      var self = this;
      //open modal when clicking on trigger buttons
      if ( this.triggers ) {
        for(var i = 0; i < this.triggers.length; i++) {
          this.triggers[i].addEventListener('click', function(event) {
            event.preventDefault();
            self.selectedTrigger = event.target;
            self.showModal();
            self.initModalEvents();
          });
        }
      }
  
      // listen to the openModal event -> open modal without a trigger button
      this.element.addEventListener('openModal', function(event){
        if(event.detail) self.selectedTrigger = event.detail;
        self.showModal();
        self.initModalEvents();
      });
  
      // listen to the closeModal event -> close modal without a trigger button
      this.element.addEventListener('closeModal', function(event){
        if(event.detail) self.selectedTrigger = event.detail;
        self.closeModal();
      });
    };
  
    Modal.prototype.showModal = function() {
      var self = this;
      Util.addClass(this.element, this.showClass);
      this.getFocusableElements();
      this.firstFocusable.focus();
      // wait for the end of transitions before moving focus
      this.element.addEventListener("transitionend", function cb(event) {
        self.firstFocusable.focus();
        self.element.removeEventListener("transitionend", cb);
      });
      this.emitModalEvents('modalIsOpen');
    };
  
    Modal.prototype.closeModal = function() {
      if(!Util.hasClass(this.element, this.showClass)) return;
      Util.removeClass(this.element, this.showClass);
      this.firstFocusable = null;
      this.lastFocusable = null;
      if(this.selectedTrigger) this.selectedTrigger.focus();
      //remove listeners
      this.cancelModalEvents();
      this.emitModalEvents('modalIsClose');
    };
  
    Modal.prototype.initModalEvents = function() {
      //add event listeners
      this.element.addEventListener('keydown', this);
      this.element.addEventListener('click', this);
    };
  
    Modal.prototype.cancelModalEvents = function() {
      //remove event listeners
      this.element.removeEventListener('keydown', this);
      this.element.removeEventListener('click', this);
    };
  
    Modal.prototype.handleEvent = function (event) {
      switch(event.type) {
        case 'click': {
          this.initClick(event);
        }
        case 'keydown': {
          this.initKeyDown(event);
        }
      }
    };
  
    Modal.prototype.initKeyDown = function(event) {
      if( event.keyCode && event.keyCode == 9 || event.key && event.key == 'Tab' ) {
        //trap focus inside modal
        this.trapFocus(event);
      } else if( (event.keyCode && event.keyCode == 13 || event.key && event.key == 'Enter') && event.target.closest('.js-modal__close')) {
        event.preventDefault();
        this.closeModal(); // close modal when pressing Enter on close button
      }	
    };
  
    Modal.prototype.initClick = function(event) {
      //close modal when clicking on close button or modal bg layer 
      if( !event.target.closest('.js-modal__close') && !Util.hasClass(event.target, 'js-modal') ) return;
      event.preventDefault();
      this.closeModal();
    };
  
    Modal.prototype.trapFocus = function(event) {
      if( this.firstFocusable == document.activeElement && event.shiftKey) {
        //on Shift+Tab -> focus last focusable element when focus moves out of modal
        event.preventDefault();
        this.lastFocusable.focus();
      }
      if( this.lastFocusable == document.activeElement && !event.shiftKey) {
        //on Tab -> focus first focusable element when focus moves out of modal
        event.preventDefault();
        this.firstFocusable.focus();
      }
    }
  
    Modal.prototype.getFocusableElements = function() {
      //get all focusable elements inside the modal
      var allFocusable = this.element.querySelectorAll('[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable], audio[controls], video[controls], summary');
      this.getFirstVisible(allFocusable);
      this.getLastVisible(allFocusable);
    };
  
    Modal.prototype.getFirstVisible = function(elements) {
      //get first visible focusable element inside the modal
      for(var i = 0; i < elements.length; i++) {
        if( elements[i].offsetWidth || elements[i].offsetHeight || elements[i].getClientRects().length ) {
          this.firstFocusable = elements[i];
          return true;
        }
      }
    };
  
    Modal.prototype.getLastVisible = function(elements) {
      //get last visible focusable element inside the modal
      for(var i = elements.length - 1; i >= 0; i--) {
        if( elements[i].offsetWidth || elements[i].offsetHeight || elements[i].getClientRects().length ) {
          this.lastFocusable = elements[i];
          return true;
        }
      }
    };
  
    Modal.prototype.emitModalEvents = function(eventName) {
      var event = new CustomEvent(eventName, {detail: this.selectedTrigger});
      this.element.dispatchEvent(event);
    };
  
    //initialize the Modal objects
    var modals = document.getElementsByClassName('js-modal');
    if( modals.length > 0 ) {
      var modalArrays = [];
      for( var i = 0; i < modals.length; i++) {
        (function(i){modalArrays.push(new Modal(modals[i]));})(i);
      }
  
      window.addEventListener('keydown', function(event){ //close modal window on esc
        if(event.keyCode && event.keyCode == 27 || event.key && event.key.toLowerCase() == 'escape') {
          for( var i = 0; i < modalArrays.length; i++) {
            (function(i){modalArrays[i].closeModal();})(i);
          };
        }
      });
    }
  }());
(function (window) {
    // Schedule Template - by CodyHouse.co
    function ScheduleTemplate(element) {
        this.element = element;
        this.timelineItems = this.element.getElementsByClassName('cd-schedule__timeline')[0].getElementsByTagName('li');
        this.timelineStart = getScheduleTimestamp(this.timelineItems[0].textContent);
        this.timelineUnitDuration = getScheduleTimestamp(this.timelineItems[1].textContent) - getScheduleTimestamp(this.timelineItems[0].textContent);

        this.topInfoElement = this.element.getElementsByClassName('cd-schedule__top-info')[0];
        this.singleEvents = this.element.getElementsByClassName('cd-schedule__event');

        this.modal = this.element.getElementsByClassName('cd-schedule-modal')[0];
        this.modalHeader = this.element.getElementsByClassName('cd-schedule-modal__header')[0];
        this.modalHeaderBg = this.element.getElementsByClassName('cd-schedule-modal__header-bg')[0];
        this.modalBody = this.element.getElementsByClassName('cd-schedule-modal__body')[0];
        this.modalBodyBg = this.element.getElementsByClassName('cd-schedule-modal__body-bg')[0];
        this.modalClose = this.modal.getElementsByClassName('cd-schedule-modal__close')[0];
        this.modalDate = this.modal.getElementsByClassName('cd-schedule-modal__date')[0];
        this.modalEventName = this.modal.getElementsByClassName('cd-schedule-modal__name')[0];
        this.coverLayer = this.element.getElementsByClassName('cd-schedule__cover-layer')[0];

        this.modalMaxWidth = 800;
        this.modalMaxHeight = 480;

        this.animating = false;
        this.supportAnimation = Util.cssSupports('transition');

        this.initSchedule();
    };

    ScheduleTemplate.prototype.initSchedule = function () {
        this.scheduleReset();
        this.initEvents();
    };

    ScheduleTemplate.prototype.scheduleReset = function () {
        // according to the mq value, init the style of the template
        var mq = this.mq(),
            loaded = Util.hasClass(this.element, 'js-schedule-loaded'),
            modalOpen = Util.hasClass(this.modal, 'cd-schedule-modal--open');
        if (mq == 'desktop' && !loaded) {
            Util.addClass(this.element, 'js-schedule-loaded');
            this.placeEvents();
            modalOpen && this.checkEventModal(modalOpen);
        } else if (mq == 'mobile' && loaded) {
            //in this case you are on a mobile version (first load or resize from desktop)
            Util.removeClass(this.element, 'cd-schedule--loading js-schedule-loaded');
            this.resetEventsStyle();
            modalOpen && this.checkEventModal();
        } else if (mq == 'desktop' && modalOpen) {
            //on a mobile version with modal open - need to resize/move modal window
            this.checkEventModal(modalOpen);
            Util.removeClass(this.element, 'cd-schedule--loading');
        } else {
            Util.removeClass(this.element, 'cd-schedule--loading');
        }
    };

    ScheduleTemplate.prototype.resetEventsStyle = function () {
        // remove js style applied to the single events
        for (var i = 0; i < this.singleEvents.length; i++) {
            this.singleEvents[i].removeAttribute('style');
        }
    };

    ScheduleTemplate.prototype.placeEvents = function () {
        // on big devices - place events in the template according to their time/day
        var self = this,
            slotHeight = this.topInfoElement.offsetHeight;
        for (var i = 0; i < this.singleEvents.length; i++) {
            var anchor = this.singleEvents[i].getElementsByTagName('a')[0];
            var start = getScheduleTimestamp(anchor.getAttribute('data-start')),
                duration = getScheduleTimestamp(anchor.getAttribute('data-end')) - start;

            var eventTop = slotHeight * (start - self.timelineStart) / self.timelineUnitDuration,
                eventHeight = slotHeight * duration / self.timelineUnitDuration;

            this.singleEvents[i].setAttribute('style', 'top: ' + (eventTop - 1) + 'px; height: ' + (eventHeight + 1) + 'px');
        }

        Util.removeClass(this.element, 'cd-schedule--loading');
    };

    ScheduleTemplate.prototype.initEvents = function () {
        var self = this;
        for (var i = 0; i < this.singleEvents.length; i++) {
            // open modal when user selects an event
            this.singleEvents[i].addEventListener('click', function (event) {
                event.preventDefault();
                if (!self.animating) self.openModal(this.getElementsByTagName('a')[0]);
            });
        }
        //close modal window
        this.modalClose.addEventListener('click', function (event) {
            event.preventDefault();
            if (!self.animating) self.closeModal();
        });
        this.coverLayer.addEventListener('click', function (event) {
            event.preventDefault();
            if (!self.animating) self.closeModal();
        });
    };

    ScheduleTemplate.prototype.openModal = function (target) {
        var self = this;
        var mq = self.mq();
        this.animating = true;

        //update event name and time
        this.modalEventName.textContent = target.getElementsByTagName('em')[0].textContent;
        this.modalDate.textContent = target.getAttribute('data-start') + ' - ' + target.getAttribute('data-end');
        this.modal.setAttribute('data-event', target.getAttribute('data-event'));

        //update event content
        //this.loadEventContent(target.getAttribute('data-content'));
        this.addCourseInfo(target.getAttribute('data-content'));

        Util.addClass(this.modal, 'cd-schedule-modal--open');

        setTimeout(function () {
            //fixes a flash when an event is selected - desktop version only
            Util.addClass(target.closest('li'), 'cd-schedule__event--selected');
        }, 10);

        if (mq == 'mobile') {
            self.modal.addEventListener('transitionend', function cb() {
                self.animating = false;
                self.modal.removeEventListener('transitionend', cb);
            });
        } else {
            var eventPosition = target.getBoundingClientRect(),
                eventTop = eventPosition.top,
                eventLeft = eventPosition.left,
                eventHeight = target.offsetHeight,
                eventWidth = target.offsetWidth;

            var windowWidth = window.innerWidth,
                windowHeight = window.innerHeight;

            var modalWidth = (windowWidth * .8 > self.modalMaxWidth) ? self.modalMaxWidth : windowWidth * .8,
                modalHeight = (windowHeight * .8 > self.modalMaxHeight) ? self.modalMaxHeight : windowHeight * .8;

            var modalTranslateX = parseInt((windowWidth - modalWidth) / 2 - eventLeft),
                modalTranslateY = parseInt((windowHeight - modalHeight) / 2 - eventTop);

            var HeaderBgScaleY = modalHeight / eventHeight,
                BodyBgScaleX = (modalWidth - eventWidth);

            //change modal height/width and translate it
            self.modal.setAttribute('style', 'top:' + eventTop + 'px;left:' + eventLeft + 'px;height:' + modalHeight + 'px;width:' + modalWidth + 'px;transform: translateY(' + modalTranslateY + 'px) translateX(' + modalTranslateX + 'px)');
            //set modalHeader width
            self.modalHeader.setAttribute('style', 'width:' + eventWidth + 'px');
            //set modalBody left margin
            self.modalBody.setAttribute('style', 'margin-left:' + eventWidth + 'px');
            //change modalBodyBg height/width ans scale it
            self.modalBodyBg.setAttribute('style', 'height:' + eventHeight + 'px; width: 1px; transform: scaleY(' + HeaderBgScaleY + ') scaleX(' + BodyBgScaleX + ')');
            //change modal modalHeaderBg height/width and scale it
            self.modalHeaderBg.setAttribute('style', 'height: ' + eventHeight + 'px; width: ' + eventWidth + 'px; transform: scaleY(' + HeaderBgScaleY + ')');

            self.modalHeaderBg.addEventListener('transitionend', function cb() {
                //wait for the  end of the modalHeaderBg transformation and show the modal content
                self.animating = false;
                Util.addClass(self.modal, 'cd-schedule-modal--animation-completed');
                self.modalHeaderBg.removeEventListener('transitionend', cb);
            });
        }

        //if browser do not support transitions -> no need to wait for the end of it
        this.animationFallback();
    };

    ScheduleTemplate.prototype.closeModal = function () {
        var self = this;
        var mq = self.mq();

        var item = self.element.getElementsByClassName('cd-schedule__event--selected')[0],
            target = item.getElementsByTagName('a')[0];

        this.animating = true;

        if (mq == 'mobile') {
            Util.removeClass(this.modal, 'cd-schedule-modal--open');
            self.modal.addEventListener('transitionend', function cb() {
                Util.removeClass(self.modal, 'cd-schedule-modal--content-loaded');
                Util.removeClass(item, 'cd-schedule__event--selected');
                self.animating = false;
                self.modal.removeEventListener('transitionend', cb);
            });
        } else {
            var eventPosition = target.getBoundingClientRect(),
                eventTop = eventPosition.top,
                eventLeft = eventPosition.left,
                eventHeight = target.offsetHeight,
                eventWidth = target.offsetWidth;

            var modalStyle = window.getComputedStyle(self.modal),
                modalTop = Number(modalStyle.getPropertyValue('top').replace('px', '')),
                modalLeft = Number(modalStyle.getPropertyValue('left').replace('px', ''));

            var modalTranslateX = eventLeft - modalLeft,
                modalTranslateY = eventTop - modalTop;

            Util.removeClass(this.modal, 'cd-schedule-modal--open cd-schedule-modal--animation-completed');

            //change modal width/height and translate it
            self.modal.style.width = eventWidth + 'px'; self.modal.style.height = eventHeight + 'px'; self.modal.style.transform = 'translateX(' + modalTranslateX + 'px) translateY(' + modalTranslateY + 'px)';
            //scale down modalBodyBg element
            self.modalBodyBg.style.transform = 'scaleX(0) scaleY(1)';
            //scale down modalHeaderBg element
            // self.modalHeaderBg.setAttribute('style', 'transform: scaleY(1)');
            self.modalHeaderBg.style.transform = 'scaleY(1)';

            self.modalHeaderBg.addEventListener('transitionend', function cb() {
                //wait for the  end of the modalHeaderBg transformation and reset modal style
                Util.addClass(self.modal, 'cd-schedule-modal--no-transition');
                setTimeout(function () {
                    self.modal.removeAttribute('style');
                    self.modalBody.removeAttribute('style');
                    self.modalHeader.removeAttribute('style');
                    self.modalHeaderBg.removeAttribute('style');
                    self.modalBodyBg.removeAttribute('style');
                }, 10);
                setTimeout(function () {
                    Util.removeClass(self.modal, 'cd-schedule-modal--no-transition');
                }, 20);
                self.animating = false;
                Util.removeClass(self.modal, 'cd-schedule-modal--content-loaded');
                Util.removeClass(item, 'cd-schedule__event--selected');
                self.modalHeaderBg.removeEventListener('transitionend', cb);
            });
        }

        //if browser do not support transitions -> no need to wait for the end of it
        this.animationFallback();
    };

    ScheduleTemplate.prototype.checkEventModal = function (modalOpen) {
        // this function is used on resize to reset events/modal style
        this.animating = true;
        var self = this;
        var mq = this.mq();
        if (mq == 'mobile') {
            //reset modal style on mobile
            self.modal.removeAttribute('style');
            self.modalBody.removeAttribute('style');
            self.modalHeader.removeAttribute('style');
            self.modalHeaderBg.removeAttribute('style');
            self.modalBodyBg.removeAttribute('style');
            Util.removeClass(self.modal, 'cd-schedule-modal--no-transition');
            self.animating = false;
        } else if (mq == 'desktop' && modalOpen) {
            Util.addClass(self.modal, 'cd-schedule-modal--no-transition cd-schedule-modal--animation-completed');
            var item = self.element.getElementsByClassName('cd-schedule__event--selected')[0],
                target = item.getElementsByTagName('a')[0];

            var eventPosition = target.getBoundingClientRect(),
                eventTop = eventPosition.top,
                eventLeft = eventPosition.left,
                eventHeight = target.offsetHeight,
                eventWidth = target.offsetWidth;

            var windowWidth = window.innerWidth,
                windowHeight = window.innerHeight;

            var modalWidth = (windowWidth * .8 > self.modalMaxWidth) ? self.modalMaxWidth : windowWidth * .8,
                modalHeight = (windowHeight * .8 > self.modalMaxHeight) ? self.modalMaxHeight : windowHeight * .8;

            var HeaderBgScaleY = modalHeight / eventHeight,
                BodyBgScaleX = (modalWidth - eventWidth);


            setTimeout(function () {
                self.modal.setAttribute('style', 'top:' + (windowHeight / 2 - modalHeight / 2) + 'px;left:' + (windowWidth / 2 - modalWidth / 2) + 'px;height:' + modalHeight + 'px;width:' + modalWidth + 'px;transform: translateY(0) translateX(0)');
                //change modal modalBodyBg height/width
                self.modalBodyBg.style.height = modalHeight + 'px'; self.modalBodyBg.style.transform = 'scaleY(1) scaleX(' + BodyBgScaleX + ')'; self.modalBodyBg.style.width = '1px';
                //set modalHeader width
                self.modalHeader.setAttribute('style', 'width:' + eventWidth + 'px');
                //set modalBody left margin
                self.modalBody.setAttribute('style', 'margin-left:' + eventWidth + 'px');
                //change modal modalHeaderBg height/width and scale it
                self.modalHeaderBg.setAttribute('style', 'height: ' + eventHeight + 'px;width:' + eventWidth + 'px; transform:scaleY(' + HeaderBgScaleY + ');');
            }, 10);

            setTimeout(function () {
                Util.removeClass(self.modal, 'cd-schedule-modal--no-transition');
                self.animating = false;
            }, 20);

        }
    };
    ScheduleTemplate.prototype.addCourseInfo = function (content) {
        var self = this;
        let course = JSON.parse(content)
        switch (course.timeinfo.flag) {
            case 1:
                flag = '单周';
                break;
            case 2:
                flag = '双周'
                break;
            default:
                flag = '每周';
        }
        CourseInfo = `
        <div>
            <h1>详细信息</h1>
            <h2>任课老师：${course.teacher}</h2>
            <h2>上课教室：${course.location}</h2>
            <h2>开始结束周：${course.timeinfo.start} - ${course.timeinfo.end}</h2>
            <h2>周次：${flag}</h2>
        </div>
        `
        self.modal.getElementsByClassName('cd-schedule-modal__event-info')[0].innerHTML = CourseInfo;
        Util.addClass(self.modal, 'cd-schedule-modal--content-loaded');
    }

    ScheduleTemplate.prototype.getEventContent = function (string) {
        // reset the loaded event content so that it can be inserted in the modal
        var div = document.createElement('div');
        div.innerHTML = string.trim();
        return div.getElementsByClassName('cd-schedule-modal__event-info')[0].innerHTML;
    };

    ScheduleTemplate.prototype.animationFallback = function () {
        if (!this.supportAnimation) { // fallback for browsers not supporting transitions
            var event = new CustomEvent('transitionend');
            self.modal.dispatchEvent(event);
            self.modalHeaderBg.dispatchEvent(event);
        }
    };

    ScheduleTemplate.prototype.mq = function () {
        //get MQ value ('desktop' or 'mobile') 
        var self = this;
        return window.getComputedStyle(this.element, '::before').getPropertyValue('content').replace(/'|"/g, "");
    };

    function getScheduleTimestamp(time) {
        //accepts hh:mm format - convert hh:mm to timestamp
        time = time.replace(/ /g, '');
        var timeArray = time.split(':');
        var timeStamp = parseInt(timeArray[0]) * 60 + parseInt(timeArray[1]);
        return timeStamp;
    };

    function renderSchedule() {
        for (var i = 0; i < scheduleTemplateArray.length; i++) {
            scheduleTemplateArray[i].initSchedule();
            scheduleTemplateArray[i].placeEvents();
        }
    }

    // 导出渲染课程表函数
    window.renderSchedule = renderSchedule

    var scheduleTemplate = document.getElementsByClassName('js-cd-schedule'),
        scheduleTemplateArray = [],
        resizing = false;
    if (scheduleTemplate.length > 0) { // init ScheduleTemplate objects
        for (var i = 0; i < scheduleTemplate.length; i++) {
            (function (i) {
                scheduleTemplateArray.push(new ScheduleTemplate(scheduleTemplate[i]));
            })(i);
        }

        window.addEventListener('resize', function (event) {
            // on resize - update events position and modal position (if open)
            if (!resizing) {
                resizing = true;
                (!window.requestAnimationFrame) ? setTimeout(checkResize, 250) : window.requestAnimationFrame(checkResize);
            }
        });

        window.addEventListener('keyup', function (event) {
            // close event modal when pressing escape key
            if (event.keyCode && event.keyCode == 27 || event.key && event.key.toLowerCase() == 'escape') {
                for (var i = 0; i < scheduleTemplateArray.length; i++) {
                    scheduleTemplateArray[i].closeModal();
                }
            }
        });

        function checkResize() {
            for (var i = 0; i < scheduleTemplateArray.length; i++) {
                scheduleTemplateArray[i].scheduleReset();
            }
            resizing = false;
        };
    }

}(window));
let search = document.getElementById("search")
let form = document.getElementById("search-form")

HTMLFormElement.prototype.serialize = function () {
    var form = this;
    // 表单数据
    var arrFormData = [], objFormData = {};

    [].slice.call(form.elements).forEach(function (ele) {
        // 元素类型和状态
        var type = ele.type, disabled = ele.disabled;

        // 元素的键值
        var name = ele.name, value = encodeURIComponent(ele.value || '');

        // name参数必须，元素非disabled态，一些类型忽略
        if (!name || disabled || !type || (/^reset|submit|image$/i.test(type)) || (/^checkbox|radio$/i.test(type) && !ele.checked)) {
            return;
        }

        type = type.toLowerCase();

        if (type !== 'select-multiple') {
            if (objFormData[name]) {
                objFormData[name].push(value);
            } else {
                objFormData[name] = [value];
            }
        } else {
            [].slice.call(ele.querySelectorAll('option')).forEach(function (option) {
                var optionValue = encodeURIComponent(option.value || 'on');
                if (option.selected) {
                    if (objFormData[name]) {
                        objFormData[name].push(optionValue);
                    } else {
                        objFormData[name] = [optionValue];
                    }
                }
            });
        }
    });

    for (var key in objFormData) {
        arrFormData.push(key + '=' + objFormData[key].join('第'));
    }

    return arrFormData.join('&');
};

function createlist(ele) {
    let courses_list = document.getElementById("courses_list")
    if (courses_list == null) {
        let html = `
                <table class="table table--expanded@sm js-table width-100%" aria-label="Table Example">
                    <thead class="table__header table__header--sticky">
                      <tr class="table__row">
                        <th class="table__cell text-left" scope="col">状态</th>
                        <th class="table__cell text-left" scope="col">课程名</th>
                        <th class="table__cell text-left" scope="col">任课教师</th>
                        <th class="table__cell text-left" scope="col">上课地点</th>
                        <th class="table__cell text-left" scope="col">上课时间</th>
                        <th class="table__cell text-left" scope="col">Action</th>
                      </tr>
                    </thead>
                    
                    <tbody class="table__body" id="courses_list">

                    </tbody>
                </table>`
        ele.insertAdjacentHTML('beforeend', html)
    }
}

function empty() {
    let courses_list = document.getElementById("courses_list")
    if (courses_list != null) {
        courses_list.innerHTML = ""
    }
}

function insert2list(ele, data) {
    let coursestr = JSON.stringify(data)
    let html = `
    <tr class="table__row">
        <td class="table__cell" role="cell">${data.status}</td>  
        <td class="table__cell" role="cell">${data.title}</td>        
        <td class="table__cell" role="cell">${data.teacher}</td>        
        <td class="table__cell" role="cell">${data.location}</td>
        <td class="table__cell" role="cell">${data.time}</td>              
        <td class="table__cell" role="cell"> 
            <button class="btn btn--subtle" onclick="select(this)" data-content='${coursestr}'>
            <span class="btn__content-a">选择</span>
                              
            <span class="btn__content-b">
              <svg class="icon icon--is-spinning" aria-hidden="true" viewBox="0 0 16 16"><title>Loading</title><g stroke-width="1" fill="currentColor" stroke="currentColor"><path d="M.5,8a7.5,7.5,0,1,1,1.91,5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path></g></svg>
            </span>
            <span class="btn__content-c">成功</span>
            <span class="btn__content-d">课程冲突</span>
            </button>
        </td>
    </tr>`
    ele.insertAdjacentHTML('beforeend', html)
}

function is_course_exist(start, place) {
    let column = document.getElementById(place)
    let a_list = column.getElementsByTagName('a')
    for(let i = 0; i < a_list.length; i++) {
        if (a_list[i].getAttribute('data-start') == start) {
            return true
        }
    }
    return false
}

function select(obj) {
    Util.addClass(obj, 'btn--state-b')
    let str = obj.getAttribute('data-content')
    let json = JSON.parse(str)
    let html = create(json)
    let place = findplace(json.timeinfo.weekday)
    if (is_course_exist(json.timeinfo.start, place)) {
        Util.removeClass(obj, 'btn--state-b')
        Util.addClass(obj, 'btn--state-d')
    } else {
        insert(place, html)
        renderSchedule()
        Util.removeClass(obj, 'btn--state-b')
        Util.addClass(obj, 'btn--state-c')
    }
}

search.addEventListener('click', function (e) {
    e.preventDefault();
    Util.addClass(search, 'btn--state-b')
    empty()
    query = form.serialize()
    search_div = document.getElementById("search_div")
    axios.get('https://api.limxw.com/courses/query?' + query)
        .then(function (resp) {
            createlist(search_div)
            renderTable()
            courses_list = document.getElementById("courses_list")
            resp.data.forEach(course => {
                insert2list(courses_list, course)
            })
            Util.removeClass(search, 'btn--state-b')
        })
        .catch(function (err) {
            console.log(err)
        })
});
// File#: _1_table
// Usage: codyhouse.co/license
//(function() {
tableExpandedLayoutClass = 'table--expanded';
function initTable(table) {
    checkTableLayour(table); // switch from a collapsed to an expanded layout
    Util.addClass(table, 'table--loaded'); // show table

    // custom event emitted when window is resized
    table.addEventListener('update-table', function (event) {
        checkTableLayour(table);
    });
};

function checkTableLayour(table) {
    var layout = getComputedStyle(table, ':before').getPropertyValue('content').replace(/\'|"/g, '');
    Util.toggleClass(table, tableExpandedLayoutClass, layout != 'collapsed');
};

function renderTable() {

    var tables = document.getElementsByClassName('js-table')
    if (tables.length > 0) {
        var j = 0;
        for (var i = 0; i < tables.length; i++) {
            var beforeContent = getComputedStyle(tables[i], ':before').getPropertyValue('content');
            if (beforeContent && beforeContent != '' && beforeContent != 'none') {
                (function (i) { initTable(tables[i]); })(i);
                j = j + 1;
            } else {
                Util.addClass(tables[i], 'table--loaded');
            }
        }

        if (j > 0) {
            var resizingId = false,
                customEvent = new CustomEvent('update-table');
            window.addEventListener('resize', function (event) {
                clearTimeout(resizingId);
                resizingId = setTimeout(doneResizing, 300);
            });

            function doneResizing() {
                for (var i = 0; i < tables.length; i++) {
                    (function (i) { tables[i].dispatchEvent(customEvent) })(i);
                };
            };
        }
    }
}
  //}());