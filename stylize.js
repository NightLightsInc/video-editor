/* Stylize effects */
(function(){
const V=VFX;

/* Sobel edge map at reduced resolution; returns a canvas whose alpha is the edge strength */
function edges(fx,sc){
  const w=Math.round(fx.W*sc),h=Math.round(fx.H*sc),a=V.canvas('edgeA',w,h),b=V.canvas('edgeB',w,h);
  a.x.clearRect(0,0,w,h);a.x.drawImage(fx.c,0,0,w,h);
  const s=a.x.getImageData(0,0,w,h).data,o=b.x.createImageData(w,h),d=o.data,g=new Float32Array(w*h);
  for(let i=0;i<w*h;i++)g[i]=.299*s[i*4]+.587*s[i*4+1]+.114*s[i*4+2];
  for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){
    const i=y*w+x,
      gx=-g[i-w-1]-2*g[i-1]-g[i+w-1]+g[i-w+1]+2*g[i+1]+g[i+w+1],
      gy=-g[i-w-1]-2*g[i-w]-g[i-w+1]+g[i+w-1]+2*g[i+w]+g[i+w+1],
      m=Math.min(255,Math.sqrt(gx*gx+gy*gy)*1.2),k=i*4;
    d[k]=d[k+1]=d[k+2]=255;d[k+3]=m;
  }
  b.x.putImageData(o,0,0);
  return b.c;
}

V.register({id:'pixelate',name:'Pixelate',icon:'🟦',cat:'Stylize',amt:.5,
  apply(fx){fx.pixelate(4+fx.amt*40*fx.S);}});

V.register({id:'halftone',name:'Halftone Dots',icon:'⚫',cat:'Stylize',amt:.8,
  params:[{k:'size',l:'Dot size',min:6,max:30,step:1,def:12}],
  apply(fx){
    const{x,W,H}=fx,cell=Math.max(4,Math.round(fx.par.size*fx.S)),cw=Math.ceil(W/cell),ch=Math.ceil(H/cell),o=V.canvas('ht',cw,ch);
    o.x.clearRect(0,0,cw,ch);o.x.drawImage(fx.c,0,0,cw,ch);
    const d=o.x.getImageData(0,0,cw,ch).data,t2=fx.tx2;
    fx.reset(t2);t2.fillStyle='#0c0c12';t2.fillRect(0,0,W,H);
    for(let j=0;j<ch;j++)for(let i=0;i<cw;i++){
      const k=(j*cw+i)*4,l=(.299*d[k]+.587*d[k+1]+.114*d[k+2])/255,r=cell*.62*Math.sqrt(l+.04);
      t2.fillStyle='rgb('+Math.min(255,d[k]*1.15)+','+Math.min(255,d[k+1]*1.15)+','+Math.min(255,d[k+2]*1.15)+')';
      t2.beginPath();t2.arc((i+.5)*cell,(j+.5)*cell,r,0,6.2832);t2.fill();
    }
    fx.reset();x.globalAlpha=Math.min(1,fx.amt*1.4);x.drawImage(fx.tmp2,0,0);x.globalAlpha=1;
  }});

V.register({id:'sketch',name:'Pencil Sketch',icon:'✏️',cat:'Stylize',amt:.5,
  apply(fx){
    if(!fx.hasFilter)return;
    const{x,W,H}=fx,src=fx.snap(),t2=fx.tx2;
    fx.reset();x.clearRect(0,0,W,H);x.filter='grayscale(1)';x.drawImage(src,0,0);x.filter='none';
    fx.reset(t2);t2.clearRect(0,0,W,H);t2.filter='grayscale(1) invert(1) blur('+(3+fx.amt*10)*fx.S+'px)';t2.drawImage(src,0,0);t2.filter='none';
    x.globalCompositeOperation='color-dodge';x.drawImage(fx.tmp2,0,0);x.globalCompositeOperation='source-over';
  }});

V.register({id:'neonedges',name:'Neon Edges',icon:'🟣',cat:'Stylize',amt:.7,
  apply(fx){
    const{x,W,H}=fx,e=edges(fx,.5),t2=fx.tx2;
    fx.reset();x.fillStyle='rgba(0,0,0,'+.7*fx.amt+')';x.globalCompositeOperation='source-atop';x.fillRect(0,0,W,H);x.globalCompositeOperation='source-over';
    fx.reset(t2);t2.clearRect(0,0,W,H);t2.drawImage(e,0,0,W,H);
    t2.globalCompositeOperation='source-in';t2.fillStyle='hsl('+V.mod(fx.time*60+180,360)+',100%,60%)';t2.fillRect(0,0,W,H);t2.globalCompositeOperation='source-over';
    x.save();x.globalCompositeOperation='lighter';
    if(fx.hasFilter){x.filter='blur('+6*fx.S+'px)';x.drawImage(fx.tmp2,0,0);x.filter='none';}
    x.drawImage(fx.tmp2,0,0);x.restore();
  }});

V.register({id:'cartoon',name:'Cartoon',icon:'🎨',cat:'Stylize',amt:.7,
  apply(fx){
    const{x,W,H}=fx,e=edges(fx,.5),t2=fx.tx2,L=V.posterLut(Math.round(8-fx.amt*4));
    fx.applyFilter('saturate('+(1+fx.amt*.6)+')');
    fx.pixels(d=>{for(let i=0;i<d.length;i+=4){d[i]=L[d[i]];d[i+1]=L[d[i+1]];d[i+2]=L[d[i+2]];}});
    fx.reset(t2);t2.clearRect(0,0,W,H);t2.drawImage(e,0,0,W,H);
    t2.globalCompositeOperation='source-in';t2.fillStyle='#000';t2.fillRect(0,0,W,H);t2.globalCompositeOperation='source-over';
    fx.reset();x.globalAlpha=.9;x.drawImage(fx.tmp2,0,0);x.globalAlpha=1;
  }});

V.register({id:'ascii',name:'ASCII Art',icon:'🔤',cat:'Stylize',amt:.8,
  params:[{k:'size',l:'Cell size',min:8,max:24,step:1,def:12},{k:'color',l:'Colors',t:'select',o:[['green','Terminal green'],['color','Original colors']],def:'green'}],
  apply(fx){
    const{x,W,H}=fx,cell=Math.max(6,Math.round(fx.par.size*fx.S)),cw=Math.ceil(W/cell),ch=Math.ceil(H/cell),o=V.canvas('as',cw,ch),chars=' .:-=+*#%@';
    o.x.clearRect(0,0,cw,ch);o.x.drawImage(fx.c,0,0,cw,ch);
    const d=o.x.getImageData(0,0,cw,ch).data,t2=fx.tx2,col=fx.par.color==='color';
    fx.reset(t2);t2.fillStyle='#050805';t2.fillRect(0,0,W,H);
    t2.font='bold '+cell*1.05+'px monospace';t2.textBaseline='middle';t2.textAlign='center';
    for(let j=0;j<ch;j++)for(let i=0;i<cw;i++){
      const k=(j*cw+i)*4,l=(.299*d[k]+.587*d[k+1]+.114*d[k+2])/255,c=chars[Math.min(chars.length-1,Math.floor(l*chars.length))];
      if(c===' ')continue;
      t2.fillStyle=col?'rgb('+d[k]+','+d[k+1]+','+d[k+2]+')':'rgb(60,'+Math.round(120+l*135)+',90)';
      t2.fillText(c,(i+.5)*cell,(j+.5)*cell);
    }
    fx.reset();x.globalAlpha=Math.min(1,fx.amt*1.4);x.drawImage(fx.tmp2,0,0);x.globalAlpha=1;
  }});

V.register({id:'cinebars',name:'Cinema Bars',icon:'🎞️',cat:'Stylize',amt:.6,
  apply(fx){
    const{x,W,H}=fx,k=Math.min(1,fx.lt/.6),h=fx.amt*.16*H*k;
    x.save();x.fillStyle='#000';x.fillRect(0,0,W,h);x.fillRect(0,H-h,W,h);x.restore();
  }});
})();
