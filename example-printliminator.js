! function() {
    "use strict";
    var a = window.thePrintliminator = {
        version: "{version}",
        css: {
            hilite: "_printliminator_highlight",
            fullWidth: "_printliminator_full_width",
            hidden: "_printliminator_hidden",
            stylized: "_printliminator_stylized",
            messages: "_printliminator_messages",
            noSelection: "_printliminator_no_selection",
            stylesheet: "_printliminator_styles",
            wrap: "_printliminator_wrap",
            controls: "_printliminator_controls",
            drag: "_printliminator_drag_icon",
            dragActive: "_printliminator_drag_active",
            icon: "icon",
            noGraphics: "no_graphics",
            stylize: "stylize",
            print: "print",
            close: "close",
            undo: "undo",
            busy: "busy",
            keyboard: "keyboard",
            toggle: "toggle"
        },
        keys: {
            parent1: 33,
            parent2: 38,
            child1: 34,
            child2: 40,
            nextSib: 39,
            prevSib: 37,
            hide: 13,
            undo: 8,
            fontUp1: 107,
            fontUp2: 187,
            fontDown1: 109,
            fontDown2: 189,
            fontReset1: 106,
            fontReset2: 56,
            print: 44,
            abort: 27,
            opposite: "altKey",
            fullWidth: "shiftKey"
        },
        noGraphics: "img, iframe:not(._printliminator_controls), object, embed, audio, video, input[type=image], svg",
        ignoredElm: /^(br|meta|style|link|script)$/i,
        keyboardOpen: 615,
        keyboardClosed: 220,
        drag: {
            el: null,
            pos: [0, 0],
            elm: [0, 0]
        },
        init: function() {
            var b = document.body;
            "undefined" == typeof window.thePrintliminatorVars && (window.thePrintliminatorVars = {
                init: !0,
                history: [],
                messageCache: [],
                flags: {}
            }, a.addStyles()), a.addControls(), a.addEvent(b, "click", a.bodyClick), a.addEvent(b, "mouseover", a.bodyMouseover), a.addEvent(b, "mouseout", a.removeHighlight), a.addEvent(document, "keyup", a.bodyKeyUp), a.addEvent(document, "keydown", a.bodyKeyDown), a.addEvent(document, "mouseup", a.docMouseUp), a.addEvent(document, "mousemove", a.docMouseMove)
        },
        bodyClick: function(b) {
            if (b.preventDefault(), b.stopImmediatePropagation(), "BODY" !== b.target.nodeName && !a.hasClass(b.target, a.css.messages)) {
                var c, d, e = !1,
                    f = (a.messages, document.body.querySelector("." + a.css.hilite));
                if (b[a.keys.fullWidth]) a.hasClass(f, a.css.fullWidth) || (a.addClass(f, a.css.fullWidth), thePrintliminatorVars.history.push(function() {
                    a.removeClass(f, a.css.fullWidth)
                }));
                else {
                    if (b[a.keys.opposite]) {
                        if (c = a.getOpposite(f), d = c.length, !d) return;
                        e = !0
                    } else c = [f];
                    a.hide(c), thePrintliminatorVars.history.push(c), e && a.removeClass(document.querySelector("ul." + a.css.messages), a.css.hidden)
                }
                a.clearSelection()
            }
        },
        bodyMouseover: function(b) {
            a.hasClass(b.target, a.css.controls) || a.addClass(b.target, a.css.hilite), window.focus()
        },
        bodyKeyUp: function(b) {
            switch (b.preventDefault(), b.which) {
                case a.keys.print:
                    a.print()
            }
        },
        bodyKeyDown: function(b) {
            b.preventDefault();
            var c, d, e, f, g, h = document.body,
                i = (a.messages, h.querySelector("." + a.css.hilite)),
                j = a.css.hidden,
                k = a.css.hilite;
            if (i) switch (g = "BODY" === i.nodeName, b.which) {
                case a.keys.parent1:
                case a.keys.parent2:
                    f = i.parentNode, !g && f && (a.removeClass(i, k), a.addClass(f, k));
                    break;
                case a.keys.child1:
                case a.keys.child2:
                    e = a.getFirstChild(i), e && (a.removeClass(i, k), a.addClass(e, k));
                    break;
                case a.keys.nextSib:
                    e = a.getNext(i), !g && e && (a.removeClass(i, k), a.addClass(e, k));
                    break;
                case a.keys.prevSib:
                    e = a.getPrev(i), !g && e && (a.removeClass(i, k), a.addClass(e, k));
                    break;
                case a.keys.hide:
                    g || (a.addClass(i, j), a.addClass(i.parentNode, k), thePrintliminatorVars.history.push(i))
            }
            switch (c = window.getComputedStyle(h, null).getPropertyValue("font-size"), d = c.match(/[a-z]+/i)[0], b.which) {
                case a.keys.fontUp1:
                case a.keys.fontUp2:
                    h.style.fontSize = parseFloat(c) + 1 + d;
                    break;
                case a.keys.fontDown1:
                case a.keys.fontDown2:
                    h.style.fontSize = parseFloat(c) - 1 + d;
                    break;
                case a.keys.fontReset1:
                case a.keys.fontReset2:
                    h.style.fontSize = "";
                    break;
                case a.keys.undo:
                    a.undo();
                    break;
                case a.keys.abort:
                    a.abort()
            }
        },
        filterElements: function(b) {
            return b && 1 === b.nodeType && !a.ignoredElm.test(b.nodeName) && !a.hasClass(b, a.css.controls) && !(a.hasClass(b, a.css.hidden) || "none" === b.style.display)
        },
        getOpposite: function(b) {
            for (var c, d = [];
                "BODY" !== b.nodeName;) c = a.getSiblings(b), d = d.concat(c), b = b.parentNode;
            return d
        },
        getFirstChild: function(b) {
            var c = Array.prototype.filter.call(b.children, a.filterElements);
            return c.length ? c[0] : null
        },
        getSiblings: function(b) {
            for (var c = [], d = b.parentNode.firstChild; d; d = d.nextSibling) d !== b && a.filterElements(d) && c.push(d);
            return c
        },
        getNext: function(b) {
            for (; b = b.nextSibling;)
                if (b && a.filterElements(b)) return b;
            return null
        },
        getPrev: function(b) {
            for (; b = b.previousSibling;)
                if (b && a.filterElements(b)) return b;
            return null
        },
        removeHighlight: function() {
            var b, c = document.querySelectorAll("." + a.css.hilite),
                d = c.length;
            for (b = 0; d > b; b++) a.removeClass(c[b], a.css.hilite)
        },
        removeGraphics: function(b, c) {
            if (!thePrintliminatorVars.flags.removeGraphics) {
                c = c || document.body;
                var d, e, f = [],
                    g = c.querySelectorAll(a.noGraphics),
                    h = c.querySelectorAll("*:not(." + a.css.controls + ")"),
                    i = h.length;
                for (d = 0; i > d; d++) e = window.getComputedStyle(h[d]).getPropertyValue("background-image"), e && "none" !== e && (f.push([h[d], e]), h[d].style.backgroundImage = "none");
                a.removeHighlight(), a.hide(g), thePrintliminatorVars.flags.removeGraphics = !0, thePrintliminatorVars.history.push(function() {
                    for (thePrintliminatorVars.flags.removeGraphics = !1, a.show(g), i = f.length, d = 0; i > d; d++) f[d][0].style.backgroundImage = f[d][1]
                })
            }
        },
        stylize: function() {
            if (!thePrintliminatorVars.flags.stylize) {
                var b, c = [],
                    d = document.body,
                    e = document.querySelectorAll('link[rel="stylesheet"]'),
                    f = document.querySelectorAll("body *:not(." + a.css.hidden + "):not(." + a.css.controls + ")"),
                    g = e.length;
                for (b = 0; g > b; b++) e[b].id !== a.css.stylesheet && (e[b].disabled = !0);
                Array.prototype.filter.call(f, function(a) {
                    var b = a.getAttribute("style");
                    null !== b && (a.removeAttribute("style"), c.push({
                        el: a,
                        style: b
                    }))
                }), a.addClass(d, a.css.stylized), a.removeHighlight(), thePrintliminatorVars.flags.stylize = !0, thePrintliminatorVars.history.push(function() {
                    thePrintliminatorVars.flags.stylize = !1, a.removeClass(d, a.css.stylized);
                    var b, f = e.length;
                    for (b = 0; f > b; b++) e[b].disabled = !1;
                    for (f = c.length, b = 0; f > b; b++) c[b].el.setAttribute("style", c[b].style)
                })
            }
        },
        print: function() {
            var b = document.body.querySelector("iframe." + a.css.controls).contentWindow.document;
            a.addClass(b.querySelector("li." + a.css.print), a.css.busy), a.removeHighlight(), setTimeout(function() {
                window.print(), a.busy(function() {
                    a.removeClass(b.querySelector("li." + a.css.print), a.css.busy)
                })
            }, 10)
        },
        busy: function(a) {
            if ("complete" !== document.readyState) {
                var b = function(c) {
                    setTimeout(function() {
                        ("complete" === document.readyState || 1 === c) && (a(), c = 0), --c > 0 && b(c)
                    }, 1e3)
                };
                b(20)
            } else a()
        },
        undo: function() {
            var b = thePrintliminatorVars.history.pop();
            b && (a.removeHighlight(), "function" != typeof b ? a.show(b) : b.call())
        },
        abort: function() {
            var b = document.body;
            a.removeHighlight(), a.removeClass(b, a.css.enabled), a.removeEvent(b, "click", a.bodyClick), a.removeEvent(b, "mouseover", a.bodyMouseover), a.removeEvent(b, "mouseout", a.removeHighlight), a.removeEvent(document, "keyup", a.bodyKeyUp), a.removeEvent(document, "keydown", a.bodyKeyDown), a.removeEvent(document, "mouseup", a.docMouseUp), a.removeEvent(document, "mousemove", a.docMouseMove), b.removeChild(document.querySelector("." + a.css.wrap))
        },
        addStyles: function() {
            var b, c = (document.body, '@media print, screen { body._printliminator_stylized { margin: 0 !important; padding: 0 !important; line-height: 1.4 !important; word-spacing: 1.1pt !important; letter-spacing: 0.2pt !important; font-family: Garamond, "Times New Roman", serif !important; color: #000 !important; background: none !important; font-size: 12pt !important; /*Headings */ /* Images */ /* Table */ } body._printliminator_stylized h1, body._printliminator_stylized h2, body._printliminator_stylized h3, body._printliminator_stylized h4, body._printliminator_stylized h5, body._printliminator_stylized h6 { font-family: Helvetica, Arial, sans-serif !important; } body._printliminator_stylized h1 { font-size: 19pt !important; } body._printliminator_stylized h2 { font-size: 17pt !important; } body._printliminator_stylized h3 { font-size: 15pt !important; } body._printliminator_stylized h4, body._printliminator_stylized h5, body._printliminator_stylized h6 { font-size: 12pt !important; } body._printliminator_stylized code { font: 10pt Courier, monospace !important; } body._printliminator_stylized blockquote { margin: 1.3em !important; padding: 1em !important; font-size: 10pt !important; } body._printliminator_stylized hr { background-color: #ccc !important; } body._printliminator_stylized img { float: left !important; margin: 1em 1.5em 1.5em 0 !important; } body._printliminator_stylized a img { border: none !important; } body._printliminator_stylized table { margin: 1px !important; text-align: left !important; border-collapse: collapse !important; } body._printliminator_stylized th { border: 1px solid #333 !important; font-weight: bold !important; } body._printliminator_stylized td { border: 1px solid #333 !important; } body._printliminator_stylized th, body._printliminator_stylized td { padding: 4px 10px !important; } body._printliminator_stylized tfoot { font-style: italic !important; } body._printliminator_stylized caption { background: #fff !important; margin-bottom: 20px !important; text-align: left !important; } body._printliminator_stylized thead { display: table-header-group !important; } body._printliminator_stylized tr { page-break-inside: avoid !important; } ._printliminator_hidden { display: none !important; } ._printliminator_full_width { width: 100% !important; min-width: 100% !important; max-width: 100% !important; margin: 0 !important; } } @media print { ._printliminator_wrap { display: none !important; } } @media screen { body._printliminator_stylized { padding: 20px !important; } ._printliminator_highlight { outline: 3px solid red !important; cursor: default !important; } ._printliminator_highlight._printliminator_full_width { outline-color: blue !important; } ._printliminator_wrap { width: 450px !important; height: 220px; position: fixed !important; top: 20px; right: 20px; z-index: 999999 !important; box-shadow: 0 0 80px black !important; } ._printliminator_wrap iframe { width: 450px !important; height: 220px; border: 0 !important; overflow-x: hidden !important; margin: 0 !important; padding: 0 !important; } ._printliminator_drag_icon { width: 28px !important; height: 20px !important; position: absolute !important; top: 0 !important; left: 0 !important; cursor: move !important; } ._printliminator_drag_icon._printliminator_drag_active { width: 120px !important; height: 100px !important; top: -40px !important; left: -40px !important; } body._printliminator_no_selection, ._printliminator_highlight, ._printliminator_wrap, ._printliminator_drag_icon, ._printliminator_wrap iframe { -webkit-user-select: none !important; -moz-user-select: none !important; -ms-user-select: none !important; user-select: none !important; } } ');
            b = document.createElement("style"), b.id = a.css.stylesheet, b.innerHTML = c, document.querySelector("head").appendChild(b)
        },
        addControls: function() {
            var b, c = document.body,
                d = document.createElement("div"),
                e = a.css.controls;
            c.appendChild(d), a.addClass(d, a.css.wrap), a.addClass(d, e), d.innerHTML = '<iframe class="' + e + '"></iframe><div class="' + e + " " + a.css.drag + '"></div>', b = d.querySelector("iframe." + e).contentWindow.document, b.open(), b.write('<div class="header"> <div class="close right">CLOSE <span class="icon close"></span></div> <div><span class="icon _printliminator_drag_icon"></span> DRAG</div> </div> <div class="top"> <img class="pl_logo" src="data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20134.4%208.7%22%3E%0A%3Cg%3E%0A%09%3Cpath%20d%3D%22M3%2C0.7H0.3C0.1%2C0.7%2C0%2C0.6%2C0%2C0.4c0-0.2%2C0.1-0.3%2C0.3-0.3h6c0.2%2C0%2C0.3%2C0.1%2C0.3%2C0.3c0%2C0.2-0.1%2C0.3-0.3%2C0.3H3.6v7.6%0A%09%09c0%2C0.2-0.1%2C0.3-0.3%2C0.3S3%2C8.4%2C3%2C8.3V0.7z%22%2F%3E%0A%09%3Cpath%20d%3D%22M8.4%2C0.4c0-0.2%2C0.1-0.3%2C0.3-0.3S9%2C0.2%2C9%2C0.4V4h5.4V0.4c0-0.2%2C0.1-0.3%2C0.3-0.3c0.2%2C0%2C0.3%2C0.1%2C0.3%2C0.3v7.9%0A%09%09c0%2C0.2-0.1%2C0.3-0.3%2C0.3c-0.2%2C0-0.3-0.1-0.3-0.3V4.6H9v3.7c0%2C0.2-0.1%2C0.3-0.3%2C0.3S8.4%2C8.4%2C8.4%2C8.3V0.4z%22%2F%3E%0A%09%3Cpath%20d%3D%22M17.5%2C8.2V0.5c0-0.2%2C0.1-0.3%2C0.3-0.3h5.4c0.2%2C0%2C0.3%2C0.1%2C0.3%2C0.3c0%2C0.2-0.1%2C0.3-0.3%2C0.3h-5.1V4h4.6C22.9%2C4%2C23%2C4.1%2C23%2C4.3%0A%09%09c0%2C0.2-0.1%2C0.3-0.3%2C0.3h-4.6V8h5.2c0.2%2C0%2C0.3%2C0.1%2C0.3%2C0.3c0%2C0.2-0.1%2C0.3-0.3%2C0.3h-5.5C17.7%2C8.5%2C17.5%2C8.4%2C17.5%2C8.2z%22%2F%3E%0A%09%3Cpath%20d%3D%22M29%2C0.9c0-0.4%2C0.3-0.7%2C0.7-0.7h2.6c2%2C0%2C3.2%2C1.1%2C3.2%2C2.8v0c0%2C1.9-1.5%2C2.9-3.4%2C2.9h-1.7v2c0%2C0.4-0.3%2C0.7-0.7%2C0.7%0A%09%09c-0.4%2C0-0.7-0.3-0.7-0.7V0.9z%20M32.2%2C4.5C33.3%2C4.5%2C34%2C3.9%2C34%2C3v0c0-1-0.7-1.5-1.8-1.5h-1.7v3H32.2z%22%2F%3E%0A%09%3Cpath%20d%3D%22M37%2C0.9c0-0.4%2C0.3-0.7%2C0.7-0.7h3c1.1%2C0%2C1.9%2C0.3%2C2.4%2C0.8c0.4%2C0.5%2C0.7%2C1.1%2C0.7%2C1.8v0c0%2C1.3-0.8%2C2.2-1.9%2C2.5l1.6%2C2%0A%09%09c0.1%2C0.2%2C0.2%2C0.3%2C0.2%2C0.6c0%2C0.4-0.3%2C0.7-0.7%2C0.7c-0.3%2C0-0.6-0.2-0.7-0.4l-2-2.6h-1.9v2.3c0%2C0.4-0.3%2C0.7-0.7%2C0.7%0A%09%09c-0.4%2C0-0.7-0.3-0.7-0.7V0.9z%20M40.7%2C4.3c1.1%2C0%2C1.7-0.6%2C1.7-1.4v0c0-0.9-0.6-1.4-1.7-1.4h-2.1v2.8H40.7z%22%2F%3E%0A%09%3Cpath%20d%3D%22M45.8%2C0.8c0-0.4%2C0.3-0.7%2C0.7-0.7c0.4%2C0%2C0.7%2C0.3%2C0.7%2C0.7v7.1c0%2C0.4-0.3%2C0.7-0.7%2C0.7c-0.4%2C0-0.7-0.3-0.7-0.7V0.8z%22%2F%3E%0A%09%3Cpath%20d%3D%22M49.5%2C0.8c0-0.4%2C0.3-0.7%2C0.7-0.7h0.2c0.4%2C0%2C0.6%2C0.2%2C0.8%2C0.4L55.4%2C6V0.8c0-0.4%2C0.3-0.7%2C0.7-0.7c0.4%2C0%2C0.7%2C0.3%2C0.7%2C0.7v7.1%0A%09%09c0%2C0.4-0.3%2C0.7-0.7%2C0.7H56c-0.3%2C0-0.6-0.2-0.8-0.4L51%2C2.6v5.3c0%2C0.4-0.3%2C0.7-0.7%2C0.7c-0.4%2C0-0.7-0.3-0.7-0.7V0.8z%22%2F%3E%0A%09%3Cpath%20d%3D%22M61.1%2C1.5h-2c-0.4%2C0-0.7-0.3-0.7-0.7c0-0.4%2C0.3-0.7%2C0.7-0.7h5.6c0.4%2C0%2C0.7%2C0.3%2C0.7%2C0.7c0%2C0.4-0.3%2C0.7-0.7%2C0.7h-2.1v6.4%0A%09%09c0%2C0.4-0.3%2C0.7-0.7%2C0.7s-0.7-0.3-0.7-0.7V1.5z%22%2F%3E%0A%09%3Cpath%20d%3D%22M66.8%2C0.8c0-0.4%2C0.3-0.7%2C0.7-0.7c0.4%2C0%2C0.7%2C0.3%2C0.7%2C0.7v6.4H72c0.4%2C0%2C0.7%2C0.3%2C0.7%2C0.7c0%2C0.4-0.3%2C0.7-0.7%2C0.7h-4.5%0A%09%09c-0.4%2C0-0.7-0.3-0.7-0.7V0.8z%22%2F%3E%0A%09%3Cpath%20d%3D%22M74.3%2C0.8c0-0.4%2C0.3-0.7%2C0.7-0.7c0.4%2C0%2C0.7%2C0.3%2C0.7%2C0.7v7.1c0%2C0.4-0.3%2C0.7-0.7%2C0.7c-0.4%2C0-0.7-0.3-0.7-0.7V0.8z%22%2F%3E%0A%09%3Cpath%20d%3D%22M78%2C0.8c0-0.4%2C0.3-0.7%2C0.7-0.7h0.2c0.3%2C0%2C0.5%2C0.2%2C0.7%2C0.4l2.5%2C4l2.6-4c0.2-0.3%2C0.4-0.4%2C0.7-0.4h0.2c0.4%2C0%2C0.7%2C0.3%2C0.7%2C0.7%0A%09%09v7c0%2C0.4-0.3%2C0.7-0.7%2C0.7c-0.4%2C0-0.7-0.3-0.7-0.7v-5l-2.1%2C3.1c-0.2%2C0.2-0.3%2C0.4-0.6%2C0.4c-0.3%2C0-0.5-0.1-0.6-0.4l-2-3.1v5%0A%09%09c0%2C0.4-0.3%2C0.7-0.7%2C0.7S78%2C8.3%2C78%2C7.9V0.8z%22%2F%3E%0A%09%3Cpath%20d%3D%22M88.5%2C0.8c0-0.4%2C0.3-0.7%2C0.7-0.7c0.4%2C0%2C0.7%2C0.3%2C0.7%2C0.7v7.1c0%2C0.4-0.3%2C0.7-0.7%2C0.7c-0.4%2C0-0.7-0.3-0.7-0.7V0.8z%22%2F%3E%0A%09%3Cpath%20d%3D%22M92.2%2C0.8c0-0.4%2C0.3-0.7%2C0.7-0.7h0.2c0.4%2C0%2C0.6%2C0.2%2C0.8%2C0.4L98.1%2C6V0.8c0-0.4%2C0.3-0.7%2C0.7-0.7c0.4%2C0%2C0.7%2C0.3%2C0.7%2C0.7v7.1%0A%09%09c0%2C0.4-0.3%2C0.7-0.7%2C0.7h-0.1c-0.3%2C0-0.6-0.2-0.8-0.4l-4.3-5.6v5.3c0%2C0.4-0.3%2C0.7-0.7%2C0.7c-0.4%2C0-0.7-0.3-0.7-0.7V0.8z%22%2F%3E%0A%09%3Cpath%20d%3D%22M101.2%2C7.6l3.1-7c0.2-0.4%2C0.5-0.6%2C0.9-0.6h0.1c0.4%2C0%2C0.7%2C0.2%2C0.9%2C0.6l3.1%2C7c0.1%2C0.1%2C0.1%2C0.2%2C0.1%2C0.3c0%2C0.4-0.3%2C0.7-0.7%2C0.7%0A%09%09c-0.3%2C0-0.6-0.2-0.7-0.5l-0.7-1.6h-4.1l-0.7%2C1.6c-0.1%2C0.3-0.4%2C0.5-0.7%2C0.5c-0.4%2C0-0.7-0.3-0.7-0.7C101.1%2C7.8%2C101.2%2C7.7%2C101.2%2C7.6z%0A%09%09%20M106.7%2C5.2l-1.5-3.4l-1.5%2C3.4H106.7z%22%2F%3E%0A%09%3Cpath%20d%3D%22M112.1%2C1.5h-2c-0.4%2C0-0.7-0.3-0.7-0.7c0-0.4%2C0.3-0.7%2C0.7-0.7h5.6c0.4%2C0%2C0.7%2C0.3%2C0.7%2C0.7c0%2C0.4-0.3%2C0.7-0.7%2C0.7h-2.1v6.4%0A%09%09c0%2C0.4-0.3%2C0.7-0.7%2C0.7c-0.4%2C0-0.7-0.3-0.7-0.7V1.5z%22%2F%3E%0A%09%3Cpath%20d%3D%22M117%2C4.4L117%2C4.4c0-2.4%2C1.8-4.4%2C4.4-4.4c2.6%2C0%2C4.4%2C2%2C4.4%2C4.3v0c0%2C2.4-1.8%2C4.3-4.4%2C4.3C118.8%2C8.7%2C117%2C6.7%2C117%2C4.4z%0A%09%09%20M124.2%2C4.4L124.2%2C4.4c0-1.7-1.2-3-2.9-3s-2.8%2C1.3-2.8%2C3v0c0%2C1.6%2C1.2%2C3%2C2.9%2C3S124.2%2C6%2C124.2%2C4.4z%22%2F%3E%0A%09%3Cpath%20d%3D%22M127.5%2C0.9c0-0.4%2C0.3-0.7%2C0.7-0.7h3c1.1%2C0%2C1.9%2C0.3%2C2.4%2C0.8c0.4%2C0.5%2C0.7%2C1.1%2C0.7%2C1.8v0c0%2C1.3-0.8%2C2.2-1.9%2C2.5l1.6%2C2%0A%09%09c0.1%2C0.2%2C0.2%2C0.3%2C0.2%2C0.6c0%2C0.4-0.3%2C0.7-0.7%2C0.7c-0.3%2C0-0.6-0.2-0.7-0.4l-2-2.6H129v2.3c0%2C0.4-0.3%2C0.7-0.7%2C0.7%0A%09%09c-0.4%2C0-0.7-0.3-0.7-0.7V0.9z%20M131.2%2C4.3c1.1%2C0%2C1.7-0.6%2C1.7-1.4v0c0-0.9-0.6-1.4-1.7-1.4H129v2.8H131.2z%22%2F%3E%0A%3C%2Fg%3E%0A%3C%2Fsvg%3E%0A" alt="The Printliminator"> <h3><span>Just click stuff on page to remove.</span> Alt-click to remove opposite.</h3> </div> <div class="footer"> <h3>Other Useful Superpowers</h3> <ul> <li class="undo"><span class="icon"></span>Undo<br>Last</li> <li class="stylize"><span class="icon"></span>Add Print<br>Styles</li> <li class="no_graphics"><span class="icon"></span>Remove<br>Graphics</li> <li class="print"><span class="icon"></span>Send to<br>print</li> </ul> <div class="keyboard-area"> <p class="toggle keyboard">View Keyboard Commands</p> <table id="keyboard" style="display:none"> <thead> <tr><th class="key">Key</th><th>Description</th></tr> </thead> <tbody> <tr><td><kbd>PageUp</kbd> <span class="lower">or</span> <kbd class="bold" title="Up Arrow">&uarr;</kbd></td><td>Find wrapper of highlighted box</td></tr> <tr><td><kbd>PageDown</kbd> <span class="lower">or</span> <kbd class="bold" title="Down Arrow">&darr;</kbd></td><td>Find content of highlighted box</td></tr> <tr><td><kbd class="bold" title="Right Arrow">&rarr;</kbd></td><td>Find next box inside same wrapper</td></tr> <tr><td><kbd class="bold" title="Left Arrow">&larr;</kbd></td><td>Find previous box inside same wrapper</td></tr> <tr><td><kbd>Enter</kbd></td><td>Remove the highlighted box</td></tr> <tr><td><kbd>Backspace</kbd></td><td>Undo last action</td></tr> <tr><td><kbd title="Numpad Plus">Numpad <span class="bold">+</span></kbd> <span class="lower">or</span> <kbd title="Plus">+</kbd> </td><td>Increase font-size by 1</td></tr> <tr><td><kbd title="Numpad Minus">NumPad <span class="bold">-</span></kbd> <span class="lower">or</span> <kbd title="Minus">-</kbd></td><td>Decrease font-size by 1</td></tr> <tr><td><kbd title="Numpad Asterisk (Multiply)">NumPad <span class="bold asterisk">*</span></kbd> <span class="lower">or</span> <kbd title="Asterisk">*</kbd></td><td>Reset font-size</td></tr> <tr> <td><kbd>Alt</kbd> + <span class="icon left_click" title="left-click on mouse"></span></td> <td>Remove everything but highlighted box</td> </tr> <tr> <td><kbd>Shift</kbd> + <span class="icon left_click" title="left-click on mouse"></span></td> <td>Set box width to 100% &amp; margins to zero (highlight turns blue)</td> </tr> </tbody> </table> </div> </div><style>*, *:before, *:after { box-sizing: inherit; } html { box-sizing: border-box; height: 100%; } html, body { background: #eee; min-height: 220px; font-family: "Lucida Grande", "Lucida Sans Unicode", Tahoma, sans-serif; font-size: 14px; margin: 0; padding: 0; cursor: default; overflow: hidden; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; } .top { background: #fff; padding: 15px; } .top h3 { color: #ccc; margin: 0; } .top h3 span { color: red; } .header, li { background: #111; color: #fff; font-size: 11px; } .header, .header > div { height: 21px; font-size: 11px; } .header > div, li { display: inline-block; } .right { float: right; margin-right: 6px; } .footer { padding: 15px 15px 0 15px; } .footer ul { margin: 0 0 15px 0; padding: 0; list-style-type: none; } .keyboard-area { margin: 0 -15px 0 -15px; /* extend keyboard background outside of popup - accomidate for different row heights in browsers */ padding: 15px 15px 50px 15px; background: #ccc; } .toggle { font-size: 12px; margin: 0 0 15px 0; cursor: pointer; } .pl_logo { width: 225px; height: 15px; margin: 0 0 5px 0; } h1, h3 { margin: 0 0 10px; font-weight: normal; text-transform: uppercase; } h3 { font-size: 10px; font-weight: bold; } .close, ._printliminator_drag_icon { text-transform: uppercase; } .icon { display: inline-block; background: url(data:image/png;base64,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) no-repeat; width: 25px; height: 25px; vertical-align: middle; } ._printliminator_drag_icon .icon { background-position: 0 0; } .print .icon { background-position: -25px 0; } .close .icon { background-position: -75px 0; width: 40px; cursor: pointer; } .undo .icon { background-position: 0 -25px; } .no_graphics .icon { background-position: -25px -25px; } .stylize .icon { background-position: -75px -25px; width: 35px; } .left_click { background-position: -50px -25px; } li.busy .icon { background-position: -50px 0; -webkit-animation: spin 1.5s linear infinite; -moz-animation: spin 1.5s linear infinite; animation: spin 1.5s linear infinite; } @-moz-keyframes spin { 100% { -moz-transform: rotate(360deg); } } @-webkit-keyframes spin { 100% { -webkit-transform: rotate(360deg); } } @keyframes spin { 100% { -webkit-transform: rotate(360deg); transform: rotate(360deg); } } li { padding: 4px 14px 4px 4px; line-height: 12px; font-size: 10px; text-transform: uppercase; text-align: left; white-space: nowrap; margin: 2px; cursor: pointer; display: inline-block; } li:hover { background-color: #333; } li span { float: left; margin: 0 10px 0 0; text-align: left; } .key { width: 30%; } table { margin: 0 4px; border-spacing: 0; } th { text-align: left; padding: 0; } kbd { background: #fff; border: #000 1px solid; border-radius: 3px; padding: 1px 3px; } td { border-top: 1px solid #aaa; font-size: 12px; padding: 5px; /* make Firefox match Webkit */ line-height: 18px; } </style>'), b.close(), a.addEvent(b.querySelector("." + a.css.noGraphics), "click", a.removeGraphics), a.addEvent(b.querySelector("." + a.css.print), "click", a.print), a.addEvent(b.querySelector("." + a.css.undo), "click", a.undo), a.addEvent(b.querySelector("." + a.css.stylize), "click", a.stylize), a.addEvent(b.querySelector("." + a.css.close), "click", a.abort), a.addEvent(b.querySelector("." + a.css.keyboard), "click", a.keyboard), a.addEvent(document.querySelector("." + a.css.drag), "mousedown", a.dragInit), a.addEvent(b, "mouseup", a.docMouseUp)
        },
        keyboard: function() {
            var b = document.querySelector("." + a.css.wrap),
                c = b.querySelector("iframe." + a.css.controls),
                d = c.contentWindow.document.body,
                e = d.querySelector("#" + a.css.keyboard),
                f = d.querySelector("." + a.css.keyboard),
                g = e.style.display,
                h = "none" === g;
            f.innerHTML = h ? "Hide Keyboard Commands" : "View Keyboard Commands", e.style.display = h ? "" : "none", b.style.height = (h ? a.keyboardOpen : a.keyboardClosed) + 5 + "px", c.style.height = (h ? a.keyboardOpen : a.keyboardClosed) + 5 + "px", d.style.height = (h ? a.keyboardOpen : a.keyboardClosed) + 20 + "px"
        },
        dragInit: function() {
            var b = a.drag;
            a.addClass(document.querySelector("." + a.css.drag), a.css.dragActive), b.el = document.querySelector("." + a.css.wrap), b.elm[0] = b.pos[0] - b.el.offsetLeft, b.elm[1] = b.pos[1] - b.el.offsetTop, a.toggleSelection(!0)
        },
        docMouseMove: function(b) {
            var c = a.drag;
            c.pos[0] = document.all ? window.event.clientX : b.pageX, c.pos[1] = document.all ? window.event.clientY : b.pageY, null !== a.drag.el && (c.el.style.left = c.pos[0] - c.elm[0] + "px", c.el.style.top = c.pos[1] - c.elm[1] + "px")
        },
        docMouseUp: function() {
            a.drag.el = null, a.removeClass(document.querySelector("." + a.css.drag), a.css.dragActive), a.toggleSelection()
        },
        stopSelection: function() {
            return !1
        },
        toggleSelection: function(b) {
            var c = document.body;
            b ? (a.savedUnsel = c.getAttribute("unselectable"), c.setAttribute("unselectable", "on"), a.addClass(c, a.css.noSelection), a.addEvent(c, "onselectstart", a.stopSelection)) : (a.savedUnsel && c.setAttribute("unselectable", a.savedUnsel), a.removeClass(c, a.css.noSelection), a.removeEvent(c, "onselectstart", a.stopSelection)), a.clearSelection()
        },
        clearSelection: function() {
            var a = window.getSelection ? window.getSelection() : document.selection;
            a && (a.removeAllRanges ? a.removeAllRanges() : a.empty && a.empty())
        },
        hide: function(b) {
            if (b) {
                var c, d = b.length;
                if ("undefined" != typeof d)
                    for (c = 0; d > c; c++) a.addClass(b[c], a.css.hidden);
                else a.addClass(b, a.css.hidden)
            }
        },
        show: function(b) {
            if (b) {
                var c, d = b.length;
                if ("undefined" != typeof d)
                    for (c = 0; d > c; c++) a.removeClass(b[c], a.css.hidden);
                else a.removeClass(b, a.css.hidden)
            }
        },
        addClass: function(b, c) {
            b && (b.classList ? b.classList.add(c) : a.hasClass(b, c) || (b.className += " " + c))
        },
        removeClass: function(a, b) {
            a && (a.classList ? a.classList.remove(b) : a.className = a.className.replace(new RegExp("\\b" + b + "\\b", "g"), ""))
        },
        hasClass: function(a, b) {
            return a ? a.classList ? a.classList.contains(b) : new RegExp("\\b" + b + "\\b").test(a.className) : !1
        },
        addEvent: function(a, b, c) {
            a.attachEvent ? a.attachEvent("on" + b, c) : a.addEventListener(b, c)
        },
        removeEvent: function(a, b, c) {
            a.detachEvent ? a.detachEvent("on" + b, c) : a.removeEventListener(b, c)
        }
    }
}();