/* Glitch effects */
(function(){
const V=VFX;

V.register({id:'glitch',name:'Digital Glitch',icon:'⚡',cat:'Glitch',amt:.6,
  params:[{k:'rate',l:'Rate',min:2,max:30,step:1,def:12}],
  apply(fx){
    const{x,W,H}=fx,n=fx.step(fx.par.rate);
    if(fx.rnd(n*1.3)>.4+fx.amt*.5)return;
    const src=fx.snap(),cnt=3+Math.floor(fx.amt*10);
    for(let i=0;i<cnt;i++){
      const y=fx.rnd(n*7+i)*H,h=(.01+fx.rnd(n*3+i+50)*.07)*H,dx=(fx.rnd(n*5+i+99)-.5)*W*.3*fx.amt;
      x.drawImage(src,0,y,W,h,dx,y,W,h);
    }
    fx.channelShift((fx.rnd(n+.5)-.5)*W*.05*fx.amt,0);
  }});

V.register({id:'rgbsplit',name:'RGB Split',icon:'🌈',cat:'Glitch',amt:.5,
  params:[{k:'angle',l:'Angle',min:0,max:360,step:1,def:0}],
  apply(fx){
    const a=fx.amt*fx.W*.04*(1+.4*Math.sin(fx.time*6)),g=fx.par.angle*Math.PI/180;
    fx.channelShift(Math.cos(g)*a,Math.sin(g)*a);
  }});

V.register({id:'vhs',name:'VHS Tape',icon:'📼',cat:'Glitch',amt:.6,
  apply(fx){
    const{x,W,H,S}=fx,src=fx.snap(),tt=fx.time,bands=28,bh=H/bands,n=fx.step(15);
    fx.reset();x.clearRect(0,0,W,H);
    for(let i=0;i<bands;i++){
      let o=Math.sin(tt*3+i*.6)*fx.amt*W*.004;
      if(fx.rnd(n*31+i)>.96)o+=(fx.rnd(n+i*7)-.5)*W*.08*fx.amt;
      x.drawImage(src,0,i*bh,W,bh+1,o,i*bh,W,bh+1);
    }
    fx.channelShift(W*.006*fx.amt,0);
    x.save();x.globalCompositeOperation='source-atop';
    const by=(V.mod(tt*.18,1.3)-.15)*H;
    x.fillStyle='rgba(255,255,255,'+.1*fx.amt+')';x.fillRect(0,by,W,H*.05);
    const st=Math.max(2,Math.round(3*S));
    x.fillStyle='rgba(0,0,0,'+.22*fx.amt+')';
    for(let y=0;y<H;y+=st*2)x.fillRect(0,y,W,st);
    x.restore();fx.noise(.18*fx.amt);
  }});

V.register({id:'blockglitch',name:'Block Glitch',icon:'🧩',cat:'Glitch',amt:.6,
  apply(fx){
    const{x,W,H}=fx,n=fx.step(10);
    if(fx.rnd(n*2.1)>.3+fx.amt*.6)return;
    const src=fx.snap(),cnt=4+Math.floor(fx.amt*14),cols=['rgba(0,255,255,.35)','rgba(255,0,255,.35)','rgba(255,255,0,.3)'];
    for(let i=0;i<cnt;i++){
      const w=(.05+fx.rnd(n+i*3)*.25)*W,h=(.02+fx.rnd(n+i*5+1)*.1)*H,
        sx=fx.rnd(n+i*7+2)*(W-w),sy=fx.rnd(n+i*11+3)*(H-h),dx=fx.rnd(n+i*13+4)*(W-w),dy=sy+(fx.rnd(n+i*17+5)-.5)*H*.1;
      x.drawImage(src,sx,sy,w,h,dx,dy,w,h);
      if(fx.rnd(n+i*19+6)>.7){x.fillStyle=cols[i%3];x.fillRect(dx,dy,w,h);}
    }
  }});

V.register({id:'static',name:'TV Static',icon:'📡',cat:'Glitch',amt:.5,
  apply(fx){
    fx.noise(.95*fx.amt);
    const{x,W,H}=fx,n=fx.step(20);
    x.save();x.globalCompositeOperation='source-atop';x.fillStyle='rgba(255,255,255,'+.15*fx.amt+')';
    const y=fx.rnd(n)*H;x.fillRect(0,y,W,H*.02*(1+fx.amt*2));x.restore();
  }});
})();
