/* Light effects */
(function(){
const V=VFX;

V.register({id:'bloom',name:'Glow / Bloom',icon:'✨',cat:'Light',amt:.6,
  apply(fx){
    const{x}=fx,b=fx.blurCopy(14*fx.S+fx.amt*20*fx.S);
    fx.reset();x.save();x.globalCompositeOperation='screen';x.globalAlpha=Math.min(1,fx.amt*1.2);
    if(fx.hasFilter)x.filter='brightness(1.5)';
    x.drawImage(b,0,0);x.restore();
  }});

V.register({id:'leak',name:'Light Leak',icon:'🌅',cat:'Light',amt:.7,
  apply(fx){
    const{x,W,H}=fx,tt=fx.time*.4,cols=['255,120,40','255,60,120','255,200,60'];
    x.save();x.globalCompositeOperation='screen';
    for(let i=0;i<3;i++){
      const cx=W*(.5+.55*Math.sin(tt+i*2.1)),cy=H*(.5+.5*Math.cos(tt*.8+i*1.7)),r=H*(.7+.2*Math.sin(tt*1.3+i));
      const g=x.createRadialGradient(cx,cy,0,cx,cy,r);
      g.addColorStop(0,'rgba('+cols[i]+','+.8*fx.amt+')');g.addColorStop(1,'rgba('+cols[i]+',0)');
      x.fillStyle=g;x.fillRect(0,0,W,H);
    }
    x.restore();
  }});

V.register({id:'lensflare',name:'Lens Flare',icon:'☄️',cat:'Light',amt:.7,
  apply(fx){
    const{x,W,H,S}=fx,px=W*(.15+.7*V.mod(fx.time*.12,1)),py=H*(.25+.1*Math.sin(fx.time*.9)),cx=W/2,cy=H/2;
    x.save();x.globalCompositeOperation='screen';
    let g=x.createRadialGradient(px,py,0,px,py,H*.35);
    g.addColorStop(0,'rgba(255,255,230,'+.95*fx.amt+')');g.addColorStop(.25,'rgba(255,200,120,'+.4*fx.amt+')');g.addColorStop(1,'rgba(255,160,60,0)');
    x.fillStyle=g;x.fillRect(0,0,W,H);
    const s=x.createLinearGradient(px-W*.4,py,px+W*.4,py);
    s.addColorStop(0,'rgba(120,180,255,0)');s.addColorStop(.5,'rgba(255,255,255,'+.55*fx.amt+')');s.addColorStop(1,'rgba(120,180,255,0)');
    x.fillStyle=s;x.fillRect(px-W*.4,py-2*S,W*.8,4*S);
    for(let i=1;i<=4;i++){
      const k=i*.35,ox=px+(cx-px)*k*1.6,oy=py+(cy-py)*k*1.6,r=(14+i*9)*S;
      x.fillStyle='hsla('+(i*55)+',90%,65%,'+.28*fx.amt+')';x.beginPath();x.arc(ox,oy,r,0,7);x.fill();
    }
    x.restore();
  }});

V.register({id:'vignette',name:'Vignette',icon:'⭕',cat:'Light',amt:.7,
  params:[{k:'size',l:'Size',min:.1,max:.8,step:.01,def:.35}],
  apply(fx){fx.vig(fx.amt,fx.par.size);}});

V.register({id:'spotlight',name:'Spotlight',icon:'🔦',cat:'Light',amt:.8,
  apply(fx){
    const{W,H}=fx,px=W*(.5+.3*Math.sin(fx.time*.9)),py=H*(.5+.2*Math.cos(fx.time*.7)),R=H*.6,x=fx.x;
    const g=x.createRadialGradient(px,py,R*.35,px,py,R);
    g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,'+.92*fx.amt+')');
    fx.fill(g);
  }});

V.register({id:'rays',name:'Light Rays',icon:'🌞',cat:'Light',amt:.6,
  apply(fx){
    const{x,W,H}=fx,ox=W*.85,oy=-H*.1,n=9;
    x.save();x.globalCompositeOperation='lighter';
    for(let i=0;i<n;i++){
      const a=1.9+i*.18+Math.sin(fx.time*.5+i)*.06,w=.05+.03*Math.sin(fx.time+i*2),L=Math.hypot(W,H)*1.2;
      x.fillStyle='rgba(255,230,170,'+(.09*fx.amt*(1+Math.sin(fx.time*1.3+i)))+')';
      x.beginPath();x.moveTo(ox,oy);x.lineTo(ox+Math.cos(a-w)*L,oy+Math.sin(a-w)*L);x.lineTo(ox+Math.cos(a+w)*L,oy+Math.sin(a+w)*L);x.closePath();x.fill();
    }
    x.restore();
  }});

V.register({id:'filmburn',name:'Film Burn',icon:'🔥',cat:'Light',amt:.7,
  apply(fx){
    const{x,W,H}=fx,pulse=Math.pow(Math.max(0,Math.sin(fx.time*1.7)),2)*fx.amt;
    if(pulse<=.01)return;
    x.save();x.globalCompositeOperation='screen';
    for(let i=0;i<5;i++){
      const cx=fx.rnd(i+3)*W,cy=fx.rnd(i+9)*H,r=H*(.35+fx.rnd(i+20)*.4);
      const g=x.createRadialGradient(cx,cy,0,cx,cy,r);
      g.addColorStop(0,'rgba(255,230,120,'+pulse+')');g.addColorStop(.4,'rgba(255,100,20,'+.7*pulse+')');g.addColorStop(1,'rgba(200,20,0,0)');
      x.fillStyle=g;x.fillRect(0,0,W,H);
    }
    x.restore();
  }});

V.register({id:'flicker',name:'Light Flicker',icon:'💡',cat:'Light',amt:.6,
  apply(fx){
    const n=fx.step(24),r=fx.rnd(n);
    if(r<.5)fx.fill('rgba(0,0,0,'+r*.7*fx.amt+')');else fx.fill('rgba(255,255,255,'+(r-.5)*.3*fx.amt+')');
  }});
})();
