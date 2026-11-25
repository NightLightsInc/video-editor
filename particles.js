/* Particle effects — fully deterministic (no state), so scrubbing and export always match */
(function(){
const V=VFX;
const heart=(x,cx,cy,s)=>{
  x.beginPath();x.moveTo(cx,cy+s*.35);
  x.bezierCurveTo(cx-s*.9,cy-s*.2,cx-s*.5,cy-s*.9,cx,cy-s*.35);
  x.bezierCurveTo(cx+s*.5,cy-s*.9,cx+s*.9,cy-s*.2,cx,cy+s*.35);
  x.closePath();
};
const star=(x,cx,cy,r)=>{
  x.beginPath();x.moveTo(cx,cy-r);
  x.quadraticCurveTo(cx,cy,cx+r,cy);x.quadraticCurveTo(cx,cy,cx,cy+r);
  x.quadraticCurveTo(cx,cy,cx-r,cy);x.quadraticCurveTo(cx,cy,cx,cy-r);
  x.fill();
};

V.register({id:'snow',name:'Snowfall',icon:'❄️',cat:'Particles',amt:.6,
  params:[{k:'size',l:'Flake size',min:.5,max:3,step:.1,def:1}],
  apply(fx){
    const{x,W,H,S}=fx,n=Math.round(30+fx.amt*190),tt=fx.time;
    x.fillStyle='rgba(255,255,255,.85)';x.beginPath();
    for(let i=0;i<n;i++){
      const sz=(1+fx.rnd(i+.1)*3.5)*S*fx.par.size,sp=(.06+fx.rnd(i+.2)*.1)*H,
        y=V.mod(fx.rnd(i+.3)*H+tt*sp,H+20)-10,px=V.mod(fx.rnd(i+.4)*W+Math.sin(tt*.8+i)*25*S,W);
      x.moveTo(px+sz,y);x.arc(px,y,sz,0,6.2832);
    }
    x.fill();
  }});

V.register({id:'rain',name:'Rain',icon:'🌧️',cat:'Particles',amt:.6,
  apply(fx){
    const{x,W,H,S}=fx,n=Math.round(60+fx.amt*340),tt=fx.time;
    x.fillStyle='rgba(10,20,40,'+.18*fx.amt+')';x.fillRect(0,0,W,H);
    x.strokeStyle='rgba(190,210,255,.55)';x.lineWidth=1.3*S;x.beginPath();
    for(let i=0;i<n;i++){
      const len=(14+fx.rnd(i+.5)*22)*S,sp=H*(1.4+fx.rnd(i+.6)*.8),
        y=V.mod(fx.rnd(i+.7)*H+tt*sp,H+len)-len,px=V.mod(fx.rnd(i+.8)*W-tt*sp*.15,W);
      x.moveTo(px,y);x.lineTo(px-len*.2,y+len);
    }
    x.stroke();
  }});

V.register({id:'confetti',name:'Confetti',icon:'🎉',cat:'Particles',amt:.6,
  apply(fx){
    const{x,W,H,S}=fx,n=Math.round(40+fx.amt*160),tt=fx.time;
    for(let i=0;i<n;i++){
      const sp=(.12+fx.rnd(i+.2)*.18)*H,y=V.mod(fx.rnd(i+.3)*H+tt*sp,H+30)-15,px=V.mod(fx.rnd(i+.4)*W+Math.sin(tt*1.5+i)*30*S,W),
        w=(6+fx.rnd(i+.5)*8)*S;
      x.save();x.translate(px,y);x.rotate(tt*(2+fx.rnd(i)*4)+i);x.scale(1,Math.cos(tt*4+i));
      x.fillStyle='hsl('+Math.floor(fx.rnd(i+.9)*360)+',90%,60%)';x.fillRect(-w/2,-w/4,w,w/2);x.restore();
    }
  }});

V.register({id:'hearts',name:'Floating Hearts',icon:'💖',cat:'Particles',amt:.5,
  apply(fx){
    const{x,W,H,S}=fx,n=Math.round(14+fx.amt*40),tt=fx.time;
    for(let i=0;i<n;i++){
      const sp=(.08+fx.rnd(i+.2)*.12)*H,k=V.mod(fx.rnd(i+.3)+tt*sp/H,1),y=H*(1.1-k*1.3),
        px=V.mod(fx.rnd(i+.4)*W+Math.sin(tt*1.2+i)*30*S,W),s=(10+fx.rnd(i+.5)*22)*S;
      x.fillStyle='hsla('+(335+fx.rnd(i+.6)*25)+',90%,65%,'+Math.min(1,k*5,(1-k)*2.5)*.85+')';
      heart(x,px,y,s);x.fill();
    }
  }});

V.register({id:'sparkles',name:'Sparkles',icon:'🌟',cat:'Particles',amt:.6,
  apply(fx){
    const{x,W,H,S}=fx,n=Math.round(15+fx.amt*60),tt=fx.time;
    x.save();x.globalCompositeOperation='lighter';
    for(let i=0;i<n;i++){
      const ph=tt*(1.5+fx.rnd(i+.2)*2.5)+fx.rnd(i)*20,k=Math.pow(Math.max(0,Math.sin(ph)),2);
      if(k<.02)continue;
      x.fillStyle='rgba(255,244,200,'+k+')';
      star(x,fx.rnd(i+.3)*W,fx.rnd(i+.4)*H,(6+fx.rnd(i+.5)*16)*S*k);
    }
    x.restore();
  }});

V.register({id:'bokeh',name:'Bokeh Lights',icon:'🔵',cat:'Particles',amt:.6,
  apply(fx){
    const{x,W,H,S}=fx,n=Math.round(10+fx.amt*22),tt=fx.time;
    x.save();x.globalCompositeOperation='screen';
    for(let i=0;i<n;i++){
      const r=(30+fx.rnd(i+.2)*70)*S,px=V.mod(fx.rnd(i+.3)*W+tt*(8+fx.rnd(i)*20)*S,W+2*r)-r,
        py=H*(.5+.55*(fx.rnd(i+.4)-.5)*2)+Math.sin(tt*.4+i)*20*S,h=Math.floor(fx.rnd(i+.5)*360);
      const g=x.createRadialGradient(px,py,0,px,py,r);
      g.addColorStop(0,'hsla('+h+',90%,70%,'+.4*fx.amt+')');g.addColorStop(.75,'hsla('+h+',90%,70%,'+.25*fx.amt+')');g.addColorStop(1,'hsla('+h+',90%,70%,0)');
      x.fillStyle=g;x.fillRect(px-r,py-r,r*2,r*2);
    }
    x.restore();
  }});

V.register({id:'bubbles',name:'Bubbles',icon:'🫧',cat:'Particles',amt:.5,
  apply(fx){
    const{x,W,H,S}=fx,n=Math.round(10+fx.amt*30),tt=fx.time;
    x.lineWidth=1.5*S;
    for(let i=0;i<n;i++){
      const r=(8+fx.rnd(i+.2)*26)*S,sp=(.06+fx.rnd(i+.3)*.1)*H,y=H+r-V.mod(fx.rnd(i+.4)*H+tt*sp,H+2*r),
        px=V.mod(fx.rnd(i+.5)*W+Math.sin(tt*1.1+i)*18*S,W);
      x.fillStyle='rgba(255,255,255,.08)';x.strokeStyle='rgba(255,255,255,.55)';
      x.beginPath();x.arc(px,y,r,0,7);x.fill();x.stroke();
      x.fillStyle='rgba(255,255,255,.7)';x.beginPath();x.arc(px-r*.35,y-r*.35,r*.18,0,7);x.fill();
    }
  }});

V.register({id:'dust',name:'Floating Dust',icon:'🌌',cat:'Particles',amt:.5,
  apply(fx){
    const{x,W,H,S}=fx,n=Math.round(40+fx.amt*160),tt=fx.time;
    x.save();x.globalCompositeOperation='lighter';x.fillStyle='rgba(255,240,210,.45)';x.beginPath();
    for(let i=0;i<n;i++){
      const r=(.8+fx.rnd(i+.2)*2.2)*S,px=V.mod(fx.rnd(i+.3)*W+tt*(3+fx.rnd(i)*9)*S+Math.sin(tt*.5+i)*12*S,W),
        py=V.mod(fx.rnd(i+.4)*H-tt*(4+fx.rnd(i+.1)*10)*S,H);
      x.moveTo(px+r,py);x.arc(px,py,r,0,6.2832);
    }
    x.fill();x.restore();
  }});

V.register({id:'matrix',name:'Digital Rain',icon:'💻',cat:'Particles',amt:.6,
  apply(fx){
    const{x,W,H,S}=fx,fs=Math.max(8,Math.round(16*S)),cols=Math.ceil(W/fs),len=14,tt=fx.time,chars='ｱｲｳｴｵｶｷｸｹｺ0123456789ABCDEF';
    x.fillStyle='rgba(0,20,0,'+.5*fx.amt+')';x.fillRect(0,0,W,H);
    x.font=fs+'px monospace';x.textBaseline='top';
    for(let c=0;c<cols;c++){
      const head=V.mod(fx.rnd(c+.1)*(H/fs+len)+tt*(6+fx.rnd(c+.2)*10),H/fs+len);
      for(let i=0;i<len;i++){
        const row=head-i;if(row<0||row*fs>H)continue;
        const ch=chars[Math.floor(fx.rnd(c*100+i+Math.floor(tt*6))*chars.length)];
        x.fillStyle=i===0?'rgba(210,255,220,'+fx.amt+')':'rgba(0,255,70,'+(1-i/len)*.85*fx.amt+')';
        x.fillText(ch,c*fs,row*fs);
      }
    }
  }});
})();
