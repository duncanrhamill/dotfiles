(function(d){var c=function(b){this.options=d.extend({$parentEl:null,$arrowEl:null,arrowClass:"arrow-box"},b);this.setup();return this};c.prototype.setup=function(){this.options.$parentEl&&(this.options.$arrowEl=d("<div></div>").addClass(this.options.arrowClass),this.options.$parentEl.append(this.options.$arrowEl))};c.prototype.setPosition=function(b,a){this.options.$arrowEl&&(b?(this.options.$arrowEl.css("left",a+"px"),this.options.$arrowEl.css("top","")):(this.options.$arrowEl.css("left",""),this.options.$arrowEl.css("top",
a+"px")))};c.prototype.show=function(b,a){if(this.options.$arrowEl)if(b&&a){this.options.$arrowEl.removeClass("a-top a-bottom a-left a-right");switch(b){case "top":this.options.$arrowEl.addClass("a-top");this.setPosition(!0,a);break;case "bottom":this.options.$arrowEl.addClass("a-bottom");this.setPosition(!0,a);break;case "left":this.options.$arrowEl.addClass("a-left");this.setPosition(!1,a);break;case "right":this.options.$arrowEl.addClass("a-right"),this.setPosition(!1,a)}this.options.$arrowEl.show()}else this.options.$arrowEl.hide()};
c.prototype.hide=function(){this.options.$parentEl&&this.options.$parentEl.removeClass(this.options.arrowClass);this.options.$arrowEl&&this.options.$arrowEl.hide()};return window.lpArrow=c})(jQuery);
