/* Color effects & grades */
(function(){
const V=VFX;
const lum=(d,i)=>.299*d[i]+.587*d[i+1]+.114*d[i+2];

V.register({id:'huecycle',name:'Color Cycle',icon:'🎨',cat:'Color',amt:.7,
  apply(fx){fx.applyFilter('hue-rotate('+V.mod(fx.time*120,360)+'deg) saturate('+(1+fx.amt)+')');}});

V.register({id:'duotone',name:'Duotone',icon:'🌗',cat:'Color',amt:.9,
  params:[{k:'a',l:'Shadows',t:'color',def:'#2b1055'},{k:'b',l:'Highlights',t:'color',def:'#ff9a5a'}],
  apply(fx){
    const A=V.hex(fx.par.a),B=V.hex(fx.par.b),m=fx.amt;
    fx.pixels(d=>{for(let i=0;i<d.length;i+=4){
      const k=lum(d,i)/255;
      d[i]+=(A[0]+(B[0]-A[0])*k-d[i])*m;d[i+1]+=(A[1]+(B[1]-A[1])*k-d[i+1])*m;d[i+2]+=(A[2]+(B[2]-A[2])*k-d[i+2])*m;}});
  }});

V.register({id:'thermal',name:'Thermal Camera',icon:'🔥',cat:'Color',amt:.9,
  apply(fx){
    const G=V.gradLut([[0,[10,0,60]],[.3,[40,0,200]],[.5,[220,30,40]],[.75,[255,200,0]],[1,[255,255,230]]]),m=fx.amt;
    fx.pixels(d=>{for(let i=0;i<d.length;i+=4){
      const l=lum(d,i)|0;
      d[i]+=(G.r[l]-d[i])*m;d[i+1]+=(G.g[l]-d[i+1])*m;d[i+2]+=(G.b[l]-d[i+2])*m;}});
  }});

V.register({id:'negative',name:'Negative',icon:'🔄',cat:'Color',amt:1,
  apply(fx){fx.applyFilter('invert('+fx.amt+')');}});

V.register({id:'vibrant',name:'Vibrant Pop',icon:'💥',cat:'Color',amt:.6,
  apply(fx){fx.applyFilter('saturate('+(1+fx.amt*1.5)+') contrast('+(1+fx.amt*.25)+')');}});

V.register({id:'cinematic',name:'Teal & Orange',icon:'🎬',cat:'Color',amt:.7,
  apply(fx){
    fx.grade('overlay',x=>{
      const g=x.createLinearGradient(0,0,fx.W,0);g.addColorStop(0,'rgba(0,160,176,'+.75*fx.amt+')');g.addColorStop(1,'rgba(255,140,66,'+.75*fx.amt+')');
      x.fillStyle=g;x.fillRect(0,0,fx.W,fx.H);});
  }});

V.register({id:'sunset',name:'Sunset Glow',icon:'🌇',cat:'Color',amt:.7,
  apply(fx){
    fx.grade('soft-light',x=>{
      const g=x.createRadialGradient(fx.W/2,fx.H,0,fx.W/2,fx.H,fx.H*1.1);
      g.addColorStop(0,'rgba(255,120,40,'+.95*fx.amt+')');g.addColorStop(1,'rgba(255,60,120,'+.3*fx.amt+')');
      x.fillStyle=g;x.fillRect(0,0,fx.W,fx.H);});
  }});

V.register({id:'moonlight',name:'Moonlight',icon:'🌙',cat:'Color',amt:.7,
  apply(fx){
    fx.grade('soft-light',x=>{x.fillStyle='rgba(60,100,255,'+.9*fx.amt+')';x.fillRect(0,0,fx.W,fx.H);});
    fx.vig(.35*fx.amt);
  }});

V.register({id:'posterize',name:'Posterize',icon:'🖼️',cat:'Color',amt:.5,
  apply(fx){
    const L=V.posterLut(Math.round(10-fx.amt*8));
    fx.pixels(d=>{for(let i=0;i<d.length;i+=4){d[i]=L[d[i]];d[i+1]=L[d[i+1]];d[i+2]=L[d[i+2]];}});
  }});

V.register({id:'solarize',name:'Solarize',icon:'☀️',cat:'Color',amt:.6,
  apply(fx){
    const th=255-fx.amt*140;
    fx.pixels(d=>{for(let i=0;i<d.length;i+=4){
      if(d[i]>th)d[i]=255-d[i];if(d[i+1]>th)d[i+1]=255-d[i+1];if(d[i+2]>th)d[i+2]=255-d[i+2];}});
  }});

V.register({id:'flash',name:'Flash Pulse',icon:'📸',cat:'Color',amt:.8,
  params:[{k:'rate',l:'Flashes / sec',min:.5,max:8,step:.5,def:2}],
  apply(fx){
    const ph=V.mod(fx.time*fx.par.rate,1);
    fx.fill('rgba(255,255,255,'+Math.pow(1-ph,3)*fx.amt+')');
  }});

V.register({id:'strobe',name:'Strobe',icon:'🚨',cat:'Color',amt:.7,
  params:[{k:'rate',l:'Rate (Hz)',min:2,max:20,step:1,def:8}],
  apply(fx){
    if(fx.step(fx.par.rate)%2===0)fx.fill('rgba(255,255,255,'+.8*fx.amt+')');
    else fx.fill('rgba(0,0,0,'+.4*fx.amt+')');
  }});

V.register({id:'rainbow',name:'Rainbow Tint',icon:'🏳️‍🌈',cat:'Color',amt:.6,
  apply(fx){
    fx.grade('overlay',x=>{
      const W=fx.W,o=V.mod(fx.time*.15,1)*W,g=x.createLinearGradient(-o,0,W*2-o,0);
      for(let i=0;i<=6;i++)g.addColorStop(i/6,'hsla('+(i*60)+',95%,55%,'+.85*fx.amt+')');
      x.fillStyle=g;x.fillRect(0,0,W,fx.H);});
  }});
})();
