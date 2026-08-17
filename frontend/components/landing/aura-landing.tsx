"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight, BookOpen, Boxes, Check, ChevronRight, CircleDollarSign, Code2,
  CircleHelp, Droplets, Gauge, Globe2, Layers3, LockKeyhole, Menu, Orbit, Repeat2,
  ShieldCheck, Sparkles, TimerReset, TrendingUp, WalletCards, X, Zap,
} from "lucide-react";
import WalletButton from "@/components/WalletButton";
import { usePool } from "@/hooks/usePool";
import { useOnboarding } from "@/components/onboarding/OnboardingProvider";
import styles from "./lumina-landing.module.css";

const features = [
  { icon: Gauge, title: "Capital Efficient", text: "Concentrated liquidity puts more of your capital to work." },
  { icon: Zap, title: "Low Fees", text: "Optimized Soroban contracts for efficient, low-cost swaps." },
  { icon: ShieldCheck, title: "Secure & Audited", text: "Transparent execution secured by Stellar Soroban." },
  { icon: SlidersIcon, title: "Flexible Trading", text: "Custom ranges designed around your market strategy." },
];

const whyFeatures = [
  { icon: Gauge, title: "Capital efficient", text: "Concentrate liquidity where trading happens and get more from every deposited asset." },
  { icon: CircleDollarSign, title: "Minimal fees", text: "Fast finality and predictable Soroban execution keep transaction costs under control." },
  { icon: SlidersIcon, title: "Flexible ranges", text: "Build positions around your price view instead of accepting a one-size-fits-all curve." },
  { icon: ShieldCheck, title: "Trustless by design", text: "Assets remain under your control, with every operation settling transparently on-chain." },
  { icon: TimerReset, title: "Lightning fast", text: "Stellar-grade settlement gives traders a responsive experience without centralized custody." },
  { icon: Boxes, title: "Composable", text: "Open, modular contracts create a foundation for integrations, strategies, and new markets." },
];

const poolRows = [
  { pair: "XLM / USDC", tvl: "$8.42M", volume: "$3.18M", apr: "48.6%", fee: "0.30%", icons: ["/xlm.svg", "/usdc.svg"] },
  { pair: "XLM / EURC", tvl: "$4.86M", volume: "$1.21M", apr: "31.4%", fee: "0.30%", icons: ["/xlm.svg", null] },
  { pair: "XLM / AQUA", tvl: "$2.91M", volume: "$842K", apr: "27.8%", fee: "1.00%", icons: ["/xlm.svg", null] },
  { pair: "USDC / EURC", tvl: "$1.74M", volume: "$590K", apr: "14.2%", fee: "0.05%", icons: ["/usdc.svg", null] },
];

const roadmap = [
  { phase: "Phase 01", title: "Launch", items: ["CLMM core", "Swap", "Liquidity", "Positions"], color: "purple" },
  { phase: "Phase 02", title: "Expand", items: ["More assets", "Advanced pools", "Analytics"], color: "blue" },
  { phase: "Phase 03", title: "Optimize", items: ["Smart routing", "Limit orders", "Governance"], color: "cyan" },
  { phase: "Phase 04", title: "Ecosystem", items: ["SDK", "Integrations", "Developer APIs"], color: "green" },
];

function SlidersIcon({ size = 20, className }: { size?: number; className?: string }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true"><path d="M4 7h10M18 7h2M4 17h2M10 17h10M14 4v6M8 14v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>;
}

function Brand({ compact = false }: { compact?: boolean }) {
  return <span className={styles.brand}><span className={styles.brandMark} aria-hidden="true">{Array.from({ length: 12 }).map((_, index) => <i key={index} style={{ transform: `rotate(${index * 30}deg)` }} />)}</span>{!compact && <span>Lumina<span>Dex</span></span>}</span>;
}

function LandingNav() {
  const [open, setOpen] = useState(false);
  const { openGuide } = useOnboarding();
  const links = [{ label: "Features", href: "#features" }, { label: "Liquidity", href: "#liquidity" }, { label: "Docs", href: "#clmm" }, { label: "Governance", href: "#roadmap" }, { label: "Roadmap", href: "#roadmap" }];
  return <header className={styles.header}><nav className={styles.nav} aria-label="Main navigation"><Link href="/" aria-label="LuminaDex home"><Brand /></Link><div className={styles.navLinks}>{links.map((link) => <a key={link.label} href={link.href}>{link.label}</a>)}</div><div className={styles.navActions}><button type="button" className={styles.learnButton} onClick={openGuide}><CircleHelp size={15} /> Learn</button><a href="#faq" className={styles.faq}>FAQ</a><div data-tour="wallet" className={`${styles.walletMount} ${styles.navWallet}`}><WalletButton /></div></div><button className={styles.menuButton} onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label="Toggle navigation">{open ? <X size={21} /> : <Menu size={21} />}</button></nav>{open && <div className={styles.mobileNav}>{links.map((link) => <a key={link.label} href={link.href} onClick={() => setOpen(false)}>{link.label}</a>)}<button type="button" className={styles.mobileLearnButton} onClick={() => { setOpen(false); openGuide(); }}><CircleHelp size={15} /> Learn</button><a href="#faq" onClick={() => setOpen(false)}>FAQ</a><div data-tour="wallet" className={`${styles.walletMount} ${styles.mobileWallet}`}><WalletButton /></div><Link href="/swap" data-tour="swap" onClick={() => setOpen(false)}>Launch App <ArrowRight size={15} /></Link></div>}</header>;
}

function AuroraBackground() {
  return <div className={styles.aurora} aria-hidden="true"><div className={styles.auroraLeft} /><div className={styles.auroraCenter} /><div className={styles.auroraRight} /><div className={styles.noise} /></div>;
}

function TokenIcon({ src, label, fallback }: { src?: string | null; label: string; fallback?: string }) {
  return src ? <Image src={src} alt={label} width={26} height={26} className={styles.tokenIcon} /> : <span className={styles.tokenFallback}>{fallback ?? label.charAt(0)}</span>;
}

function MarketChart() {
  const path = "M0 184 L18 168 L30 174 L45 150 L59 161 L71 130 L85 137 L98 127 L110 142 L126 131 L142 149 L158 141 L174 122 L190 116 L205 97 L220 110 L236 106 L252 128 L267 119 L281 138 L296 129 L310 149 L324 133 L339 145 L354 125 L370 116 L384 97 L398 109 L412 92 L425 105 L440 88 L455 98 L470 73 L483 89 L498 64 L512 84 L526 72 L541 100 L556 89 L570 106 L585 82 L598 90 L611 65 L626 70 L639 55 L652 63 L665 30 L677 50 L690 33 L705 56 L720 63 L735 53 L747 35 L760 29";
  return <div className={styles.chartWrap}><svg viewBox="0 0 760 220" preserveAspectRatio="none" role="img" aria-label="Decorative XLM to USDC 24 hour price chart"><defs><linearGradient id="lineGradient" x1="0" x2="1"><stop offset="0" stopColor="#7955ff" /><stop offset=".48" stopColor="#4ca4ff" /><stop offset="1" stopColor="#50edb0" /></linearGradient><linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3aaef0" stopOpacity=".25" /><stop offset="1" stopColor="#131d66" stopOpacity="0" /></linearGradient><filter id="chartGlow"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs><g className={styles.gridLines}><line x1="0" y1="34" x2="760" y2="34" /><line x1="0" y1="98" x2="760" y2="98" /><line x1="0" y1="162" x2="760" y2="162" /></g><path className={styles.chartArea} d={`${path} L760 220 L0 220 Z`} /><path className={styles.chartLine} pathLength="1" d={path} /><circle cx="760" cy="29" r="5" fill="#50edb0" stroke="#d8fff0" strokeWidth="3" filter="url(#chartGlow)" /></svg><div className={styles.chartLabels}><span>12:00 AM</span><span>6:00 AM</span><span>12:00 PM</span><span>6:00 PM</span><span>12:00 AM</span></div></div>;
}

function SwapPreview() {
  return <div className={styles.swapCard}><div className={styles.swapTitle}><span>Swap</span><SlidersIcon size={17} /></div><div className={styles.tokenInput}><div><small>You pay</small><div className={styles.asset}><TokenIcon src="/xlm.svg" label="Stellar Lumens" /><span><b>XLM</b><small>Stellar Lumens</small></span></div></div><div className={styles.amount}><b>100</b><small>$11.24</small></div></div><button className={styles.swapDirection} aria-label="Switch assets"><Repeat2 size={15} /></button><div className={styles.tokenInput}><div><small>You receive</small><div className={styles.asset}><TokenIcon src="/usdc.svg" label="USD Coin" /><span><b>USDC</b><small>USD Coin</small></span></div></div><div className={styles.amount}><b>11.24</b><small>$11.24</small></div></div><div className={`${styles.walletMount} ${styles.previewWallet}`}><WalletButton /></div><div className={styles.tradeDetails}><span>Best price <b>1 XLM ≈ 0.1124 USDC</b></span><span>Slippage tolerance <b>0.5%</b></span></div></div>;
}

function TradingPreview() {
  const [timeframe, setTimeframe] = useState("1D");
  const { data: pool } = usePool();
  const livePrice = pool?.currentPrice && pool.currentPrice > 0 ? 1 / pool.currentPrice : 0.1124;
  return <div className={styles.productStage}><div className={styles.tradingPanel}><SwapPreview /><div className={styles.marketPanel}><div className={styles.marketTop}><div><div className={styles.pairTitle}><TokenIcon src="/xlm.svg" label="XLM" /><strong>XLM / USDC</strong><span>0.3% Fee</span></div><div className={styles.priceLine}><strong>{livePrice.toFixed(4)}</strong><span>USDC</span><em>+2.45% (24h)</em>{pool && <i>{pool.isPriceStale ? "On-chain" : "Live"}</i>}</div></div><div className={styles.timeframes}>{["1H", "1D", "1W", "1M", "1Y"].map((item) => <button key={item} onClick={() => setTimeframe(item)} className={timeframe === item ? styles.activeTimeframe : ""}>{item}</button>)}</div></div><MarketChart /></div></div><FeatureStrip /></div>;
}

function FeatureStrip() {
  return <div className={styles.featureStrip}>{features.map(({ icon: Icon, title, text }) => <div key={title} className={styles.stripItem}><span className={styles.iconBox}><Icon size={21} /></span><span><b>{title}</b><small>{text}</small></span></div>)}</div>;
}

function SectionHeading({ eyebrow, title, text, align = "center" }: { eyebrow: string; title: React.ReactNode; text?: string; align?: "center" | "left" }) {
  return <div className={`${styles.sectionHeading} ${align === "left" ? styles.alignLeft : ""}`}><span className={styles.eyebrow}>{eyebrow}</span><h2>{title}</h2>{text && <p>{text}</p>}</div>;
}

function StatsSection() {
  const stats = [["$24.6M+", "Total value locked"], ["218K+", "Total trades"], ["12.4K+", "Liquidity providers"], ["$1.2B+", "Total volume"], ["99.99%", "Uptime"]];
  return <section className={styles.section} aria-label="Protocol statistics"><div className={styles.statsCard}><div className={styles.statsMeta}><span className={styles.liveDot} /> Protocol snapshot <small>Presentation metrics</small></div><div className={styles.statsGrid}>{stats.map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div></div></section>;
}

function WhySection() {
  return <section id="features" className={styles.section}><SectionHeading eyebrow="Why LuminaDex" title={<>Built different.<br /><span>Built for DeFi.</span></>} text="Institutional-grade market infrastructure with the speed and openness of Stellar." /><div className={styles.whyGrid}>{whyFeatures.map(({ icon: Icon, title, text }, index) => <article key={title} className={styles.featureCard}><span className={styles.cardIndex}>0{index + 1}</span><span className={styles.featureIcon}><Icon size={22} /></span><h3>{title}</h3><p>{text}</p><div className={styles.cardGlow} /></article>)}</div></section>;
}

function LiquidityCurve() {
  return <div className={styles.curveCard}><div className={styles.curveHeader}><div><span className={styles.assetStack}><TokenIcon src="/xlm.svg" label="XLM" /><TokenIcon src="/usdc.svg" label="USDC" /></span><span><small>Liquidity position</small><b>XLM / USDC</b></span></div><span>Active</span></div><div className={styles.curveChart}><div className={styles.curveGrid} /><svg viewBox="0 0 620 250" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="curveFill" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#5d71ff" stopOpacity=".44" /><stop offset="1" stopColor="#5d71ff" stopOpacity="0" /></linearGradient><linearGradient id="curveStroke"><stop stopColor="#875cff" /><stop offset=".55" stopColor="#52b9ff" /><stop offset="1" stopColor="#53efb0" /></linearGradient></defs><path d="M0 220 C75 219 112 215 150 199 C188 184 206 129 238 72 C252 47 270 29 297 27 C326 28 343 54 359 81 C385 126 403 183 449 201 C495 219 550 218 620 220 L620 250 L0 250 Z" fill="url(#curveFill)" /><path d="M0 220 C75 219 112 215 150 199 C188 184 206 129 238 72 C252 47 270 29 297 27 C326 28 343 54 359 81 C385 126 403 183 449 201 C495 219 550 218 620 220" fill="none" stroke="url(#curveStroke)" strokeWidth="3" /><line x1="180" y1="25" x2="180" y2="230" stroke="#7a65ff" strokeDasharray="5 7" /><line x1="455" y1="25" x2="455" y2="230" stroke="#55e4b1" strokeDasharray="5 7" /><line x1="326" y1="18" x2="326" y2="230" stroke="white" strokeOpacity=".5" strokeDasharray="3 7" /></svg><span className={`${styles.curveTag} ${styles.tagMin}`}>Min · 0.0980</span><span className={`${styles.curveTag} ${styles.tagCurrent}`}>Current · 0.1124</span><span className={`${styles.curveTag} ${styles.tagMax}`}>Max · 0.1260</span></div><div className={styles.rangeStats}><div><small>Your range</small><b>0.0980 — 0.1260</b></div><div><small>Fee tier</small><b>0.30%</b></div><div><small>Estimated APR</small><b className={styles.green}>48.6%</b></div></div></div>;
}

function ClmmSection() {
  const benefits = ["Better capital efficiency", "Higher potential fee generation", "Custom price ranges", "Improved execution"];
  return <section id="clmm" className={`${styles.section} ${styles.splitSection}`}><div className={styles.splitCopy}><span className={styles.eyebrow}>Concentrated liquidity</span><h2>The power of <span>CLMM.</span></h2><p>Traditional liquidity spreads capital across every possible price. LuminaDex lets LPs focus their liquidity around the ranges where trading actually occurs.</p><ul>{benefits.map((benefit) => <li key={benefit}><Check size={16} /> {benefit}</li>)}</ul><a href="#liquidity" className={styles.textLink}>Learn more about CLMM <ArrowRight size={16} /></a></div><LiquidityCurve /></section>;
}

function PoolsSection() {
  return <section id="liquidity" className={styles.section}><div className={styles.sectionTitleRow}><SectionHeading eyebrow="Explore liquidity" title={<>Deploy capital where <span>it matters.</span></>} align="left" /><Link href="/liquidity" className={styles.secondaryButton}>View all pools <ArrowRight size={16} /></Link></div><div className={styles.poolTable}><div className={styles.poolHead}><span>Pool</span><span>TVL</span><span>24h volume</span><span>APR</span><span>Fee tier</span><span /></div>{poolRows.map((pool) => <div className={styles.poolRow} key={pool.pair}><div className={styles.poolPair}><span className={styles.assetStack}><TokenIcon src={pool.icons[0]} label={pool.pair.split(" / ")[0]} /><TokenIcon src={pool.icons[1]} fallback={pool.pair.split(" / ")[1].charAt(0)} label={pool.pair.split(" / ")[1]} /></span><span><b>{pool.pair}</b><small>Stellar Soroban</small></span></div><span data-label="TVL">{pool.tvl}</span><span data-label="24h volume">{pool.volume}</span><strong data-label="APR">{pool.apr}</strong><span data-label="Fee tier">{pool.fee}</span><div className={styles.poolActions}><Link href="/liquidity">View pool</Link><Link href="/liquidity/new">Add liquidity <ChevronRight size={14} /></Link></div></div>)}<p className={styles.previewNote}>Market figures shown are presentation placeholders. Live XLM/USDC state is sourced through the existing pool hook in the product preview.</p></div></section>;
}

function HowItWorks() {
  const steps = [
    { icon: WalletCards, title: "Connect Your Wallet", text: "Connect your Stellar wallet to securely interact with LuminaDex and access Swap, Liquidity, and Portfolio features." },
    { icon: Repeat2, title: "Swap XLM & USDC", text: "Choose the token you want to swap, enter an amount, review the exchange rate, price impact and slippage, then confirm in your wallet.", note: "Always review the minimum amount received before confirming." },
    { icon: Droplets, title: "Provide Liquidity", text: "Deposit XLM and USDC into a selected price range and earn fees when trades occur within your active liquidity range.", note: "Instead of spreading liquidity across every possible price, you choose the range where your capital should be active." },
    { icon: TrendingUp, title: "Monitor Your Position", text: "View your liquidity positions, token balances and activity from the Portfolio dashboard.", cta: true },
  ];
  return <section className={`${styles.section} ${styles.howSection}`}><SectionHeading eyebrow="How LuminaDex Works" title={<>Swap or provide liquidity<br />in <span>clear steps.</span></>} text="Swap tokens or provide concentrated liquidity on Stellar in just a few steps." /><div className={styles.steps}>{steps.map(({ icon: Icon, title, text, note, cta }, index) => <article key={title}><span className={styles.stepNumber}>0{index + 1}</span><span className={styles.stepIcon}><Icon size={24} /></span><h3>{title}</h3><p>{text}</p>{note && <small className={styles.stepNote}>{note}</small>}{cta && <Link href="/swap" data-tour="swap" className={styles.stepCta}>Launch App <ArrowRight size={15} /></Link>}{index < steps.length - 1 && <ArrowRight className={styles.stepArrow} size={22} />}</article>)}</div></section>;
}

function BeginnerGuideSection() {
  const concepts = [
    ["What is Slippage?", "Slippage is the difference between the expected token price and the final execution price. Higher market movement may result in a slightly different final amount."],
    ["What is Price Impact?", "Price impact shows how much your trade may affect the pool price. Larger trades generally create a larger price impact."],
    ["What is Concentrated Liquidity?", "Concentrated liquidity allows liquidity providers to choose the price range where their assets are actively used for trading."],
    ["What is Minimum Received?", "The minimum amount of tokens you are guaranteed to receive based on your selected slippage tolerance."],
    ["What is a Liquidity Range?", "Your liquidity earns trading fees while the market price remains inside your selected range."],
  ];
  return <section className={`${styles.section} ${styles.beginnerSection}`}><SectionHeading eyebrow="New to DeFi?" title={<>Learn the terms<br /><span>before you trade.</span></>} text="LuminaDex explains the important concepts before you commit a transaction." /><div className={styles.conceptGrid}>{concepts.map(([title, text], index) => <article key={title} className={styles.conceptCard}><span>0{index + 1}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>;
}

function LiquiditySection() {
  return <section className={`${styles.section} ${styles.lpSection}`}><div className={styles.lpGlow} /><div className={styles.splitCopy}><span className={styles.eyebrow}>Built for liquidity providers</span><h2>Your liquidity.<br />Your range.<br /><span>Your strategy.</span></h2><p>Choose exactly where your liquidity works instead of spreading capital across an infinite price curve.</p><Link href="/liquidity" className={styles.primaryButton}>Explore liquidity <ArrowRight size={16} /></Link></div><div className={styles.positionCard}><div className={styles.positionTop}><div className={styles.poolPair}><span className={styles.assetStack}><TokenIcon src="/xlm.svg" label="XLM" /><TokenIcon src="/usdc.svg" label="USDC" /></span><span><small>Liquidity position</small><b>XLM / USDC</b></span></div><span>In range</span></div><div className={styles.positionGraph}><i /><i /><span className={styles.positionFill} /><b>Current price <em>0.1124</em></b></div><div className={styles.positionValues}><div><small>Min price</small><b>0.0980</b><span>USDC per XLM</span></div><div><small>Current</small><b>0.1124</b><span>USDC per XLM</span></div><div><small>Max price</small><b>0.1260</b><span>USDC per XLM</span></div></div><div className={styles.aprRow}><span><small>Estimated APR</small><b>48.6%</b></span><span><small>Fee tier</small><b>0.30%</b></span></div></div></section>;
}

function SecuritySection() {
  const items = [{ icon: Orbit, title: "Soroban smart contracts", text: "Purpose-built CLMM logic executing directly on Stellar." }, { icon: LockKeyhole, title: "Non-custodial", text: "You keep control of your assets until a transaction settles." }, { icon: Globe2, title: "Transparent execution", text: "Every pool, swap, and position is verifiable on-chain." }, { icon: Code2, title: "Open architecture", text: "Modular infrastructure designed for ecosystem composability." }];
  return <section id="security" className={styles.section}><SectionHeading eyebrow="Security by design" title={<>Built for trustless <span>finance.</span></>} text="Transparent infrastructure from the interface down to Soroban settlement." /><div className={styles.securityGrid}><div className={styles.architecture}><div className={styles.archGlow} /><span className={styles.archTitle}><Brand compact /> LuminaDex</span><div className={styles.archLine} /><div className={styles.archNodes}><span><Repeat2 size={18} />Router</span><span><Droplets size={18} />Pools</span><span><Layers3 size={18} />Position manager</span></div><div className={styles.sorobanNode}><Orbit size={18} /> Stellar Soroban</div></div><div className={styles.securityCards}>{items.map(({ icon: Icon, title, text }) => <article key={title}><span><Icon size={20} /></span><div><h3>{title}</h3><p>{text}</p></div></article>)}</div></div></section>;
}

function EcosystemSection() {
  const names = ["Stellar", "Soroban", "Freighter", "NEXUS", "LOBSTR", "Stellar Development Foundation"];
  return <section className={`${styles.section} ${styles.ecosystem}`}><span>Powered by the Stellar ecosystem</span><div>{names.map((name, index) => <span key={name} className={styles.ecosystemName}>{index === 0 && <Orbit size={26} />}{index === 1 && <span className={styles.squareLogo} />}{index === 2 && <span className={styles.freighterLogo}>F</span>}{name}</span>)}</div></section>;
}

function RoadmapSection() {
  return <section id="roadmap" className={styles.section}><SectionHeading eyebrow="Roadmap" title={<>What&apos;s <span>next?</span></>} text="A focused path from a powerful CLMM core to open ecosystem infrastructure." /><div className={styles.roadmap}>{roadmap.map((phase, index) => <article key={phase.phase} className={styles[`roadmap_${phase.color}`]}><div className={styles.roadPoint}><span /></div><span>{phase.phase}</span><h3>{phase.title}</h3><ul>{phase.items.map((item) => <li key={item}>{item}</li>)}</ul>{index === 0 && <em>Current</em>}</article>)}</div></section>;
}

function FaqSection() {
  const faqs = [["What is concentrated liquidity?", "It lets liquidity providers allocate capital inside custom price ranges, improving capital efficiency compared with full-range liquidity."], ["Is LuminaDex custodial?", "No. Wallet and transaction flows remain non-custodial and execute through the existing Stellar and Soroban integration."], ["Which assets can I use?", "The current application focuses on XLM and USDC, with the architecture designed to support additional Stellar assets."]];
  return <section id="faq" className={`${styles.section} ${styles.faqSection}`}><SectionHeading eyebrow="FAQ" title={<>A few things worth <span>knowing.</span></>} align="left" /><div className={styles.faqList}>{faqs.map(([question, answer]) => <details key={question}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}</div></section>;
}

function FinalCta() {
  return <section className={`${styles.section} ${styles.finalCta}`}><div className={styles.ctaAurora} /><span className={styles.eyebrow}>The liquidity layer for Stellar</span><h2>Trade smarter<br />on <span>Stellar.</span></h2><p>Experience capital-efficient liquidity with LuminaDex.</p><Link href="/swap" className={styles.lightButton}>Launch LuminaDex <ArrowRight size={17} /></Link></section>;
}

function Footer() {
  const groups = [["Product", [["Features", "#features"], ["Swap", "/swap"], ["Liquidity", "/liquidity"], ["Pools", "/liquidity"]]], ["Resources", [["Documentation", "#clmm"], ["Guides", "#clmm"], ["FAQ", "#faq"]]], ["Developers", [["GitHub", "#"], ["Smart contracts", "#security"], ["API", "#roadmap"]]], ["Community", [["X / Twitter", "#"], ["Discord", "#"], ["Telegram", "#"]]], ["Legal", [["Privacy", "#"], ["Terms", "#"]]]] as const;
  return <footer className={styles.footer}><div className={styles.footerGrid}><div className={styles.footerBrand}><Link href="/"><Brand /></Link><p>Next-generation concentrated liquidity DEX on Stellar Soroban.</p><div><a href="#" aria-label="Github"><Code2 size={17} /></a><a href="#" aria-label="Community"><Globe2 size={17} /></a></div></div>{groups.map(([title, links]) => <div className={styles.footerGroup} key={title}><h3>{title}</h3>{links.map(([label, href]) => href.startsWith("/") ? <Link key={label} href={href}>{label}</Link> : <a key={label} href={href}>{label}</a>)}</div>)}</div><div className={styles.footerBottom}><span>© 2026 LuminaDex. All rights reserved.</span><span><i /> Built on Stellar Soroban</span></div></footer>;
}

export function AuraLanding() {
  return <main data-landing className={styles.page}><LandingNav /><section className={styles.hero}><AuroraBackground /><div className={styles.heroContent}><span className={styles.stellarBadge}><Orbit size={15} /> Built on Stellar Soroban <Sparkles size={13} /></span><h1><span className={styles.heroPlain}>Concentrated<span className={styles.mobileBreak}><br /></span> Liquidity.</span><br /><span className={styles.heroGradient}>Limitless<span className={styles.mobileBreak}><br /></span> Possibilities.</span></h1><p>LuminaDex is a next-generation CLMM DEX on Stellar Soroban, offering capital-efficient trades, low fees, and maximum flexibility.</p><div className={styles.heroActions}><Link href="/swap" data-tour="swap" className={styles.primaryButton}>Launch App <ArrowRight size={17} /></Link><a href="#clmm" className={styles.secondaryButton}>Explore Docs <BookOpen size={16} /></a></div></div><TradingPreview /></section><div className={styles.ecosystemMini}><span>Trusted by the Stellar community</span><div><span><Orbit size={23} /> Stellar</span><span>Soroban</span><span>Freighter</span><span>NEXUS</span><span>LOBSTR</span></div></div><StatsSection /><WhySection /><ClmmSection /><PoolsSection /><HowItWorks /><BeginnerGuideSection /><LiquiditySection /><SecuritySection /><EcosystemSection /><RoadmapSection /><FaqSection /><FinalCta /><Footer /></main>;
}
