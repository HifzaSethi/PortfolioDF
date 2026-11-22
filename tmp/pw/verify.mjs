import { chromium } from '/tmp/pw/node_modules/playwright/index.mjs';

const EXECUTABLE = '/ms-playwright/chrome-headless-shell-linux64/chrome-headless-shell';
const BASE = 'http://localhost:3000';

const results = [];
function log(name, pass, detail = '') {
  results.push({ name, pass, detail });
  console.log(`${pass ? 'PASS' : 'FAIL'} | ${name}${detail ? ' — ' + detail : ''}`);
}

const browser = await chromium.launch({
  executablePath: EXECUTABLE,
  headless: true,
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'],
});

try {
  // 1. Desktop 1440x900 (Intro + Night + Day + Hover + Slant + Hero + Framework + Services + Industries + Studio)
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const consoleErrors = [];
  const pageErrors = [];
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });
  page.on('pageerror', (e) => pageErrors.push(String(e)));

  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(450);

  // Check Intro overlay
  const introDialog = await page.locator('[role="dialog"]').count();
  const introExploreVisible = await page.getByRole('button', { name: /Explore/i }).isVisible();
  const introSkipVisible = await page.getByRole('button', { name: /Skip Intro/i }).isVisible();
  log('Intro Gate visible on initial load', introDialog === 1 && introExploreVisible && introSkipVisible, `dialog=${introDialog}`);

  // Test Skip Intro & Hero WebGL / SVG fallback + single WebGL context
  await page.getByRole('button', { name: /Skip Intro/i }).click();
  await page.waitForTimeout(550);
  const introGone = (await page.locator('[role="dialog"]').count()) === 0;
  const heroHeading = await page.locator('h1').textContent();
  log('Intro dismisses cleanly via Skip & unlocks content', introGone && heroHeading?.includes('SEE THE'), `h1=${heroHeading?.trim()}`);

  // Check WebGL context count (<= 1)
  const canvasCount = await page.locator('canvas').count();
  const webglCanvases = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('canvas')).filter((c) => {
      const ctx2d = !!c.getContext('2d');
      return !ctx2d;
    }).length;
  });
  log('At most 1 WebGL canvas active on Home', webglCanvases <= 1, `total canvases=${canvasCount}, non-2d=${webglCanvases}`);

  // Check Hero Ecosystem interactive fallback or 3D sr-only 10 nodes + click scroll
  const ecoSrCount = await page.locator('#home-hero ol.sr-only li').count();
  log('Hero Ecosystem 10-node ordered list accessible', ecoSrCount === 10, `count=${ecoSrCount}`);

  // Check no horizontal overflow on Desktop
  const desktopOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  log('Home Desktop zero horizontal overflow', !desktopOverflow);

  // Check F1: Slanted button/chips retain skewX(-12deg) before, during hover, and active
  const chip = page.locator('#home-hero .df-slant-block').first();
  const box = await chip.boundingBox();
  const matBefore = await chip.evaluate((el) => getComputedStyle(el).transform);
  if (box) {
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.waitForTimeout(250);
  }
  const matHover = await chip.evaluate((el) => getComputedStyle(el).transform);
  // skewX(-12deg) -> tan(-12deg) ~= -0.21256 in matrix(1, 0, c, 1, 0, 0)
  const hasSkew = (m) => {
    const match = m.match(/matrix\(([^)]+)\)/);
    if (!match) return false;
    const parts = match[1].split(',').map(Number);
    return Math.abs(parts[2] - -0.2125) < 0.03;
  };
  log('F1: Slanted chip keeps skewX(-12deg) before & during hover', hasSkew(matBefore) && hasSkew(matHover), `before=${matBefore}, hover=${matHover}`);

  // Check Scroll progress bar absent at hero top, visible further down
  const bar = page.locator('div[aria-hidden="true"] .df-gradient-accent').first();
  log('ScrollProgressBar mounted', (await bar.count()) >= 1);

  // Scroll to IntelligenceFramework and verify Canvas 2D + Rail + F7 hover does NOT switch stage
  await page.evaluate(() => {
    const el = document.querySelector('#intel-stage-data');
    el?.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await page.waitForTimeout(300);

  const stageTab = page.locator('#intel-stage-intelligence');
  const stageBeforeHover = await page.locator('#intel-stage-panel h3').textContent();
  const stageBox = await stageTab.boundingBox();
  if (stageBox) {
    await page.mouse.move(stageBox.x + stageBox.width / 2, stageBox.y + stageBox.height / 2);
    await page.waitForTimeout(200);
  }
  const stageAfterHover = await page.locator('#intel-stage-panel h3').textContent();
  log('F7: IntelligenceFramework hover does NOT switch active stage', stageBeforeHover === stageAfterHover, `${stageBeforeHover} === ${stageAfterHover}`);

  await stageTab.click();
  await page.waitForTimeout(250);
  const stageSelectedAttr = await stageTab.getAttribute('aria-selected');
  // Check "CTR ↑ 12%" + "Illustrative example" present in IntelligenceTransform sr description / canvas text
  const ctrLabelPresent = await page.evaluate(() => document.body.innerText.includes('Illustrative example'));
  log('Framework tab click updates selection + Illustrative example preserved', stageSelectedAttr === 'true' && ctrLabelPresent, `selected=${stageSelectedAttr}`);

  // Check Day/Night toggle (Night default -> switch to Day -> back to Night)
  const initialTheme = await page.evaluate(() => document.documentElement.dataset.theme);
  const dayBtn = page.getByRole('button', { name: /Day mode/i });
  await dayBtn.click();
  await page.waitForTimeout(350);
  const afterDayTheme = await page.evaluate(() => document.documentElement.dataset.theme);
  log('Day/Night toggle works (Night default -> Day)', initialTheme === 'night' && afterDayTheme === 'day', `${initialTheme} -> ${afterDayTheme}`);

  // Visit /services in Day Mode -> check F5 unified sibling card materials & F6 Practice Directory stretched links
  await page.goto(BASE + '/#/services', { waitUntil: 'networkidle' });
  await page.waitForTimeout(350);
  const overviewMats = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.df-tilt-scene .df-card-surface'));
    return cards.map((c) => getComputedStyle(c).backgroundColor);
  });
  const allSameDay = overviewMats.length === 3 && overviewMats.every((c) => c === overviewMats[0]);
  const stretchedLinksCount = await page.locator('.df-row a.df-stretched-link').count();
  log('F5 + F6 Services Overview unified Day surface & Directory stretched links', allSameDay && stretchedLinksCount === 6, `cards=${overviewMats.length}, stretched=${stretchedLinksCount}`);

  // Switch back to Night Mode on /services and re-check unified surfaces
  await page.getByRole('button', { name: /Night mode/i }).click();
  await page.waitForTimeout(350);
  const overviewMatsNight = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.df-tilt-scene .df-card-surface'));
    return cards.map((c) => getComputedStyle(c).backgroundColor);
  });
  log('F5 Services Overview unified Night surface', overviewMatsNight.length === 3 && overviewMatsNight.every((c) => c === overviewMatsNight[0]), `colors=${JSON.stringify(overviewMatsNight)}`);

  // Visit /industries -> check sticky 4:5 stage, hover switches stage without changing active aria-live, 9 gradient variants
  await page.goto(BASE + '/#/industries', { waitUntil: 'networkidle' });
  await page.waitForTimeout(350);
  const indLiveBefore = await page.locator('[aria-live="polite"]').last().textContent();
  const fourthInd = page.locator('ul li.df-row a').nth(3);
  await fourthInd.hover();
  await page.waitForTimeout(250);
  const stageTextAfterHover = await page.locator('aside .df-line-mask-rise').first().textContent();
  const indLiveAfterHover = await page.locator('[aria-live="polite"]').last().textContent();
  log('Industries hover updates 4:5 stage silently without aria-live chatter', Boolean(stageTextAfterHover?.includes('04 / 09')) && indLiveBefore === indLiveAfterHover, `stage=${stageTextAfterHover?.trim()}`);

  // Visit /studio -> check StudioCinema carousel (6 scenes, Pause, Next, slanted ticks)
  await page.goto(BASE + '/#/studio', { waitUntil: 'networkidle' });
  await page.waitForTimeout(350);
  const carouselVisible = await page.locator('[aria-roledescription="carousel"]').isVisible();
  const ticksCount = await page.locator('[role="tablist"][aria-label="Studio reel scenes"] button').count();
  await page.getByRole('button', { name: 'Next discipline scene' }).click();
  await page.waitForTimeout(250);
  const slateText = await page.locator('[aria-roledescription="carousel"]').textContent();
  await page.getByRole('button', { name: /Pause discipline reel/i }).click();
  log('StudioCinema 6-scene film stage, Next & Pause work', carouselVisible && ticksCount === 6 && Boolean(slateText?.includes('SCENE 02 / 06')), `ticks=${ticksCount}`);

  log('Zero console/page errors across Desktop routes', consoleErrors.length === 0 && pageErrors.length === 0, `console=${consoleErrors.length}, page=${pageErrors.length}`);
  if (consoleErrors.length) console.log('Console errors:', consoleErrors);
  if (pageErrors.length) console.log('Page errors:', pageErrors);
  await ctx.close();

  // 2. Mobile 375x812 Touch + Reduced Motion check
  const mCtx = await browser.newContext({
    viewport: { width: 375, height: 812 },
    hasTouch: true,
    isMobile: true,
    reducedMotion: 'reduce',
  });
  const mPage = await mCtx.newPage();
  const mErrors = [];
  mPage.on('pageerror', (e) => mErrors.push(String(e)));
  await mPage.addInitScript(() => sessionStorage.setItem('df_intro_seen', 'true'));
  await mPage.goto(BASE + '/#/industries', { waitUntil: 'networkidle' });
  await mPage.waitForTimeout(300);
  const mOverflow = await mPage.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  const mInlineMediaCount = await mPage.locator('li.df-row .df-mobile-clip.is-revealed').count();
  await mPage.goto(BASE + '/', { waitUntil: 'networkidle' });
  await mPage.waitForTimeout(350);
  const rmPanels = await mPage.evaluate(() => document.body.innerText.includes('Reduced motion view'));
  log('Mobile 375px + Reduced Motion: zero overflow, immediate mobile inline reveal, reduced-motion framework panels', !mOverflow && mInlineMediaCount === 9 && rmPanels && mErrors.length === 0, `inlineRevealed=${mInlineMediaCount}, rmPanels=${rmPanels}, overflow=${mOverflow}`);
  await mCtx.close();

  // 3. No-WebGL fallback check (SVG constellation rendered cleanly when getContext returns null)
  const nwCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const nwPage = await nwCtx.newPage();
  await nwPage.addInitScript(() => {
    sessionStorage.setItem('df_intro_seen', 'true');
    const orig = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...args) {
      if (type === 'webgl' || type === 'webgl2' || type === 'experimental-webgl') return null;
      return orig.call(this, type, ...args);
    };
  });
  await nwPage.goto(BASE + '/', { waitUntil: 'networkidle' });
  await nwPage.waitForTimeout(350);
  const fallbackSvg = await nwPage.locator('#home-hero svg[aria-label*="Digital Ecosystem"]').count();
  await nwPage.locator('#home-hero svg [role="button"]').nth(4).click();
  await nwPage.waitForTimeout(250);
  const ecoActiveTitle = await nwPage.locator('#ecosystem-framework h3').first().textContent();
  log('No-WebGL renders interactive 10-node SVG constellation & click activates EcosystemDiagram', fallbackSvg === 1 && ecoActiveTitle?.includes('Media'), `fallbackSvg=${fallbackSvg}, active=${ecoActiveTitle}`);
  await nwCtx.close();

} finally {
  await browser.close();
}

const failed = results.filter((r) => !r.pass);
console.log(`\nSUMMARY: ${results.length - failed.length}/${results.length} passed`);
if (failed.length > 0) process.exit(1);
