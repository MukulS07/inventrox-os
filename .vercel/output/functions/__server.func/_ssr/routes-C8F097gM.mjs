import { o as __toESM } from "../_runtime.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { A as Receipt, Bt as Boxes, D as Rocket, E as ScanLine, Et as CircleCheck, F as Plug, Ft as ChartLine, Gt as ArrowRight, K as Mail, Mt as ChevronLeft, O as RefreshCw, Pt as Check, Q as Layers, T as Search, W as Menu, Wt as ArrowUpRight, X as Linkedin, a as Users, at as Github, bt as Clock, g as Sparkles, gt as Cpu, h as Star, j as Quote, jt as ChevronRight, lt as FileCheck, nt as History, qt as Activity, r as WifiOff, rt as HeartHandshake, s as UserCheck, st as FileText, t as X, w as Send, x as ShieldCheck, y as ShoppingCart } from "../_libs/lucide-react.mjs";
import { n as gsapWithCSS, t as ScrollTrigger } from "../_libs/gsap.mjs";
import { t as motion } from "../_libs/framer-motion.mjs";
import { t as Lenis } from "../_libs/lenis.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-C8F097gM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function StarCanvas() {
	const canvasRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		let width = canvas.width = window.innerWidth;
		let height = canvas.height = window.innerHeight;
		let raf = 0;
		const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		const count = Math.min(420, Math.floor(width * height / 4500));
		const stars = Array.from({ length: count }, () => ({
			x: (Math.random() - .5) * width,
			y: (Math.random() - .5) * height,
			z: Math.random() * width,
			pz: 0
		}));
		const resize = () => {
			width = canvas.width = window.innerWidth;
			height = canvas.height = window.innerHeight;
		};
		window.addEventListener("resize", resize);
		const speed = 1.6;
		const render = () => {
			ctx.clearRect(0, 0, width, height);
			ctx.save();
			ctx.translate(width / 2, height / 2);
			for (const s of stars) {
				s.pz = s.z;
				s.z -= speed;
				if (s.z < 1) {
					s.z = width;
					s.x = (Math.random() - .5) * width;
					s.y = (Math.random() - .5) * height;
					s.pz = s.z;
				}
				const sx = s.x / s.z * width;
				const sy = s.y / s.z * height;
				const px = s.x / s.pz * width;
				const py = s.y / s.pz * height;
				const size = (1 - s.z / width) * 2.2;
				const opacity = Math.min(1, (1 - s.z / width) * 1.1);
				ctx.strokeStyle = `rgba(180, 170, 255, ${opacity * .55})`;
				ctx.lineWidth = size;
				ctx.beginPath();
				ctx.moveTo(px, py);
				ctx.lineTo(sx, sy);
				ctx.stroke();
				ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
				ctx.beginPath();
				ctx.arc(sx, sy, size / 2, 0, Math.PI * 2);
				ctx.fill();
			}
			ctx.restore();
			raf = requestAnimationFrame(render);
		};
		if (prefersReduced) {
			render();
			cancelAnimationFrame(raf);
		} else render();
		return () => {
			cancelAnimationFrame(raf);
			window.removeEventListener("resize", resize);
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
		ref: canvasRef,
		className: "absolute inset-0 size-full opacity-70"
	});
}
function Background() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"aria-hidden": true,
		className: "pointer-events-none fixed inset-0 -z-10 overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-background" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-1/3 left-1/2 h-[110vh] w-[120vw] -translate-x-1/2 aurora animate-aurora blur-2xl" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute -bottom-1/4 right-[-10%] h-[80vh] w-[70vw] animate-aurora blur-3xl",
				style: {
					background: "radial-gradient(circle at 70% 70%, color-mix(in oklab, var(--accent) 30%, transparent), transparent 65%)",
					animationDelay: "-6s"
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute left-[8%] top-[18%] size-72 rounded-full bg-[image:var(--gradient-primary)] opacity-[0.18] blur-3xl animate-orb-a" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute right-[12%] top-[40%] size-80 rounded-full bg-[image:var(--gradient-primary)] opacity-[0.14] blur-3xl animate-orb-b" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 starfield animate-twinkle opacity-50" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StarCanvas, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-background to-transparent" })
		]
	});
}
var links = [
	{
		label: "Problems",
		href: "#problem"
	},
	{
		label: "Use Cases",
		href: "#workflow"
	},
	{
		label: "Roadmap",
		href: "#roadmap"
	},
	{
		label: "Security",
		href: "#security"
	},
	{
		label: "Pricing",
		href: "#pricing"
	}
];
function Navbar() {
	const [scrolled, setScrolled] = (0, import_react.useState)(false);
	const [open, setOpen] = (0, import_react.useState)(false);
	const [mounted, setMounted] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setMounted(true);
		const onScroll = () => setScrolled(window.scrollY > 16);
		onScroll();
		window.addEventListener("scroll", onScroll);
		return () => window.removeEventListener("scroll", onScroll);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "fixed inset-x-0 top-3 z-50 px-4 will-change-[transform,opacity]",
		style: {
			transition: "opacity 800ms cubic-bezier(0.16, 1, 0.3, 1), transform 800ms cubic-bezier(0.16, 1, 0.3, 1)",
			opacity: mounted ? 1 : 0,
			transform: mounted ? "translate3d(0, 0, 0)" : "translate3d(0, -6px, 0)"
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
			className: `mx-auto flex max-w-6xl items-center justify-between rounded-full px-5 transition-all duration-300 ${scrolled ? "bg-[#030712]/90 backdrop-blur-[24px] border border-[#00f0ff]/30 py-2 shadow-[0_0_25px_rgba(0,240,255,0.15)]" : "bg-white/5 backdrop-blur-[10px] border border-white/10 py-3"}`,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: "#top",
					className: "flex items-center gap-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/inventrox-icon.png",
						className: "size-8 rounded-full bg-[#00f0ff]/20 p-0.5 border border-[#00f0ff]/40 object-contain shadow-[0_0_10px_rgba(0,240,255,0.3)]",
						alt: "INVENTROX Logo"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-extrabold text-lg tracking-tight text-white",
						children: "INVENTROX"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "hidden items-center gap-7 md:flex",
					children: links.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: l.href,
						className: "text-sm font-medium text-slate-300 transition-colors hover:text-[#00f0ff]",
						children: l.label
					}, l.href))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hidden items-center gap-3 md:flex",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/login",
						className: "rounded-full px-4 py-2 text-sm text-slate-300 transition-colors hover:text-white",
						children: "Sign in"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/login",
						className: "btn-cyan text-xs font-bold py-2 px-5",
						children: "Start free trial"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "grid size-9 place-items-center rounded-full text-white md:hidden",
					onClick: () => setOpen((v) => !v),
					"aria-label": "Toggle menu",
					children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
				})
			]
		}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto mt-2 max-w-6xl glass-card p-4 md:hidden border-[#00f0ff]/30",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2",
				children: [links.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: l.href,
					onClick: () => setOpen(false),
					className: "rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/10 hover:text-white",
					children: l.label
				}, l.href)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/login",
					onClick: () => setOpen(false),
					className: "mt-2 btn-cyan text-center text-xs font-bold py-2.5",
					children: "Start free trial"
				})]
			})
		})]
	});
}
/**
* Reveals text one word at a time with a slide-up mask effect when it scrolls into view.
*/
function TextReveal({ text, className = "", wordClassName = "", delay = 0, stagger = 75, duration = 650 }) {
	const ref = (0, import_react.useRef)(null);
	const [show, setShow] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const el = ref.current;
		if (!el) return;
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			setShow(true);
			return;
		}
		const observer = new IntersectionObserver((entries) => {
			if (entries[0].isIntersecting) {
				setShow(true);
				observer.disconnect();
			}
		}, { threshold: .2 });
		observer.observe(el);
		return () => observer.disconnect();
	}, []);
	const words = text.split(" ");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		ref,
		className: `reveal-text ${className}`,
		"aria-label": text,
		children: words.map((word, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "inline",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "reveal-word",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: `reveal-word-inner ${wordClassName}`,
					style: {
						animation: show ? `word-reveal ${duration}ms cubic-bezier(0.2, 0.7, 0.2, 1) both` : "none",
						animationDelay: `${delay + i * stagger}ms`,
						opacity: show ? void 0 : 0
					},
					children: word
				})
			}), i < words.length - 1 && " "]
		}, i))
	});
}
function useCountUp(target, decimals = 0, duration = 1600) {
	const [value, setValue] = (0, import_react.useState)(0);
	const ref = (0, import_react.useRef)(null);
	const started = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		const el = ref.current;
		if (!el) return;
		const observer = new IntersectionObserver((entries) => {
			if (entries[0].isIntersecting && !started.current) {
				started.current = true;
				const start = performance.now();
				const tick = (now) => {
					const p = Math.min((now - start) / duration, 1);
					setValue(target * (1 - Math.pow(1 - p, 3)));
					if (p < 1) requestAnimationFrame(tick);
				};
				requestAnimationFrame(tick);
			}
		}, { threshold: .4 });
		observer.observe(el);
		return () => observer.disconnect();
	}, [target, duration]);
	return {
		ref,
		display: value.toFixed(decimals)
	};
}
function Stat({ prefix = "", value, decimals = 0, suffix, label }) {
	const { ref, display } = useCountUp(value, decimals);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "text-left",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "font-mono text-2xl font-700 tracking-tight sm:text-3xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				ref,
				children: [prefix, Number(display).toLocaleString("en-IN")]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-gradient-brand",
				children: suffix
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-1 text-xs text-muted-foreground sm:text-sm",
			children: label
		})]
	});
}
function Hero() {
	const containerRef = (0, import_react.useRef)(null);
	const stickyFrameRef = (0, import_react.useRef)(null);
	const heroTextRef = (0, import_react.useRef)(null);
	const dashboardContainerRef = (0, import_react.useRef)(null);
	const widgetRevenueRef = (0, import_react.useRef)(null);
	const widgetInventoryRef = (0, import_react.useRef)(null);
	const widgetAnalyticsRef = (0, import_react.useRef)(null);
	const widgetAiRef = (0, import_react.useRef)(null);
	const widgetReportsRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (typeof window === "undefined") return;
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		const ctx = gsapWithCSS.context(() => {
			const tl = gsapWithCSS.timeline({ scrollTrigger: {
				trigger: containerRef.current,
				start: "top top",
				end: "bottom bottom",
				scrub: 1.2,
				pin: stickyFrameRef.current,
				anticipatePin: 1
			} });
			tl.to(heroTextRef.current, {
				opacity: 0,
				y: -120,
				scale: .92,
				duration: 1
			}, 0);
			tl.fromTo(dashboardContainerRef.current, {
				opacity: 0,
				scale: .94,
				y: 140
			}, {
				opacity: 1,
				scale: 1.04,
				y: -10,
				duration: 1.5,
				ease: "power2.out"
			}, .15);
			if (widgetRevenueRef.current) tl.fromTo(widgetRevenueRef.current, {
				opacity: 0,
				y: 40
			}, {
				opacity: 1,
				y: 0,
				duration: .5
			}, .4);
			if (widgetInventoryRef.current) tl.fromTo(widgetInventoryRef.current, {
				opacity: 0,
				y: 40
			}, {
				opacity: 1,
				y: 0,
				duration: .5
			}, .55);
			if (widgetAnalyticsRef.current) tl.fromTo(widgetAnalyticsRef.current, {
				opacity: 0,
				y: 40
			}, {
				opacity: 1,
				y: 0,
				duration: .5
			}, .7);
			if (widgetAiRef.current) tl.fromTo(widgetAiRef.current, {
				opacity: 0,
				y: 40
			}, {
				opacity: 1,
				y: 0,
				duration: .5
			}, .85);
			if (widgetReportsRef.current) tl.fromTo(widgetReportsRef.current, {
				opacity: 0,
				y: 40
			}, {
				opacity: 1,
				y: 0,
				duration: .5
			}, 1);
		});
		return () => ctx.revert();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: containerRef,
		className: "relative min-h-[250vh] w-full",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			ref: stickyFrameRef,
			className: "relative flex h-screen w-full flex-col justify-center overflow-hidden px-5 pt-16",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				ref: heroTextRef,
				className: "text-center max-w-6xl mx-auto flex flex-col justify-center flex-1 py-8 will-change-[transform,opacity]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "mx-auto inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#00f0ff] shadow-[0_0_15px_rgba(0,240,255,0.2)] animate-in fade-in duration-700",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 rounded-full bg-[#00f0ff] animate-ping" }), "Next-Gen Business OS"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "mx-auto mt-6 max-w-4xl text-balance text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl text-white",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextReveal, { text: "Run every cup, every counter," }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextReveal, {
								className: "bg-gradient-to-r from-[#00f0ff] via-cyan-200 to-purple-400 bg-clip-text text-transparent font-extrabold drop-shadow-[0_0_35px_rgba(0,240,255,0.3)]",
								text: "every ledger — from one platform",
								delay: 300
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mx-auto mt-5 max-w-2xl text-pretty text-base text-slate-300 sm:text-lg animate-in fade-in duration-800 delay-200",
						children: "INVENTROX combines retail POS, roast-batch inventory, automated GST invoicing, and real-time CRM into a single, sovereign AI operating system."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row animate-in fade-in duration-800 delay-300",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: "#cta",
							className: "btn-cyan group inline-flex items-center gap-2",
							children: ["Start free trial", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4 transition-transform group-hover:translate-x-0.5" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#workflow",
							className: "btn-ghost inline-flex items-center gap-2",
							children: "See it in action"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-12 grid grid-cols-3 gap-4 border-t border-white/10 pt-6 sm:gap-8 animate-in fade-in duration-1000 delay-500",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								value: 12400,
								suffix: "+",
								label: "Roasteries & Shops Managed"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								value: 89e3,
								suffix: "+",
								label: "Batches & Products Tracked"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								prefix: "₹",
								value: 2.4,
								decimals: 1,
								suffix: "Cr+",
								label: "Revenue Generated"
							})
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				ref: dashboardContainerRef,
				className: "absolute inset-x-0 bottom-4 md:bottom-8 mx-auto max-w-[94vw] xl:max-w-7xl h-[420px] md:h-[64vh] lg:h-[68vh] overflow-hidden opacity-0 pointer-events-none will-change-[transform,opacity] relative rounded-3xl border border-white/15 bg-[#080d1a]/95 backdrop-blur-2xl shadow-[0_0_80px_rgba(0,240,255,0.15)] p-4 md:p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					ref: widgetAiRef,
					className: "absolute top-6 right-6 z-30 hidden md:flex items-center gap-3 rounded-xl border border-[#00f0ff]/40 bg-[#030712]/95 p-4 shadow-[0_0_35px_rgba(0,240,255,0.25)] backdrop-blur-2xl animate-pulse",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex size-9 items-center justify-center rounded-lg bg-[#00f0ff]/20 text-[#00f0ff]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-xs font-semibold text-[#00f0ff]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 rounded-full bg-[#00f0ff] animate-ping" }), "AI Operations Stream"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs font-medium text-white mt-0.5",
						children: ["Ethiopia Yirgacheffe — ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-rose-400 font-bold",
							children: "4 days to stockout"
						})]
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full h-full flex flex-col gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between border-b border-white/10 pb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-3 rounded-full bg-rose-500/80" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-3 rounded-full bg-amber-500/80" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-3 rounded-full bg-emerald-500/80" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-3 font-mono text-xs text-slate-400",
									children: "inventrox-os.app / live-command"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-4 text-xs text-slate-400",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1.5 text-emerald-400 font-semibold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 rounded-full bg-emerald-400 animate-ping" }), "Live Sync"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "GST Verified" })]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 md:grid-cols-12 gap-4 flex-1 overflow-hidden",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								ref: widgetRevenueRef,
								className: "md:col-span-4 rounded-2xl border border-white/10 bg-white/5 p-4 flex flex-col justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between items-start",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-medium text-slate-400",
										children: "Gross Revenue Today"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-mono text-2xl font-bold text-white mt-1",
										children: "₹2,48,500"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 border border-emerald-500/30",
										children: "+14.8%"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-4 h-16 w-full flex items-end gap-1.5",
									children: [
										40,
										65,
										45,
										80,
										95,
										75,
										100
									].map((h, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex-1 bg-gradient-to-t from-[#00f0ff]/20 to-[#00f0ff] rounded-t",
										style: { height: `${h}%` }
									}, i))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								ref: widgetInventoryRef,
								className: "md:col-span-5 rounded-2xl border border-white/10 bg-white/5 p-4 flex flex-col justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between items-center border-b border-white/10 pb-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-semibold text-slate-200",
										children: "Roast-Batch Stock Levels"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-cyan-400 font-mono",
										children: "12 Active SKUs"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2.5 mt-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between text-xs mb-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-slate-300 font-medium",
											children: "Ethiopia Yirgacheffe Roast"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-rose-400 font-mono",
											children: "12 kg remaining"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-full bg-white/10 rounded-full h-1.5",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-rose-500 h-1.5 rounded-full w-[25%]" })
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between text-xs mb-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-slate-300 font-medium",
											children: "Colombia Supremo Batch"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-emerald-400 font-mono",
											children: "145 kg in stock"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-full bg-white/10 rounded-full h-1.5",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-emerald-400 h-1.5 rounded-full w-[82%]" })
									})] })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								ref: widgetReportsRef,
								className: "md:col-span-3 rounded-2xl border border-white/10 bg-white/5 p-4 flex flex-col justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-semibold text-slate-200 mb-2",
									children: "POS Real-Time Ledger"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2 text-[11px]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-2 rounded-lg bg-white/5 border border-white/5 flex justify-between items-center",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-slate-300 truncate",
											children: "INV-2026-0894"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono text-emerald-400",
											children: "₹1,450"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-2 rounded-lg bg-white/5 border border-white/5 flex justify-between items-center",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-slate-300 truncate",
											children: "INV-2026-0893"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono text-emerald-400",
											children: "₹890"
										})]
									})]
								})]
							})
						]
					})]
				})]
			})]
		})
	});
}
function ScrollReveal({ children, className = "", variant = "fade-up", delay = 0, duration = 800, distance = 30, threshold = .1, once = true }) {
	if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className,
		children
	});
	const variants = {
		hidden: {
			opacity: 0,
			y: variant === "fade" ? 0 : distance,
			scale: variant === "scale-up" ? .965 : 1
		},
		visible: {
			opacity: 1,
			y: 0,
			scale: 1,
			transition: {
				duration: duration / 1e3,
				delay: delay / 1e3,
				ease: [
					.16,
					1,
					.3,
					1
				]
			}
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		initial: "hidden",
		whileInView: "visible",
		viewport: {
			once,
			amount: threshold
		},
		variants,
		className: `will-change-[transform,opacity] ${className}`,
		children
	});
}
var problems = [
	{
		icon: Layers,
		title: "Inventory & Stock Blindspots",
		body: "Green coffee, syrups, packaging, and retail items managed in spreadsheets. Stock levels go stale, leading to surprise stockouts during rush hours."
	},
	{
		icon: Clock,
		title: "Hours Lost to Manual Admin",
		body: "Manual GST invoicing, physical stock counts, and vendor follow-ups eat up hours your team should spend roasting and serving customers."
	},
	{
		icon: Search,
		title: "Fragmented Counter Operations",
		body: "POS in one app, wholesale ledger in another, WhatsApp for reorders. No single source of truth for your roastery's true margins."
	}
];
function ProblemSection() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "problem",
		className: "mx-auto max-w-6xl px-5 py-24 min-h-screen flex flex-col justify-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollReveal, {
			variant: "fade-up",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-w-2xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-semibold uppercase tracking-[0.2em] text-[#00f0ff]",
						children: "Operational Friction"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "mt-4 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl text-white",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextReveal, { text: "Signs your operations are" }),
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextReveal, {
								className: "bg-gradient-to-r from-[#00f0ff] to-purple-400 bg-clip-text text-transparent font-extrabold",
								text: "costing you growth",
								delay: 320
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-5 text-base text-slate-300 sm:text-lg",
						children: "Most businesses run on 4–6 disconnected tools. The problem isn't effort — it's fragmentation."
					})
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-14 grid gap-6 md:grid-cols-3",
			children: problems.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollReveal, {
				variant: "fade-up",
				delay: i * 150,
				className: "h-full",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "group glass-card p-8 h-full flex flex-col justify-between",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid size-12 place-items-center rounded-xl bg-[#00f0ff]/10 text-[#00f0ff] transition-colors group-hover:bg-[#00f0ff] group-hover:text-[#030712] shadow-[0_0_15px_rgba(0,240,255,0.15)]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(p.icon, { className: "size-6" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-6 text-xl font-bold text-white",
							children: p.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm leading-relaxed text-slate-300",
							children: p.body
						})
					] })
				})
			}, p.title))
		})]
	});
}
var features = [
	{
		icon: Boxes,
		title: "Smart Inventory",
		body: "Real-time stock across locations with auto reorder alerts, batch tracking and dead-stock detection.",
		className: "md:col-span-2"
	},
	{
		icon: ScanLine,
		title: "Lightning POS",
		body: "Barcode billing in seconds with split payments and instant invoices."
	},
	{
		icon: Users,
		title: "Built-in CRM",
		body: "Every customer, order and reminder in one timeline — no more WhatsApp chaos."
	},
	{
		icon: FileText,
		title: "GST Invoicing",
		body: "Generate, share and track compliant invoices over email & WhatsApp with QR pay."
	},
	{
		icon: ChartLine,
		title: "Live Analytics",
		body: "Revenue, inventory health and customer growth on one beautiful, real-time dashboard.",
		className: "md:col-span-2"
	}
];
function FeaturesBento() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "features",
		className: "mx-auto max-w-6xl px-5 py-24 min-h-screen flex flex-col justify-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollReveal, {
			variant: "fade-up",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-2xl text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs font-semibold uppercase tracking-[0.2em] text-[#00f0ff]",
					children: "One platform, every module"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "mt-4 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl text-white",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextReveal, { text: "Everything your business runs on, " }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextReveal, {
						className: "bg-gradient-to-r from-[#00f0ff] via-cyan-200 to-purple-400 bg-clip-text text-transparent font-extrabold",
						text: "finally connected",
						delay: 420
					})]
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-14 grid gap-5 md:grid-cols-3",
			children: [features.map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollReveal, {
				variant: "fade-up",
				delay: i * 100,
				className: f.className ?? "",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
					className: "group glass-card p-8 h-full flex flex-col justify-between",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid size-12 place-items-center rounded-xl bg-[#00f0ff]/10 text-[#00f0ff] shadow-[0_0_15px_rgba(0,240,255,0.15)]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(f.icon, { className: "size-6" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "size-5 text-slate-500 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#00f0ff]" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-6 text-xl font-bold text-white",
							children: f.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm leading-relaxed text-slate-300",
							children: f.body
						})
					] })
				})
			}, f.title)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollReveal, {
				variant: "fade-up",
				delay: features.length * 100,
				className: "",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "group relative overflow-hidden rounded-2xl border border-[#00f0ff]/50 bg-gradient-to-br from-[#00f0ff] to-[#0284c7] p-8 h-full shadow-[0_0_30px_rgba(0,240,255,0.3)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid size-12 place-items-center rounded-xl bg-[#030712]/30 text-[#030712] backdrop-blur-sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-6 text-[#030712]" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-6 text-xl font-extrabold text-[#030712]",
							children: "AI Sovereign Assistant"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm leading-relaxed text-[#030712]/90 font-medium",
							children: "Ask anything in plain language — restocking, forecasts, top customers. Your business, answered instantly."
						})
					]
				})
			})]
		})]
	});
}
var points = [
	"Replaces 4–6 tools with one source of truth",
	"Set up in minutes, not months — no IT team needed",
	"AI surfaces what to restock, sell and chase",
	"Bank-grade security with role-based access"
];
function GrowthSection() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "why",
		className: "mx-auto max-w-6xl px-5 py-24 min-h-screen flex flex-col justify-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollReveal, {
			variant: "fade-up",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-3xl text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl text-white",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextReveal, {
							className: "bg-gradient-to-r from-[#00f0ff] via-cyan-200 to-purple-400 bg-clip-text text-transparent font-extrabold",
							text: "Growth"
						}),
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextReveal, {
							text: "doesn't happen on spreadsheets",
							delay: 280
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mx-auto mt-5 max-w-xl text-base text-slate-300 sm:text-lg",
					children: "To scale, you need a system that tracks, predicts and acts — not a patchwork of apps held together by manual work."
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-14 grid items-center gap-10 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollReveal, {
				variant: "fade-up",
				delay: 200,
				className: "w-full",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-3.5",
					children: points.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 glass-card px-5 py-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid size-7 shrink-0 place-items-center rounded-full bg-[#00f0ff] text-[#030712] shadow-[0_0_12px_rgba(0,240,255,0.4)]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4 stroke-[3]" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-semibold text-white sm:text-base",
							children: p
						})]
					}, p))
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollReveal, {
				variant: "scale-up",
				delay: 400,
				duration: 850,
				className: "w-full",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-0 -z-10 bg-[#00f0ff]/10 blur-3xl" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "glass-card p-8 shadow-[0_0_35px_rgba(0,240,255,0.15)] border-[#00f0ff]/20",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs uppercase tracking-[0.2em] text-[#00f0ff] font-semibold",
								children: "The business growth cycle"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-6 space-y-5",
								children: [
									{
										label: "Start",
										desc: "Manual everything",
										w: "30%"
									},
									{
										label: "Growth",
										desc: "Tools start to break",
										w: "62%"
									},
									{
										label: "Breakthrough",
										desc: "One intelligent platform",
										w: "100%"
									}
								].map((row, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-1.5 flex items-baseline justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm font-semibold text-white",
										children: row.label
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-slate-400",
										children: row.desc
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-2.5 overflow-hidden rounded-full bg-slate-800",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `h-full rounded-full ${i === 2 ? "bg-gradient-to-r from-[#00f0ff] to-[#0284c7] shadow-[0_0_12px_rgba(0,240,255,0.5)]" : "bg-slate-600"}`,
										style: { width: row.w }
									})
								})] }, row.label))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-7 border-t border-white/10 pt-5 text-lg font-bold text-transparent bg-gradient-to-r from-white to-[#00f0ff] bg-clip-text",
								children: "“Breakthrough requires you to change the system.”"
							})
						]
					})]
				})
			})]
		})]
	});
}
var steps = [
	{
		icon: Plug,
		week: "WEEK 1",
		title: "Connect Hardware & Sync",
		body: "Plug in your POS barcode scanners, import product catalog & green coffee inventory. Zero software downtime during business hours."
	},
	{
		icon: Sparkles,
		week: "WEEK 2",
		title: "AI Organizes Catalog & Par Levels",
		body: "INVENTROX cleans product SKUs, maps HSN codes for GST, and sets dynamic reorder alerts based on historical burn rates."
	},
	{
		icon: Rocket,
		week: "WEEK 3",
		title: "Run & Scale Operations",
		body: "Process counter sales with 1-click POS, dispatch automated POs to vendors, and monitor real-time gross margins across all stores."
	}
];
function HowItWorks() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "roadmap",
		className: "mx-auto max-w-6xl px-5 py-24 min-h-screen flex flex-col justify-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollReveal, {
			variant: "fade-up",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-2xl text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-semibold uppercase tracking-[0.2em] text-[#00f0ff]",
						children: "Path to Go-Live"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "mt-4 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl text-white",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextReveal, { text: "From scattered to" }),
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextReveal, {
								className: "bg-gradient-to-r from-[#00f0ff] to-purple-400 bg-clip-text text-transparent font-extrabold",
								text: "production-ready in 3 weeks",
								delay: 360
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mx-auto mt-5 max-w-xl text-base text-slate-300",
						children: "Our managed onboarding handles data cleanup and integration so your business never misses a beat."
					})
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "relative mt-16 grid gap-6 md:grid-cols-3",
			children: steps.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollReveal, {
				variant: "fade-up",
				delay: i * 150,
				className: "h-full",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
					className: "group glass-card p-8 text-center h-full flex flex-col justify-between",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "relative z-10 mx-auto grid size-14 place-items-center rounded-2xl bg-[#00f0ff]/10 text-[#00f0ff] ring-1 ring-[#00f0ff]/30 shadow-[0_0_15px_rgba(0,240,255,0.2)]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(s.icon, { className: "size-6" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "relative z-10 mt-6 block font-mono text-xs font-bold tracking-[0.3em] text-[#00f0ff]",
							children: s.week
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "relative z-10 mt-3 text-xl font-bold text-white",
							children: s.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "relative z-10 mt-3 text-sm leading-relaxed text-slate-300",
							children: s.body
						})
					] })
				})
			}, s.week))
		})]
	});
}
function CtaFooter() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollReveal, {
		variant: "scale-up",
		duration: 800,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			id: "cta",
			className: "mx-auto max-w-6xl px-5 py-16",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative overflow-hidden rounded-[2rem] border border-[#00f0ff]/40 bg-[#030712]/90 p-10 text-center sm:p-16 shadow-[0_0_50px_rgba(0,240,255,0.2)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-0 -z-10 bg-[#00f0ff]/10 blur-3xl" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "mx-auto max-w-2xl text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl text-white",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextReveal, { text: "Run your business" }),
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextReveal, {
								className: "bg-gradient-to-r from-[#00f0ff] via-cyan-200 to-purple-400 bg-clip-text text-transparent font-extrabold",
								text: "the intelligent way",
								delay: 300
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mx-auto mt-5 max-w-xl text-base text-slate-300",
						children: "Join thousands of fast-growing businesses replacing scattered tools with one sovereign platform. No card required."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/login",
							className: "btn-cyan group inline-flex items-center gap-2",
							children: ["Open dashboard", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4 transition-transform group-hover:translate-x-0.5" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#workflow",
							className: "btn-ghost inline-flex items-center gap-2",
							children: "See how it works"
						})]
					})
				]
			})
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollReveal, {
		variant: "fade",
		delay: 150,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
			className: "mx-auto max-w-6xl px-5 py-16",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass-card rounded-[2rem] border border-[#00f0ff]/20 p-10 md:p-16 shadow-2xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 gap-10 md:grid-cols-12 pb-12 border-b border-white/10",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "md:col-span-5 space-y-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: "/inventrox-icon.png",
										className: "size-9 rounded-full bg-[#00f0ff]/20 p-0.5 border border-[#00f0ff]/40 shadow-sm object-contain",
										alt: "INVENTROX Logo"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xl font-extrabold tracking-tight text-white",
										children: "INVENTROX"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-slate-300 leading-relaxed max-w-sm",
									children: "Run your entire business from one platform. Real-time inventory, billing, CRM, POS and live analytics powered by AI."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "mailto:mukulsharmaworks@gmail.com",
									className: "inline-flex items-center justify-center rounded-full bg-white/5 hover:bg-[#00f0ff]/10 hover:text-[#00f0ff] px-6 py-3 text-xs font-semibold text-slate-300 transition-colors border border-white/10",
									children: "mukulsharmaworks@gmail.com"
								}) })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "md:col-span-1 hidden md:block" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "md:col-span-6 grid grid-cols-3 gap-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
										className: "text-xs font-bold uppercase tracking-widest text-white",
										children: "Quick links"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
										className: "space-y-2.5 text-xs text-slate-400",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
												href: "#features",
												className: "hover:text-[#00f0ff] transition-colors",
												children: "Features"
											}) }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
												href: "#workflow",
												className: "hover:text-[#00f0ff] transition-colors",
												children: "How It Works"
											}) }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
												href: "#why",
												className: "hover:text-[#00f0ff] transition-colors",
												children: "Why INVENTROX"
											}) }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
												href: "#pricing",
												className: "hover:text-[#00f0ff] transition-colors",
												children: "Pricing"
											}) })
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
										className: "text-xs font-bold uppercase tracking-widest text-white",
										children: "Pages"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
										className: "space-y-2.5 text-xs text-slate-400",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
												to: "/login",
												className: "hover:text-[#00f0ff] transition-colors",
												children: "Sign In"
											}) }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
												to: "/login",
												className: "hover:text-[#00f0ff] transition-colors",
												children: "Sign Up"
											}) }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
												to: "/chat",
												className: "hover:text-[#00f0ff] transition-colors",
												children: "Customer Chat"
											}) }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
												to: "/dashboard",
												className: "hover:text-[#00f0ff] transition-colors",
												children: "Dashboard"
											}) })
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
										className: "text-xs font-bold uppercase tracking-widest text-white",
										children: "Support"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
										className: "space-y-2.5 text-xs text-slate-400",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
												href: "#pricing",
												className: "hover:text-[#00f0ff] transition-colors",
												children: "FAQ"
											}) }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
												href: "mailto:mukulsharmaworks@gmail.com",
												className: "hover:text-[#00f0ff] transition-colors",
												children: "Contact"
											}) }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
												href: "#",
												className: "hover:text-[#00f0ff] transition-colors",
												children: "Terms of Use"
											}) }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
												href: "#",
												className: "hover:text-[#00f0ff] transition-colors",
												children: "Privacy Policy"
											}) })
										]
									})]
								})
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 sm:pr-24",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-slate-400 font-medium",
						children: ["INVENTROX by ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-white font-bold",
							children: "MUKUL SHARMA"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "mailto:mukulsharmaworks@gmail.com",
								title: "Gmail",
								className: "grid size-8 place-items-center rounded-lg bg-white/5 hover:bg-[#00f0ff]/20 text-slate-400 hover:text-[#00f0ff] border border-white/10 transition-all cursor-pointer",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "https://github.com",
								target: "_blank",
								rel: "noopener noreferrer",
								title: "GitHub",
								className: "grid size-8 place-items-center rounded-lg bg-white/5 hover:bg-[#00f0ff]/20 text-slate-400 hover:text-[#00f0ff] border border-white/10 transition-all cursor-pointer",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Github, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "https://linkedin.com",
								target: "_blank",
								rel: "noopener noreferrer",
								title: "LinkedIn",
								className: "grid size-8 place-items-center rounded-lg bg-white/5 hover:bg-[#00f0ff]/20 text-slate-400 hover:text-[#00f0ff] border border-white/10 transition-all cursor-pointer",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Linkedin, { className: "size-4" })
							})
						]
					})]
				})]
			})
		})
	})] });
}
var plans = [
	{
		name: "Trial",
		price: "₹0",
		period: "14 days",
		desc: "Experience the intelligent command center, risk-free.",
		features: [
			"Full access to dashboard modules",
			"Single-outlet inventory tracking",
			"Basic invoice printing templates",
			"Offline demo preview mode"
		],
		cta: "Start free trial",
		highlight: false,
		delay: 0
	},
	{
		name: "Standard",
		price: "₹999",
		period: "month",
		desc: "Complete operational suite for growing retail outlets.",
		features: [
			"Unified AI assistant (Mini)",
			"Multi-outlet sync & inventory alerts",
			"Unlimited GST compliant invoicing",
			"CRM database & WhatsApp reminders",
			"Real-time margins & sales analytics"
		],
		cta: "Go Standard",
		highlight: true,
		delay: 150
	},
	{
		name: "Enterprise",
		price: "Custom",
		period: "tailored",
		desc: "Advanced configurations for multi-branch distribution.",
		features: [
			"Everything in Standard",
			"Unlimited branches & warehouses",
			"Dedicated database instance",
			"Priority SLA support & training",
			"Custom ERP & n8n integrations"
		],
		cta: "Contact sales",
		highlight: false,
		delay: 300
	}
];
function PricingSection() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "pricing",
		className: "mx-auto max-w-6xl px-5 py-24 min-h-screen flex flex-col justify-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollReveal, {
			variant: "fade-up",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-2xl text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-semibold uppercase tracking-[0.2em] text-[#00f0ff]",
						children: "Simple, Transparent Pricing"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "mt-4 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl text-white",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextReveal, { text: "Choose the plan that" }),
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextReveal, {
								className: "bg-gradient-to-r from-[#00f0ff] to-purple-400 bg-clip-text text-transparent font-extrabold",
								text: "fuels your growth",
								delay: 320
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mx-auto mt-5 max-w-xl text-base text-slate-300",
						children: "Try all features for 14 days. No credit card required, cancel anytime."
					})
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-16 grid gap-6 md:grid-cols-3 items-stretch",
			children: plans.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollReveal, {
				variant: "fade-up",
				delay: p.delay,
				distance: 60,
				className: "h-full",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `relative flex flex-col h-full rounded-2xl p-8 transition-all duration-300 ${p.highlight ? "glass-card border-[#00f0ff]/60 bg-[#030712]/90 shadow-[0_0_35px_rgba(0,240,255,0.2)] scale-[1.02]" : "glass-card hover:border-white/20"}`,
					children: [
						p.highlight && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-[#00f0ff] px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-[#030712] shadow-[0_0_15px_rgba(0,240,255,0.5)]",
							children: "Most Popular"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-semibold text-[#00f0ff]",
									children: p.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2.5 flex items-baseline gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-4xl font-extrabold font-mono tracking-tight text-white",
										children: p.price
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs text-slate-400",
										children: ["/", p.period]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-xs leading-relaxed text-slate-300",
									children: p.desc
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1 flex flex-col gap-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "space-y-3",
								children: p.features.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-start gap-2.5 text-xs text-slate-200",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "grid size-4 shrink-0 place-items-center rounded-full bg-[#00f0ff]/20 text-[#00f0ff] mt-0.5",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-2.5" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: f })]
								}, f))
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-auto pt-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/login",
									className: `block w-full py-3 rounded-full text-center text-xs font-bold transition-all ${p.highlight ? "btn-cyan shadow-[0_0_25px_rgba(0,240,255,0.4)]" : "btn-ghost"}`,
									children: p.cta
								})
							})]
						})
					]
				})
			}, p.name))
		})]
	});
}
function MiniChatbot() {
	const [isOpen, setIsOpen] = (0, import_react.useState)(false);
	const [input, setInput] = (0, import_react.useState)("");
	const [messages, setMessages] = (0, import_react.useState)([{
		sender: "mini",
		text: "Hi there! I'm **Mini**, your INVENTROX business assistant. 👋\n\nHow can I help you today? Ask me about our features, setup, pricing, or how we replace other tools!",
		time: "Just now"
	}]);
	const [isTyping, setIsTyping] = (0, import_react.useState)(false);
	const messagesEndRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages, isTyping]);
	const handleSend = (textToSend) => {
		if (!textToSend.trim()) return;
		const userMsg = {
			sender: "user",
			text: textToSend,
			time: (/* @__PURE__ */ new Date()).toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit"
			})
		};
		setMessages((prev) => [...prev, userMsg]);
		setInput("");
		setIsTyping(true);
		setTimeout(() => {
			let replyText = "";
			const lower = textToSend.toLowerCase();
			if (lower.includes("pricing") || lower.includes("cost") || lower.includes("price") || lower.includes("free")) replyText = "INVENTROX offers a **14-day free trial** with full access, no credit card required! After the trial, our plans are:\n\n• **Standard**: ₹999/month for growing retail outlets.\n• **Enterprise**: Custom quotes for multi-branch distributors.\n\nAll plans include our unified AI engine, unlimited invoices, and live inventory sync.";
			else if (lower.includes("feature") || lower.includes("what does") || lower.includes("capabilities")) replyText = "INVENTROX replaces **5 fragmented tools** in a single beautiful dashboard:\n\n1. **AI Assistant**: Scans low stock, suggests orders, and runs business reports.\n2. **Smart POS**: Fast checkout, OTP verification, and print templates.\n3. **CRM Ledgers**: Client profiles, purchase histories, and WhatsApp reminders.\n4. **Invoicing**: GST-compliant A4 portrait and 80mm roll print templates.\n5. **Analytics**: Real-time sales curves and margins overview.";
			else if (lower.includes("inventrox") || lower.includes("what is")) replyText = "**INVENTROX** is an AI-powered Business Operating System built specifically for SMEs, retailers, and distributors. We help you run sales, billing, stock, and customer relationships from a single visual dashboard.";
			else if (lower.includes("demo") || lower.includes("try") || lower.includes("start")) replyText = "You can start testing INVENTROX immediately! Click the **'Start free trial'** button in the hero section at the top of this page to experience the operational dashboard in offline demo mode.";
			else if (lower.includes("contact") || lower.includes("support") || lower.includes("email") || lower.includes("phone")) replyText = "We're here to help! You can email our operators at **support@inventrox.com** or call us at **+91 98765 43210** for setup assistance.";
			else replyText = "That's a great question! INVENTROX includes advanced tools for that. Feel free to start a free trial or contact us at **support@inventrox.com** to learn more about how Mini can streamline your operations.";
			const miniMsg = {
				sender: "mini",
				text: replyText,
				time: (/* @__PURE__ */ new Date()).toLocaleTimeString([], {
					hour: "2-digit",
					minute: "2-digit"
				})
			};
			setMessages((prev) => [...prev, miniMsg]);
			setIsTyping(false);
		}, 1e3);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed bottom-12 right-12 z-[9999] flex flex-col items-end font-sans",
		children: [!isOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			onClick: () => setIsOpen(true),
			className: "relative flex items-center justify-end group cursor-pointer",
			title: "Chat with Mini",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mr-3 px-4 py-2 bg-white text-zinc-800 text-xs font-600 rounded-full border border-zinc-200 shadow-md opacity-0 scale-95 translate-x-4 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0 transition-all duration-300 ease-out whitespace-nowrap",
				children: "How can I help you? 👋"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "size-14 rounded-full border border-zinc-200 bg-white shadow-[0_10px_35px_rgba(0,0,0,0.15)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center relative overflow-hidden shrink-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: "/mini-avatar.jpg",
					alt: "Mini AI Chatbot",
					className: "size-full object-cover group-hover:scale-110 transition-transform duration-300"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute bottom-0 right-0 size-3 rounded-full bg-emerald-500 border-2 border-white" })]
			})]
		}), isOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-[380px] h-[520px] max-w-[95vw] rounded-[2rem] border border-zinc-200 bg-white text-zinc-800 shadow-[0_25px_60px_rgba(0,0,0,0.18)] flex flex-col overflow-hidden animate-in slide-in-from-bottom-6 duration-300",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 bg-zinc-50 border-b border-zinc-100 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: "/mini-avatar.jpg",
								alt: "Mini Agent",
								className: "size-9 rounded-full object-cover border border-zinc-200"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute bottom-0 right-0 size-2.5 rounded-full bg-emerald-500 border-2 border-white" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: "text-xs font-700 text-zinc-900 leading-tight",
							children: "Mini AI"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] text-zinc-500 font-500",
							children: "Online support agent"
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setIsOpen(false),
						className: "size-8 rounded-full hover:bg-zinc-200/60 flex items-center justify-center text-zinc-400 hover:text-zinc-600 transition-colors",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50/50",
					children: [
						messages.map((msg, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `max-w-[80%] rounded-[1.2rem] px-4 py-2.5 text-xs leading-relaxed shadow-sm ${msg.sender === "user" ? "bg-[#009ae2] text-white rounded-tr-none font-500" : "bg-white text-zinc-800 border border-zinc-200/60 rounded-tl-none"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "whitespace-pre-line",
									children: msg.text.split("**").map((chunk, i) => i % 2 === 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "font-700",
										children: chunk
									}, i) : chunk)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `block text-[8px] mt-1 text-right ${msg.sender === "user" ? "text-white/70" : "text-zinc-400"}`,
									children: msg.time
								})]
							})
						}, idx)),
						isTyping && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex justify-start",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bg-white border border-zinc-200/60 rounded-[1.2rem] rounded-tl-none px-4 py-3 flex gap-1 items-center shadow-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-1.5 rounded-full bg-zinc-400 animate-bounce" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-1.5 rounded-full bg-zinc-400 animate-bounce delay-70" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-1.5 rounded-full bg-zinc-400 animate-bounce delay-150" })
								]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref: messagesEndRef })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-4 py-2 bg-zinc-50/50 border-t border-zinc-100 flex gap-2 overflow-x-auto shrink-0 scrollbar-none",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => handleSend("What is INVENTROX?"),
							className: "shrink-0 text-[10px] font-600 px-3 py-1.5 bg-white border border-zinc-200 rounded-full hover:border-zinc-300 text-zinc-700 transition-colors",
							children: "What is INVENTROX?"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => handleSend("Pricing"),
							className: "shrink-0 text-[10px] font-600 px-3 py-1.5 bg-white border border-zinc-200 rounded-full hover:border-zinc-300 text-zinc-700 transition-colors",
							children: "Pricing Plans"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => handleSend("How can I try it?"),
							className: "shrink-0 text-[10px] font-600 px-3 py-1.5 bg-white border border-zinc-200 rounded-full hover:border-zinc-300 text-zinc-700 transition-colors",
							children: "Start Free Trial"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: (e) => {
						e.preventDefault();
						handleSend(input);
					},
					className: "p-3 border-t border-zinc-100 flex items-center gap-2 bg-white shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						placeholder: "Write a message...",
						value: input,
						onChange: (e) => setInput(e.target.value),
						className: "flex-1 text-xs border border-zinc-200 rounded-full px-4 py-2 outline-none focus:border-[#009ae2] transition-colors"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						className: "size-8 rounded-full bg-[#009ae2] hover:bg-[#0089ca] text-white flex items-center justify-center transition-transform hover:scale-105 active:scale-95 shrink-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "size-3.5 fill-current" })
					})]
				})
			]
		})]
	});
}
var workflows = [
	{
		id: "pos",
		label: "POS Checkout",
		icon: ShoppingCart,
		title: "1-Click Counter POS & Instant Barcode Scan",
		description: "Scan items, apply discounts, select payment mode, and generate instant GST digital receipts — zero lag during morning rush.",
		highlights: [
			"Bluetooth & USB barcode scanner",
			"Multiple payment modes (UPI, Card, Cash)",
			"Automatic inventory decrement"
		],
		mock: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b border-white/10 pb-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "flex size-8 items-center justify-center rounded-lg bg-[#D97B3F]/20 text-[#D97B3F] text-xs font-mono font-bold",
							children: "POS"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-semibold text-[#F5F1EC]",
							children: "Counter #1 — Active Cart"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-[#5EEAD4]",
							children: "3 Items Scanned"
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-full bg-[#5EEAD4]/10 px-2.5 py-1 text-xs font-medium text-[#5EEAD4]",
						children: "Ready"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between rounded-lg bg-white/5 p-3 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[#F5F1EC]",
							children: "2x Espresso Roast (250g)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-[#5EEAD4]",
							children: "₹960.00"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between rounded-lg bg-white/5 p-3 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[#F5F1EC]",
							children: "1x Oat Milk (1L Box)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-[#5EEAD4]",
							children: "₹240.00"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-t border-white/10 pt-3 text-sm font-bold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[#F5F1EC]",
						children: "Total Payable"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-[#D97B3F] text-lg",
						children: "₹1,200.00"
					})]
				})
			]
		})
	},
	{
		id: "reorder",
		label: "Stock Reorder",
		icon: RefreshCw,
		title: "Automated Supplier Reorders & Par Level Alerts",
		description: "Never run out of milk, beans, or cups. AI tracks daily burn rate and generates purchase orders automatically when stock drops.",
		highlights: [
			"Dynamic par level calculation",
			"Automated WhatsApp & Email PO dispatch",
			"Supplier lead-time tracking"
		],
		mock: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between border-b border-white/10 pb-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex size-8 items-center justify-center rounded-lg bg-[#5EEAD4]/20 text-[#5EEAD4] text-xs font-mono font-bold",
						children: "PO"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm font-semibold text-[#F5F1EC]",
						children: "Auto Purchase Order #PO-941"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-[#D97B3F]",
						children: "Triggered by Par Level Alert"
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "rounded-full bg-[#D97B3F]/20 px-2.5 py-1 text-xs font-medium text-[#D97B3F]",
					children: "Pending Dispatch"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-white/10 bg-white/5 p-4 text-xs space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-between text-[#F5F1EC]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Supplier: Blue Tokai Roasters" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[#5EEAD4]",
						children: "Lead Time: 24h"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[rgba(245,241,236,0.6)]",
					children: "Ordered: 40kg Colombia Excelso Green Beans"
				})]
			})]
		})
	},
	{
		id: "invoice",
		label: "GST Invoice",
		icon: FileCheck,
		title: "B2B & B2C Compliant GST Invoicing & GSTR-1",
		description: "Generate compliant tax invoices with HSN codes in seconds. Auto-calculate CGST, SGST, IGST and export one-click GSTR-1 reports.",
		highlights: [
			"Automatic HSN code lookup",
			"B2B party GSTIN validation",
			"One-click GSTR-1 JSON export"
		],
		mock: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between border-b border-white/10 pb-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex size-8 items-center justify-center rounded-lg bg-[#D97B3F]/20 text-[#D97B3F] text-xs font-mono font-bold",
						children: "GST"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm font-semibold text-[#F5F1EC]",
						children: "Tax Invoice #INV-2026-881"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-[#5EEAD4]",
						children: "HSN: 0901 — Coffee Beans"
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "rounded-full bg-emerald-500/20 px-2.5 py-1 text-xs font-medium text-emerald-400",
					children: "GST Verified"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3 text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg bg-white/5 p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[rgba(245,241,236,0.6)]",
						children: "Taxable Amount"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-mono text-[#F5F1EC] font-bold mt-1",
						children: "₹14,500.00"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg bg-white/5 p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[rgba(245,241,236,0.6)]",
						children: "CGST (2.5%) + SGST (2.5%)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-mono text-[#5EEAD4] font-bold mt-1",
						children: "₹725.00"
					})]
				})]
			})]
		})
	},
	{
		id: "forecast",
		label: "AI Forecast",
		icon: Sparkles,
		title: "Predictive Demand & Revenue Insights",
		description: "Machine learning algorithms analyze historical sales patterns, weather, and weekend rushes to forecast inventory requirements 14 days out.",
		highlights: [
			"14-day rolling demand prediction",
			"Roast batch yield optimization",
			"Waste reduction analytics"
		],
		mock: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between border-b border-white/10 pb-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex size-8 items-center justify-center rounded-lg bg-[#5EEAD4]/20 text-[#5EEAD4] text-xs font-mono font-bold",
						children: "AI"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm font-semibold text-[#F5F1EC]",
						children: "Weekend Demand Forecast"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-[#5EEAD4]",
						children: "Confidence Score: 98.4%"
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "rounded-full bg-[#5EEAD4]/20 px-2.5 py-1 text-xs font-medium text-[#5EEAD4]",
					children: "+18% Peak Expected"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-white/10 bg-white/5 p-4 text-xs space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-between items-center text-[#F5F1EC]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Suggested Roast Yield" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-[#D97B3F] font-bold",
						children: "85kg (Batch #R-402)"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-full bg-white/10 rounded-full h-2 overflow-hidden",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gradient-to-r from-[#D97B3F] to-[#5EEAD4] h-full w-[85%]" })
				})]
			})]
		})
	}
];
function WorkflowExplorer() {
	const [activeTab, setActiveTab] = (0, import_react.useState)("pos");
	const current = workflows.find((w) => w.id === activeTab) || workflows[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "workflow",
		className: "mx-auto max-w-6xl px-5 py-24 min-h-screen flex flex-col justify-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollReveal, {
				variant: "fade-up",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-center max-w-3xl mx-auto",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-semibold uppercase tracking-[0.2em] text-[#00f0ff]",
							children: "Tabbed Workflow Explorer"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "mt-4 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl text-white",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextReveal, { text: "Explore operational use cases" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextReveal, {
									className: "bg-gradient-to-r from-[#00f0ff] via-cyan-200 to-purple-400 bg-clip-text text-transparent font-extrabold",
									text: "built for speed & control",
									delay: 300
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-base text-slate-300 sm:text-lg",
							children: "See how INVENTROX transforms everyday counter, inventory, and back-office tasks."
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-12 flex justify-center flex-wrap gap-3",
				children: workflows.map((w) => {
					const isActive = w.id === activeTab;
					const Icon = w.icon;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setActiveTab(w.id),
						className: `flex items-center gap-2.5 px-6 py-3 rounded-full text-sm font-semibold transition-all ${isActive ? "bg-gradient-to-r from-[#00f0ff] to-[#0284c7] text-[#030712] shadow-[0_0_25px_rgba(0,240,255,0.4)] scale-[1.03]" : "glass text-slate-300 hover:bg-white/10 hover:text-white"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" }), w.label]
					}, w.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 grid gap-8 lg:grid-cols-12 items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:col-span-6 space-y-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-2xl font-bold text-white leading-snug",
							children: current.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-base text-slate-300 leading-relaxed",
							children: current.description
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-3",
							children: current.highlights.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center gap-3 text-sm text-slate-200",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-4 text-[#00f0ff] shrink-0" }), item]
							}, item))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "pt-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: "#cta",
								className: "btn-cyan inline-flex items-center gap-2 text-sm",
								children: ["Try this workflow live ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
							})
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "lg:col-span-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "glass-card p-6 md:p-8 border-[#00f0ff]/20 bg-[#030712]/90 shadow-[0_0_40px_rgba(0,240,255,0.1)] relative overflow-hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute top-0 right-0 p-3 text-[10px] font-mono text-[#00f0ff]",
							children: "LIVE MOCK INTERACTION"
						}), current.mock]
					})
				})]
			})
		]
	});
}
var trustTiles = [
	{
		icon: ShieldCheck,
		title: "Multi-Tenant RLS Isolation",
		description: "Row-Level Security policies in Supabase ensure store & organization data is cryptographically isolated."
	},
	{
		icon: History,
		title: "Immutable Audit Trail",
		description: "Every invoice creation, stock adjustment, and price edit is recorded with precise timestamps & user ID."
	},
	{
		icon: UserCheck,
		title: "Role-Based Access Control",
		description: "Granular permissions for Baristas, Store Managers, Accountants, and Roastery Admins."
	},
	{
		icon: Receipt,
		title: "GST & GSTR-1 Compliance",
		description: "Built-in HSN code mapping, CGST/SGST splitting, and instant JSON exports for GSTR-1 filing."
	},
	{
		icon: WifiOff,
		title: "Three-Tier Offline Resilience",
		description: "Local storage persistence queues offline counter sales and auto-syncs when internet restores."
	},
	{
		icon: Activity,
		title: "99.98% Sync Uptime",
		description: "High-availability cloud architecture ensures real-time stock sync across multiple cafe locations."
	},
	{
		icon: Cpu,
		title: "n8n & Webhook Integrations",
		description: "Connect WhatsApp, Shopify, QuickBooks, and custom webhooks effortlessly with built-in n8n workflows."
	},
	{
		icon: HeartHandshake,
		title: "Dedicated Onboarding",
		description: "Our technical team handles inventory migration from legacy POS software or Excel within 48 hours."
	}
];
function EnterpriseTrustGrid() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "security",
		className: "mx-auto max-w-6xl px-5 py-24 min-h-screen flex flex-col justify-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollReveal, {
			variant: "fade-up",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center max-w-3xl mx-auto",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-semibold uppercase tracking-[0.2em] text-[#00f0ff]",
						children: "Enterprise Trust & Security"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "mt-4 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl text-white",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextReveal, { text: "Sovereign security & reliability" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextReveal, {
								className: "bg-gradient-to-r from-[#00f0ff] via-cyan-200 to-purple-400 bg-clip-text text-transparent font-extrabold",
								text: "for multi-location operations",
								delay: 300
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-base text-slate-300 sm:text-lg",
						children: "Built from the ground up for high-availability retail and multi-branch operations."
					})
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4",
			children: trustTiles.map((tile, i) => {
				const Icon = tile.icon;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollReveal, {
					variant: "fade-up",
					delay: i * 80,
					className: "h-full",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "glass-card p-6 h-full flex flex-col justify-between hover:border-[#00f0ff]/40 transition-all",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex size-11 items-center justify-center rounded-xl bg-[#00f0ff]/10 text-[#00f0ff] shadow-[0_0_15px_rgba(0,240,255,0.15)]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mt-5 text-base font-bold text-white",
								children: tile.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-xs leading-relaxed text-slate-300",
								children: tile.description
							})
						] })
					})
				}, tile.title);
			})
		})]
	});
}
var testimonials = [
	{
		quote: "INVENTROX replaced three separate billing and inventory apps across our roastery and 4 cafes. Our stockouts dropped by 90% in the first month.",
		author: "Vikram Mehta",
		role: "Head of Operations",
		company: "Artisanal Roast Co.",
		rating: 5
	},
	{
		quote: "The barcode POS and automated GST invoicing save our baristas 45 minutes every single shift. It just works seamlessly during weekend rushes.",
		author: "Ananya Sharma",
		role: "Founder & Lead Roaster",
		company: "Single Origin Roasters",
		rating: 5
	},
	{
		quote: "The AI forecast alerts us exactly 4 days before green coffee bean reserves hit critical levels. It's like having a co-founder managing stock 24/7.",
		author: "Rohan Kapoor",
		role: "Supply Chain Manager",
		company: "BrewCraft Coffee Estate",
		rating: 5
	}
];
function TestimonialCarousel() {
	const [index, setIndex] = (0, import_react.useState)(0);
	const prev = () => setIndex((i) => i === 0 ? testimonials.length - 1 : i - 1);
	const next = () => setIndex((i) => i === testimonials.length - 1 ? 0 : i + 1);
	const current = testimonials[index];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "testimonials",
		className: "mx-auto max-w-6xl px-5 py-24 min-h-screen flex flex-col justify-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollReveal, {
			variant: "fade-up",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center max-w-3xl mx-auto",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs font-semibold uppercase tracking-[0.2em] text-[#00f0ff]",
					children: "Customer Success Stories"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "mt-4 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl text-white",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextReveal, { text: "Trusted by India's leading" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextReveal, {
							className: "bg-gradient-to-r from-[#00f0ff] via-cyan-200 to-purple-400 bg-clip-text text-transparent font-extrabold",
							text: "fast-growing enterprises",
							delay: 300
						})
					]
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-14 max-w-3xl mx-auto w-full",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass-card p-8 md:p-12 relative border-[#00f0ff]/30 bg-[#030712]/90 shadow-[0_0_40px_rgba(0,240,255,0.15)] text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Quote, { className: "size-12 text-[#00f0ff]/30 mx-auto mb-6" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex justify-center gap-1 text-[#00f0ff] mb-6",
						children: [...Array(current.rating)].map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "size-5 fill-[#00f0ff]" }, i))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xl md:text-2xl font-medium text-white leading-relaxed italic",
						children: [
							"\"",
							current.quote,
							"\""
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 border-t border-white/10 pt-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-lg font-bold text-white",
							children: current.author
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-sm text-[#00f0ff]",
							children: [
								current.role,
								" — ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-slate-300",
									children: current.company
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 flex justify-center items-center gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: prev,
								className: "flex size-10 items-center justify-center rounded-full glass text-white hover:bg-white/10 transition-colors",
								"aria-label": "Previous testimonial",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs font-mono text-slate-400",
								children: [
									index + 1,
									" / ",
									testimonials.length
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: next,
								className: "flex size-10 items-center justify-center rounded-full glass text-white hover:bg-white/10 transition-colors",
								"aria-label": "Next testimonial",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-5" })
							})
						]
					})
				]
			})
		})]
	});
}
if (typeof window !== "undefined") gsapWithCSS.registerPlugin(ScrollTrigger);
function Index() {
	(0, import_react.useEffect)(() => {
		if (typeof window === "undefined") return;
		const originalScrollBehavior = document.documentElement.style.scrollBehavior;
		document.documentElement.style.scrollBehavior = "auto";
		const lenis = new Lenis({
			duration: 1.2,
			easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
			orientation: "vertical",
			gestureOrientation: "vertical",
			smoothWheel: true,
			wheelMultiplier: 1,
			touchMultiplier: 2
		});
		lenis.on("scroll", () => {
			ScrollTrigger.update();
		});
		const gsapTickerUpdate = (time) => {
			lenis.raf(time * 1e3);
		};
		gsapWithCSS.ticker.add(gsapTickerUpdate);
		window.lenis = lenis;
		return () => {
			gsapWithCSS.ticker.remove(gsapTickerUpdate);
			lenis.destroy();
			document.documentElement.style.scrollBehavior = originalScrollBehavior;
			window.lenis = void 0;
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative min-h-screen bg-[#0B0908] text-[#F5F1EC]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Background, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navbar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hero, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProblemSection, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeaturesBento, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorkflowExplorer, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HowItWorks, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EnterpriseTrustGrid, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GrowthSection, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TestimonialCarousel, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PricingSection, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CtaFooter, {})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniChatbot, {})
		]
	});
}
//#endregion
export { Index as component };
