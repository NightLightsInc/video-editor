# Effects folder

Every `.js` file here adds effects to the NightLights Inc. Video Editor. The editor loads them with
`<script src="effects/...">` tags near the bottom of `video-editor.html`.

| File | Category |
|---|---|
| `core.js` | Registry and helpers (**load this first**) |
| `glitch.js` | Digital Glitch, RGB Split, VHS Tape, Block Glitch, TV Static |
| `retro.js` | CRT TV, Old Film, Film Noir, 8-Bit Retro, Faded Vintage |
| `color.js` | Color Cycle, Duotone, Thermal, Negative, Vibrant Pop, Teal & Orange, Sunset, Moonlight, Posterize, Solarize, Flash Pulse, Strobe, Rainbow Tint |
| `distort.js` | Wave, Vertical Wave, Fisheye, Pinch, Swirl, Water Ripple, Tile Grid, Mirror, Kaleidoscope, Echo Trail |
| `blur.js` | Gaussian, Zoom, Motion, Tilt-Shift |
| `light.js` | Glow/Bloom, Light Leak, Lens Flare, Vignette, Spotlight, Light Rays, Film Burn, Light Flicker |
| `particles.js` | Snow, Rain, Confetti, Hearts, Sparkles, Bokeh, Bubbles, Dust, Digital Rain |
| `stylize.js` | Pixelate, Halftone, Pencil Sketch, Neon Edges, Cartoon, ASCII, Cinema Bars |
| `motion.js` | Camera Shake, Beat Pulse, Spin, Jelly Wobble, Punch In, Pull Out, Swing, Flip Flop |

## Adding your own effect

1. Create `effects/myeffect.js`:

```js
VFX.register({
  id: 'myeffect',          // unique id
  name: 'My Effect',       // shown in the Effects tab
  icon: '🪄',
  cat: 'Color',            // any category; new names get their own tab chip
  amt: .6,                 // default intensity (0..1)
  params: [                // optional extra sliders / pickers
    { k: 'size', l: 'Size', min: 1, max: 10, step: 1, def: 4 },
    { k: 'tint', l: 'Tint', t: 'color', def: '#ff00aa' },
    { k: 'mode', l: 'Mode', t: 'select', o: [['a','Mode A'],['b','Mode B']], def: 'a' }
  ],
  apply(fx) {
    // fx.x is the 2D context holding the pixels to modify. Draw on it.
    fx.fill('rgba(255,0,0,' + 0.3 * fx.amt + ')');
  }
});
```

2. Add `<script src="effects/myeffect.js"></script>` after the other effect scripts in `video-editor.html`.

## What `apply(fx)` receives

| Field | Meaning |
|---|---|
| `fx.x`, `fx.c` | Context and canvas of the pixels being edited (modify in place) |
| `fx.W`, `fx.H`, `fx.S` | Frame size, and a scale factor (1 at 1080p) so sizes look the same at every resolution |
| `fx.amt`, `fx.spd`, `fx.par` | Intensity (0..1), speed multiplier, your `params` values |
| `fx.time` | Seconds since the effect started, multiplied by speed. Animate with this |
| `fx.lt`, `fx.dur`, `fx.p` | Raw local time, duration, and progress (0..1) |
| `fx.rnd(n)` | Deterministic random 0..1 for a seed. Never use `Math.random()` so scrubbing and export match |
| `fx.step(hz)` | Integer that ticks `hz` times per second (good for stepped glitches) |
| `fx.hasFilter` | `false` in browsers without `ctx.filter` (Safari) |

Helpers: `snap()` (copy of current pixels, returned as a canvas), `fill(style, comp)`, `grade(blend, fn)`,
`vig(a)`, `noise(a)`, `pixels(fn)`, `blurCopy(px)`, `applyFilter(css)`, `pixelate(px)`, `channelShift(dx,dy)`,
`warp(map)`, `xform(fn)`. Read `core.js` for details. Effects must be stateless: compute everything from `fx.time`.
