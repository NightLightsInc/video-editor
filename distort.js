/* Distortion effects */
(function(){
const V=VFX;

V.register({id:'wave',name:'Wave',icon:'🌊',cat:'Distort',amt:.5,
  params:[{k:'freq',l:'Frequency',min:.2,max:4,step:.1,def:1}],
  apply(fx){
    const{x,W,H,S}=fx,src=fx.snap(),st=Math.max(2,Math.round(3*S)),amp=fx.amt*W*.04;
    fx.reset();x.clearRect(0,0,W,H);
    for(let y=0;y<H;y+=st)x.drawImage(src,0,y,W,st,Math.sin(y*fx.par.freq*.05+fx.time*4)*amp,y,W,st);
  }});

V.register({id:'waveV',name:'Vertical Wave',icon:'〰️',cat:'Distort',amt:.5,
  params:[{k:'freq',l:'Frequency',min:.2,max:4,step:.1,def:1}],
  apply(fx){
    const{x,W,H,S}=fx,src=fx.snap(),st=Math.max(2,Math.round(3*S)),amp=fx.amt*H*.04;
    fx.reset();x.clearRect(0,0,W,H);
    for(let xx=0;xx<W;xx+=st)x.drawImage(src,xx,0,st,H,xx,Math.sin(xx*fx.par.freq*.05+fx.time*4)*amp,st,H);
  }});

V.register({id:'bulge',name:'Fisheye Bulge',icon:'🔍',cat:'Distort',amt:.6,
  apply(fx){
    const asp=fx.aspect,k=fx.amt*1.2,R=.55;
    fx.warp((u,v,o)=>{
      const dx=(u-.5)*asp,dy=v-.5,r=Math.hypot(dx,dy);
      if(r>=R||r===0){o[0]=u;o[1]=v;return;}
      const f=R*Math.pow(r/R,1+k)/r;
      o[0]=.5+dx*f/asp;o[1]=.5+dy*f;
    });
  }});

V.register({id:'pinch',name:'Pinch',icon:'🤏',cat:'Distort',amt:.6,
  apply(fx){
    const asp=fx.aspect,k=fx.amt*.9,R=.55;
    fx.warp((u,v,o)=>{
      const dx=(u-.5)*asp,dy=v-.5,r=Math.hypot(dx,dy);
      if(r>=R||r===0){o[0]=u;o[1]=v;return;}
      const f=R*Math.pow(r/R,1/(1+k))/r;
      o[0]=.5+dx*f/asp;o[1]=.5+dy*f;
    });
  }});

V.register({id:'swirl',name:'Swirl',icon:'🌀',cat:'Distort',amt:.6,
  apply(fx){
    const asp=fx.aspect,R=.6,sw=fx.amt*4*Math.sin(fx.time*1.6);
    fx.warp((u,v,o)=>{
      const dx=(u-.5)*asp,dy=v-.5,r=Math.hypot(dx,dy);
      if(r>=R){o[0]=u;o[1]=v;return;}
      const a=sw*Math.pow(1-r/R,2),c=Math.cos(a),s=Math.sin(a);
      o[0]=.5+(dx*c-dy*s)/asp;o[1]=.5+(dx*s+dy*c);
    });
  }});

V.register({id:'ripple',name:'Water Ripple',icon:'💧',cat:'Distort',amt:.5,
  apply(fx){
    const asp=fx.aspect,A=fx.amt*.03,tt=fx.time*6;
    fx.warp((u,v,o)=>{
      const dx=(u-.5)*asp,dy=v-.5,r=Math.hypot(dx,dy);
      if(r===0){o[0]=u;o[1]=v;return;}
      const f=(r+A*Math.sin(r*45-tt))/r;
      o[0]=.5+dx*f/asp;o[1]=.5+dy*f;
    });
  }});

V.register({id:'tiles',name:'Tile Grid',icon:'🔳',cat:'Distort',amt:.9,
  params:[{k:'n',l:'Tiles per row',min:2,max:6,step:1,def:3}],
  apply(fx){
    const{x,W,H}=fx,src=fx.snap(),n=fx.par.n|0,w=W/n,h=H/n;
    x.save();x.globalAlpha=Math.min(1,.2+fx.amt);
    for(let r=0;r<n;r++)for(let c=0;c<n;c++)x.drawImage(src,c*w,r*h,w,h);
    x.restore();
  }});

V.register({id:'mirror',name:'Mirror',icon:'🪞',cat:'Distort',amt:.9,
  params:[{k:'mode',l:'Mode',t:'select',o:[['h','Left → right'],['v','Top → bottom'],['q','Four-way']],def:'h'}],
  apply(fx){
    const{x,W,H}=fx,src=fx.snap(),m=fx.par.mode;
    x.save();x.globalAlpha=Math.min(1,fx.amt*1.4);
    if(m==='h'||m==='q'){x.save();x.translate(W,0);x.scale(-1,1);x.drawImage(src,0,0,W/2,H,0,0,W/2,H);x.restore();}
    if(m==='v'||m==='q'){x.save();x.translate(0,H);x.scale(1,-1);x.drawImage(src,0,0,W,H/2,0,0,W,H/2);x.restore();}
    if(m==='q'){x.save();x.translate(W,H);x.scale(-1,-1);x.drawImage(src,0,0,W/2,H/2,0,0,W/2,H/2);x.restore();}
    x.restore();
  }});

V.register({id:'kaleido',name:'Kaleidoscope',icon:'🔮',cat:'Distort',amt:.5,
  params:[{k:'seg',l:'Segments',min:4,max:16,step:2,def:8}],
  apply(fx){
    const{x,W,H}=fx,src=fx.snap(),n=Math.max(4,2*Math.round(fx.par.seg/2)),cx=W/2,cy=H/2,R=Math.hypot(W,H)/2,st=Math.PI*2/n,rot=fx.time*.6*fx.amt;
    fx.reset();x.clearRect(0,0,W,H);
    for(let i=0;i<n;i++){
      x.save();x.translate(cx,cy);x.rotate(i*st);
      if(i%2)x.scale(1,-1);
      x.beginPath();x.moveTo(0,0);x.arc(0,0,R,-st/2,st/2);x.closePath();x.clip();
      x.rotate(rot);x.drawImage(src,-cx,-cy);
      x.restore();
    }
  }});

V.register({id:'echo',name:'Echo Trail',icon:'👥',cat:'Distort',amt:.5,
  params:[{k:'angle',l:'Direction',min:0,max:360,step:1,def:0}],
  apply(fx){
    const{x,W,H}=fx,src=fx.snap(),a=fx.par.angle*Math.PI/180,n=6,d=fx.amt*W*.03;
    fx.reset();x.clearRect(0,0,W,H);
    for(let i=n;i>=0;i--){
      x.globalAlpha=i===n?1:(i===0?.9:.4);
      x.drawImage(src,Math.cos(a)*d*i,Math.sin(a)*d*i);
    }
    x.globalAlpha=1;
  }});
})();
