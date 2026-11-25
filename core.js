/* NightLights Inc. Video Editor — effects core: registry + helpers.
   Every effect lives in its own file in this folder and calls VFX.register({...}).
   See README.md for how to add your own. */
(function(){
'use strict';
const V=window.VFX={
  list:[],map:{},
  cats:['Glitch','Retro','Color','Distort','Blur','Light','Particles','Stylize','Motion'],
  register(def){
    def.params=def.params||[];
    if(!V.map[def.id])V.list.push(def);
    V.map[def.id]=def;
    if(!V.cats.includes(def.cat))V.cats.push(def.cat);
  },
  defaults(def){const p={};(def.params||[]).forEach(q=>{p[q.k]=q.def;});return p;},
  rand(n){const s=Math.sin(n*127.1+311.7)*43758.5453123;return s-Math.floor(s);},
  mod(a,b){return((a%b)+b)%b;},
  hex(c){const n=parseInt(String(c).replace('#',''),16)||0;return[(n>>16)&255,(n>>8)&255,n&255];},
  _cv:{},
  canvas(key,w,h){
    let o=V._cv[key];
    if(!o){const c=document.createElement('canvas');o=V._cv[key]={c,x:c.getContext('2d',{willReadFrequently:true})};}
    if(o.c.width!==w)o.c.width=w;
    if(o.c.height!==h)o.c.height=h;
    return o;
  },
  noiseCv(){
    if(!V._n){
      const c=document.createElement('canvas');c.width=c.height=256;
      const x=c.getContext('2d'),d=x.createImageData(256,256);
      for(let i=0;i<d.data.length;i+=4){d.data[i]=d.data[i+1]=d.data[i+2]=Math.random()*255;d.data[i+3]=255;}
      x.putImageData(d,0,0);V._n=c;
    }
    return V._n;
  },
  posterLut(levels){
    const l=new Uint8ClampedArray(256),n=Math.max(2,levels|0);
    for(let i=0;i<256;i++)l[i]=Math.round(Math.round(i/255*(n-1))/(n-1)*255);
    return l;
  },
  gradLut(stops){
    const r=new Uint8ClampedArray(256),g=new Uint8ClampedArray(256),b=new Uint8ClampedArray(256);
    for(let i=0;i<256;i++){
      const v=i/255;let k=0;
      while(k<stops.length-2&&v>stops[k+1][0])k++;
      const a=stops[k],c=stops[k+1],f=Math.min(1,Math.max(0,(v-a[0])/((c[0]-a[0])||1)));
      r[i]=a[1][0]+(c[1][0]-a[1][0])*f;g[i]=a[1][1]+(c[1][1]-a[1][1])*f;b[i]=a[1][2]+(c[1][2]-a[1][2])*f;
    }
    return{r,g,b};
  },

  /* Builds the object every effect's apply(fx) receives.
     Inputs from the editor: c,x (target canvas/ctx), tmp,tx,tmp2,tx2 (scratch), W,H,S,t,lt,dur,p,amt,spd,time,par,hasFilter,fps */
  context(fx){
    const x=fx.x,W=fx.W,H=fx.H;
    fx.aspect=W/H;
    fx.rnd=i=>V.rand(i);
    fx.step=hz=>Math.floor(fx.time*hz);
    fx.reset=c=>{c=c||x;c.setTransform(1,0,0,1,0,0);c.globalAlpha=1;c.globalCompositeOperation='source-over';c.filter='none';c.shadowColor='transparent';c.shadowBlur=0;c.shadowOffsetY=0;};
    /* copy of the current pixels, kept in tmp */
    fx.snap=()=>{fx.reset(fx.tx);fx.tx.clearRect(0,0,W,H);fx.tx.drawImage(fx.c,0,0);return fx.tmp;};
    fx.replace=src=>{fx.reset();x.clearRect(0,0,W,H);x.drawImage(src,0,0,W,H);};
    /* fills the frame but only where the target already has pixels */
    fx.fill=(style,comp)=>{x.save();x.globalCompositeOperation=comp||'source-atop';x.fillStyle=style;x.fillRect(0,0,W,H);x.restore();};
    /* blend-mode grade that stays inside the target's shape: fn(x) paints with the given blend mode */
    fx.grade=(comp,fn)=>{
      const src=fx.snap();
      x.save();x.globalCompositeOperation=comp;fn(x);x.restore();
      x.save();x.globalCompositeOperation='destination-in';x.drawImage(src,0,0);x.restore();
    };
    fx.vig=(a,size)=>{
      if(a<=0)return;
      x.save();x.globalCompositeOperation='source-atop';
      const g=x.createRadialGradient(W/2,H/2,H*(size||.35),W/2,H/2,Math.hypot(W,H)*.55);
      g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,'+Math.min(1,a)+')');
      x.fillStyle=g;x.fillRect(0,0,W,H);x.restore();
    };
    fx.noise=a=>{
      if(a<=0)return;
      const n=V.noiseCv(),ox=(V.rand(fx.step(24))*256)|0,oy=(V.rand(fx.step(24)+9)*256)|0;
      x.save();x.globalCompositeOperation='source-atop';x.globalAlpha=Math.min(1,a);
      x.fillStyle=x.createPattern(n,'repeat');x.translate(-ox,-oy);x.fillRect(ox,oy,W,H);x.restore();
    };
    /* run fn(data,w,h) over the RGBA pixels of the target */
    fx.pixels=fn=>{
      const o=V.canvas('px',W,H);
      o.x.clearRect(0,0,W,H);o.x.drawImage(fx.c,0,0);
      const d=o.x.getImageData(0,0,W,H);fn(d.data,W,H);o.x.putImageData(d,0,0);
      fx.replace(o.c);
    };
    /* blurred copy of the target, returned in tmp2 */
    fx.blurCopy=px=>{
      const t2=fx.tx2;fx.reset(t2);t2.clearRect(0,0,W,H);
      if(fx.hasFilter){t2.filter='blur('+px+'px)';t2.drawImage(fx.c,0,0);t2.filter='none';}
      else{
        const s=Math.max(1,px*.6),w=Math.max(2,Math.ceil(W/s)),h=Math.max(2,Math.ceil(H/s)),o=V.canvas('blur',w,h);
        o.x.clearRect(0,0,w,h);o.x.drawImage(fx.c,0,0,w,h);t2.drawImage(o.c,0,0,W,H);
      }
      return fx.tmp2;
    };
    /* redraws the target through a CSS filter string; returns false if the browser has no ctx.filter */
    fx.applyFilter=str=>{
      if(!fx.hasFilter)return false;
      const src=fx.snap();fx.reset();x.clearRect(0,0,W,H);x.filter=str;x.drawImage(src,0,0);x.filter='none';return true;
    };
    fx.pixelate=px=>{
      px=Math.max(1,px);
      const w=Math.max(1,Math.ceil(W/px)),h=Math.max(1,Math.ceil(H/px)),o=V.canvas('pix',w,h);
      o.x.clearRect(0,0,w,h);o.x.drawImage(fx.c,0,0,w,h);
      fx.reset();x.clearRect(0,0,W,H);x.imageSmoothingEnabled=false;
      x.drawImage(o.c,0,0,w,h,0,0,w*px,h*px);x.imageSmoothingEnabled=true;
    };
    /* shifts the red channel by (dx,dy) and the blue channel by (-dx,-dy) */
    fx.channelShift=(dx,dy)=>{
      const src=fx.snap(),t2=fx.tx2;
      fx.reset();x.clearRect(0,0,W,H);
      const ch=[['#f00',dx,dy],['#0f0',0,0],['#00f',-dx,-dy]];
      for(const c of ch){
        fx.reset(t2);t2.clearRect(0,0,W,H);t2.drawImage(src,c[1],c[2]);
        t2.globalCompositeOperation='multiply';t2.fillStyle=c[0];t2.fillRect(0,0,W,H);
        t2.globalCompositeOperation='destination-in';t2.drawImage(src,c[1],c[2]);
        t2.globalCompositeOperation='source-over';
        x.globalCompositeOperation='lighter';x.drawImage(fx.tmp2,0,0);
      }
      x.globalCompositeOperation='source-over';
    };
    /* per-pixel remap at reduced resolution: map(u,v,out) writes the source coordinate (0..1) into out */
    fx.warp=(map,sc)=>{
      sc=sc||.5;
      const w=Math.max(8,Math.round(W*sc)),h=Math.max(8,Math.round(H*sc)),a=V.canvas('wa',w,h),b=V.canvas('wb',w,h);
      a.x.clearRect(0,0,w,h);a.x.drawImage(fx.c,0,0,w,h);
      const s=a.x.getImageData(0,0,w,h).data,out=b.x.createImageData(w,h),d=out.data,o=[0,0];
      for(let y=0;y<h;y++){
        const v=(y+.5)/h;
        for(let xx=0;xx<w;xx++){
          map((xx+.5)/w,v,o);
          if(!(o[0]>=0&&o[1]>=0&&o[0]<1&&o[1]<1))continue;
          const i=(y*w+xx)*4,j=(((o[1]*h)|0)*w+((o[0]*w)|0))*4;
          d[i]=s[j];d[i+1]=s[j+1];d[i+2]=s[j+2];d[i+3]=s[j+3];
        }
      }
      b.x.putImageData(out,0,0);
      fx.reset();x.clearRect(0,0,W,H);x.imageSmoothingEnabled=true;x.drawImage(b.c,0,0,W,H);
    };
    /* redraws the target with a transform around the centre: fn(ctx) is called after translate(centre) */
    fx.xform=fn=>{
      const src=fx.snap();
      fx.reset();x.clearRect(0,0,W,H);x.save();x.translate(W/2,H/2);fn(x);x.drawImage(src,-W/2,-H/2);x.restore();
    };
    return fx;
  }
};
})();
