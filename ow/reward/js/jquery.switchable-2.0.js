/* jQuery Switchable v2.0 | switchable.mrzhang.me | MIT Licensed */
(function(a) {
	function b(b, c, d) {
		var e = this,
		f = a(this),
		g = "beforeSwitch",
		h = "onSwitch";
		a.isFunction(c[g]) && f.bind(g, c[g]),
		a.isFunction(c[h]) && f.bind(h, c[h]),
		a.extend(e, {
			_initPlugins: function() {
				var b = a.switchable.Plugins,
				c = b.length,
				d = 0;
				for (; d < c; d++) b[d].init && b[d].init(e)
			},
			_init: function() {
				e.container = b,
				e.config = c,
				!c.panels || !c.panels.jquery && a.type(c.panels) !== "string" ? e.panels = b.children() : e.panels = b.find(c.panels),
				e.length = Math.ceil(e.panels.length / c.steps);
				if (e.length < 1) {
					window.console && console.warn("No panel in " + d);
					return
				}
				e.index = c.initIndex === null ? undefined: c.initIndex + (c.initIndex < 0 ? e.length: 0),
				c.effect === "none" && e.panels.slice(e.index * c.steps, (e.index + 1) * c.steps).show();
				if ( !! c.triggers) {
					var f, g, h;
					if (c.triggers.jquery) e.triggers = c.triggers.slice(0, e.length);
					else {
						var i = a.type(c.triggers) === "string",
						j = [];
						for (g = 1; g <= e.length; g++) j.push("<span>" + (i ? c.triggers: g) + "</span>");
						e.triggers = a("<div/>", {
							"class": c.triggersWrapCls,
							html: j.join("")
						})[c.putTriggers](b).find("span")
					}
					e.triggers.eq(e.index).addClass(c.currentTriggerCls);
					for (g = 0; g < e.length; g++) f = e.triggers.eq(g),
					f.click({
						index: g
					},
					function(a) {
						h = a.data.index;
						if (!e._triggerIsValid(h)) return;
						e._cancelDelayTimer(),
						e.switchTo(h)
					}),
					c.triggerType === "mouse" && f.mouseenter({
						index: g
					},
					function(a) {
						h = a.data.index;
						if (!e._triggerIsValid(h)) return;
						e._delayTimer = setTimeout(function() {
							e.switchTo(h)
						},
						c.delay * 1e3)
					}).mouseleave(function() {
						e._cancelDelayTimer()
					})
				}
			},
			_triggerIsValid: function(a) {
				return e.index !== a
			},
			_cancelDelayTimer: function() {
				e._delayTimer && (clearTimeout(e._delayTimer), e._delayTimer = undefined)
			},
			_switchTrigger: function(a, b) {
				e.triggers.eq(a).removeClass(c.currentTriggerCls).end().eq(b).addClass(c.currentTriggerCls)
			},
			_switchPanels: function(b, d, f) {
				a.switchable.Effects[c.effect].call(e, b, d, f)
			},
			willTo: function(a) {
				return a ? e.index > 0 ? e.index - 1 : c.loop ? e.length - 1 : !1 : e.index < e.length - 1 ? e.index + 1 : c.loop ? 0 : !1
			},
			switchTo: function(b, d) {
				var i = a.Event(g);
				f.trigger(i, [b]);
				if (i.isDefaultPrevented()) return;
				return e._switchPanels(e.index, b, d),
				!c.triggers || e._switchTrigger(e.index, b),
				e.index = b,
				i.type = h,
				f.trigger(i, [b]),
				e
			}
		}),
		e._init(),
		e._initPlugins()
	}
	a.switchable = {
		Config: {
			triggers: !0,
			putTriggers: "insertAfter",
			triggersWrapCls: "triggers",
			currentTriggerCls: "current",
			panels: null,
			steps: 1,
			triggerType: "mouse",
			delay: 10,
			initIndex: 0,
			effect: "none",
			easing: "ease",
			duration: .5,
			loop: !0,
			beforeSwitch: null,
			onSwitch: null,
			api: !1
		},
		Effects: {
			none: function(a, b) {
				var c = this,
				d = c.config;
				c.panels.slice(a * d.steps, (a + 1) * d.steps).hide().end().slice(b * d.steps, (b + 1) * d.steps).show()
			}
		},
		Plugins: []
	},
	a.fn.switchable = function(c) {
		var d = a(this),
		e = d.length,
		f = d.selector,
		g = [],
		h;
		c = a.extend({},
		a.switchable.Config, c),
		c.effect = c.effect.toLowerCase();
		for (h = 0; h < e; h++) g[h] = new b(d.eq(h), c, f + "[" + h + "]");
		return c.api ? g[0] : d
	}
})(jQuery),
function(a) {
	function b() {
		var a = document.documentElement,
		b = ["Webkit", "Moz"],
		c = "transition",
		d = "",
		e;
		if (a.style[c] !== undefined) d = c;
		else for (e = 0; e < 2; e++) if (a.style[c = b[e] + "Transition"] !== undefined) {
			d = c;
			break
		}
		return d
	}
	a.switchable.Anim = function(c, d, e, f, g, h) {
		var i = this,
		j = {},
		k, l;
		a.switchable.Transition === undefined && (a.switchable.Transition = b()),
		k = a.switchable.Transition,
		a.extend(i, {
			isAnimated: !1,
			run: function() {
				if (i.isAnimated) return;
				e = e * 1e3;
				if (k) j[k + "Property"] = h || "all",
				j[k + "Duration"] = e + "ms",
				j[k + "TimingFunction"] = f,
				c.css(a.extend(d, j)),
				l = setTimeout(function() {
					i._clearCss(),
					i._complete()
				},
				e);
				else {
					var b = /cubic-bezier\(([\s\d.,]+)\)/,
					g = f.match(b),
					m = a.switchable.TimingFn[f];
					if (m || g) f = a.switchable.Easing(g ? g[1] : m.match(b)[1]);
					c.animate(d, e, f,
					function() {
						i._complete()
					})
				}
				return i.isAnimated = !0,
				i
			},
			stop: function(a) {
				if (!i.isAnimated) return;
				return k ? (clearTimeout(l), l = undefined) : c.stop(!1, a),
				i.isAnimated = !1,
				i
			},
			_complete: function() {
				g && g()
			},
			_clearCss: function() {
				j[k + "Property"] = "none",
				c.css(j)
			}
		})
	}
} (jQuery),
function(a) {
	function b(a) {
		return "cubic-bezier(" + a + ")"
	}
	function c(a) {
		var b = [],
		c = 101,
		d;
		for (d = 0; d <= c; d++) b[d] = a.call(null, d / c);
		return function(a) {
			if (a === 1) return b[c];
			var d = c * a,
			e = Math.floor(d),
			f = b[e],
			g = b[e + 1];
			return f + (g - f) * (d - e)
		}
	}
	function d(a, b, c, d, e, f) {
		function h(a) {
			return ((g * a + bx) * a + cx) * a
		}
		function i(a) {
			return ((ay * a + by) * a + cy) * a
		}
		function j(a) {
			return (3 * g * a + 2 * bx) * a + cx
		}
		function k(a) {
			return 1 / (200 * a)
		}
		function l(a, b) {
			return i(m(a, b))
		}
		function m(a, b) {
			function k(a) {
				return a >= 0 ? a: 0 - a
			}
			var c, d, e, f, g, i;
			for (e = a, i = 0; i < 8; i++) {
				f = h(e) - a;
				if (k(f) < b) return e;
				g = j(e);
				if (k(g) < 1e-6) break;
				e = e - f / g
			}
			c = 0,
			d = 1,
			e = a;
			if (e < c) return c;
			if (e > d) return d;
			while (c < d) {
				f = h(e);
				if (k(f - a) < b) return e;
				a > f ? c = e: d = e,
				e = (d - c) * .5 + c
			}
			return e
		}
		var g = bx = cx = ay = by = cy = 0;
		return cx = 3 * b,
		bx = 3 * (d - b) - cx,
		g = 1 - cx - bx,
		cy = 3 * c,
		by = 3 * (e - c) - cy,
		ay = 1 - cy - by,
		l(a, k(f))
	}
	a.switchable.TimingFn = {
		ease: b(".25, .1, .25, 1"),
		linear: b("0, 0, 1, 1"),
		"ease-in": b(".42, 0, 1, 1"),
		"ease-out": b("0, 0, .58, 1"),
		"ease-in-out": b(".42, 0, .58, 1")
	},
	a.switchable.Easing = function(e) {
		var f, g, h = 0;
		e = e.split(","),
		g = e.length;
		for (; h < g; h++) e[h] = parseFloat(e[h]);
		if (g !== 4) window.console && console.warn(b(e.join(", ")) + " missing argument.");
		else {
			f = "cubic-bezier-" + e.join("-");
			if (!a.easing[f]) {
				var i = c(function(a) {
					return d(a, e[0], e[1], e[2], e[3], 5)
				});
				a.easing[f] = function(a, b, c, d) {
					return i.call(null, a)
				}
			}
		}
		return f
	}
} (jQuery),
function(a) {
	a.extend(a.switchable.Config, {
		autoplay: !1,
		interval: 3,
		pauseOnHover: !0
	}),
	a.switchable.Plugins.push({
		name: "autoplay",
		init: function(b) {
			function h() {
				g = b.willTo(b.isBackward);
				if (g === !1) {
					b._cancelTimers();
					return
				}
				b.switchTo(g, b.isBackward ? "backward": "forward")
			}
			function i() {
				f = setInterval(function() {
					h()
				},
				(c.interval + c.duration) * 1e3)
			}
			var c = b.config,
			d = !1,
			e, f, g;
			if (!c.autoplay || b.length <= 1) return;
			c.pauseOnHover && b.panels.add(b.triggers).hover(function() {
				b._pause()
			},
			function() {
				d || b._play()
			}),
			a.extend(b, {
				_play: function() {
					b._cancelTimers(),
					b.paused = !1,
					e = setTimeout(function() {
						h(),
						i()
					},
					c.interval * 1e3)
				},
				_pause: function() {
					b._cancelTimers(),
					b.paused = !0
				},
				_cancelTimers: function() {
					e && (clearTimeout(e), e = undefined),
					f && (clearInterval(f), f = undefined)
				},
				play: function() {
					return b._play(),
					d = !1,
					b
				},
				pause: function() {
					return b._pause(),
					d = !0,
					b
				}
			}),
			b._play()
		}
	})
} (jQuery),
function(a) {
	a.extend(a.switchable.Config, {
		prev: null,
		next: null
	}),
	a.switchable.Plugins.push({
		name: "carousel",
		init: function(b) {
			var c = b.config,
			d = ["backward", "forward"],
			e = ["prev", "next"],
			f,
			g,
			h,
			i = 0;
			if (!c.prev && !c.next) return;
			for (; i < 2; i++) f = e[i],
			g = c[f],
			g && (h = b[f + "Btn"] = g.jquery ? g: a(g), h.click({
				direction: d[i]
			},
			function(a) {
				a.preventDefault();
				if (!b.anim) {
					var c = a.data.direction,
					e = b.willTo(c === d[0]);
					e !== !1 && b.switchTo(e, c)
				}
			}))
		}
	})
} (jQuery),
function(a) {
	a.switchable.Effects.fade = function(b, c) {
		var d = this,
		e = d.config,
		f = d.panels,
		g = f.eq(b),
		h = f.eq(c);
		d.anim && (d.anim.stop(), f.eq(d.anim.to).css({
			zIndex: d.length
		}).end().eq(d.anim.from).css({
			opacity: 0,
			zIndex: 1
		})),
		h.css({
			opacity: 1
		}),
		d.anim = (new a.switchable.Anim(g, {
			opacity: 0
		},
		e.duration, e.easing,
		function() {
			h.css({
				zIndex: d.length
			}),
			g.css({
				zIndex: 1
			}),
			d.anim = undefined
		},
		"opacity")).run(),
		d.anim.from = b,
		d.anim.to = c
	},
	a.switchable.Plugins.push({
		name: "fade effect",
		init: function(a) {
			var b = a.config,
			c = a.panels.eq(a.index);
			if (b.effect !== "fade" || b.steps !== 1) return;
			a.panels.not(c).css({
				opacity: 0,
				zIndex: 1
			}),
			c.css({
				opacity: 1,
				zIndex: a.length
			})
		}
	})
} (jQuery),
function(a) {
	var b = ["scrollleft", "scrollright", "scrollup", "scrolldown"],
	c = "position",
	d = "absolute",
	e = "relative";
	a.extend(a.switchable.Config, {
		end2end: !1,
		groupSize: [],
		visible: null,
		clonedCls: "switchable-cloned"
	});
	for (var f = 0; f < 4; f++) a.switchable.Effects[b[f]] = function(b, c, d) {
		var e = this,
		f = e.config,
		g = e.length - 1,
		h = d === "backward",
		i = f.end2end && (h && b === 0 && c === g || d === "forward" && b === g && c === 0),
		j = {};
		j[e.isHoriz ? "left": "top"] = i ? e._adjustPosition(h) : -e.groupSize[e.isHoriz ? 0 : 1] * c,
		e.anim && e.anim.stop(),
		e.anim = (new a.switchable.Anim(e.panels.parent(), j, f.duration, f.easing,
		function() {
			i && e._resetPosition(h),
			e.anim = undefined
		})).run()
	};
	a.switchable.Plugins.push({
		name: "scroll effect",
		init: function(f) {
			var g = f.config,
			h = g.steps,
			i = f.panels,
			j = i.parent(),
			k = a.inArray(g.effect, b),
			l = k === 0 || k === 1,
			m = i.eq(0).outerWidth(!0),
			n = i.eq(0).outerHeight(!0),
			o = l ? 0 : 1,
			p = f.length - 1,
			q = l ? "left": "top",
			r = {};
			if (k === -1) return;
			f.groupSize = [g.groupSize[0] || m * h, g.groupSize[1] || n * h];
			if (g.end2end) {
				var s = i.length,
				t = !l && g.groupSize[0] ? f.groupSize[o] * f.length: (l ? m: n) * s,
				u = s - p * h,
				v = (l ? m: n) * u,
				w = !l && g.groupSize[0] ? f.groupSize[o] : v,
				x;
				g.loop = !0,
				g.visible && g.visible < s && g.visible > u && i.slice(0, g.visible).clone(!0).addClass(g.clonedCls).appendTo(j).click(function(b) {
					b.preventDefault(),
					i.eq(a(this).index() - s).click()
				}),
				a.extend(f, {
					_adjustPosition: function(a) {
						return x = a ? p: 0,
						r[c] = e,
						r[q] = (a ? -1 : 1) * t,
						i.slice(x * h, (x + 1) * h).css(r),
						a ? w: -t
					},
					_resetPosition: function(a) {
						x = a ? p: 0,
						r[c] = "",
						r[q] = "",
						i.slice(x * h, (x + 1) * h).css(r),
						r[c] = undefined,
						r[q] = a ? -f.groupSize[o] * p: 0,
						j.css(r)
					}
				})
			}
			f.container.css(c) == "static" && f.container.css(c, e),
			r[c] = d,
			r[q] = -f.groupSize[o] * f.index,
			j.css(r).css("width", l ? 2 * f.groupSize[o] * f.length: g.groupSize[0] ? g.groupSize[0] : undefined),
			f.isHoriz = l,
			f.isBackward = k === 1 || k === 3
		}
	})
} (jQuery),
function(a) {
	var b = ["accordion", "horizaccordion"],
	c = [["height", "marginTop", "marginBottom", "paddingTop", "paddingBottom", "borderTopWidth", "borderBottomWidth"], ["width", "marginLeft", "marginRight", "paddingLeft", "paddingRight", "borderLeftWidth", "borderRightWidth"]];
	a.extend(a.switchable.Config, {
		multiple: !1,
		customProps: {}
	});
	for (var d = 0; d < 2; d++) a.switchable.Effects[b[d]] = function(b, c) {
		var d = this,
		e = d.config,
		f = b !== c;
		d.anim && d.anim.stop(f),
		d.anim = (new a.switchable.Anim(d.panels.eq(c), d.triggers.eq(c).hasClass(e.currentTriggerCls) ? d.collapseProps: d.expandProps[c], e.duration, e.easing,
		function() {
			d.anim = undefined
		})).run(),
		!e.multiple && b !== undefined && f && (d.anim2 && d.anim2.stop(f), d.anim2 = (new a.switchable.Anim(d.panels.eq(b), d.collapseProps, e.duration, e.easing,
		function() {
			d.anim2 = undefined
		})).run())
	};
	a.switchable.Plugins.push({
		name: "accordion effect",
		init: function(d) {
			var e = d.config,
			f = a.inArray(e.effect, b);
			if (f === -1 || e.steps !== 1) return;
			window.console && console.info("Remember to set the border-width for the accordion's panels, even without border."),
			a.extend(d, {
				_triggerIsValid: function(a) {
					return ! 0
				},
				_switchTrigger: function(a, b) {
					var c = d.triggers,
					f = e.currentTriggerCls;
					c.eq(b).toggleClass(f),
					!e.multiple && a !== undefined && a !== b && c.eq(a).removeClass(f)
				}
			}),
			d.expandProps = [],
			d.collapseProps = {};
			var g = c[f].length,
			h = {},
			i,
			j,
			k;
			for (k = 0; k < g; k++) d.collapseProps[c[f][k]] = 0;
			a.extend(d.collapseProps, e.customProps);
			for (k = 0; k < d.length; k++) {
				i = d.panels.eq(k);
				for (var l = 0; l < g; l++) j = c[f][l],
				h[j] = i.css(j);
				d.expandProps.push(a.extend({},
				h)),
				i.css(a.extend({
					overflow: "hidden"
				},
				k === d.index ? h: d.collapseProps))
			}
		}
	})
} (jQuery);