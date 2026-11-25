/* Motion effects — move/scale/rotate the whole frame (or clip) */
(function(){
const V=VFX;
const ease=p=>p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2;
/* scale needed so a frame rotated by `a` still covers the canvas */
const cover=(fx,a)=>Math.abs(Math.cos(a))+Math.abs(Math.sin(a))*Math.max(fx.aspect,1/fx.aspect);

V.register({id:'shake',name:'Camera Shake',icon:'📳',cat:'Motion',amt:.5,
  apply(fx){
    const t=fx.time,a=fx.amt*fx.W*.02,dx=(Math.sin(t*53)+Math.sin(t*29)*.6)*a,dy=(Math.cos(t*47)+Math.cos(t*23)*.6)*a,r=Math.sin(t*37)*fx.amt*.03;
    fx.xform(x=>{x.translate(dx,dy);x.rotate(r);x.scale(1.08,1.08);});
  }});

V.register({id:'pulse',name:'Beat Pulse',icon:'💓',cat:'Motion',amt:.6,
  params:[{k:'rate',l:'Beats / sec',min:.5,max:4,step:.5,def:2}],
  apply(fx){
    const k=Math.pow(1-V.mod(fx.time*fx.par.rate,1),3),s=1+fx.amt*.18*k;
    fx.xform(x=>x.scale(s,s));
  }});

V.register({id:'spin',name:'Spin',icon:'🔁',cat:'Motion',amt:.5,
  params:[{k:'speed',l:'Degrees / sec',min:-360,max:360,step:5,def:60}],
  apply(fx){
    const a=fx.time*fx.par.speed*fx.amt*2*Math.PI/180,s=cover(fx,a);
    fx.xform(x=>{x.rotate(a);x.scale(s,s);});
  }});

V.register({id:'wobble',name:'Jelly Wobble',icon:'🍮',cat:'Motion',amt:.6,
  apply(fx){
    const a=Math.sin(fx.time*4)*fx.amt*.09,s=cover(fx,a)*(1+fx.amt*.08*Math.sin(fx.time*3));
    fx.xform(x=>{x.rotate(a);x.scale(s,s);});
  }});

V.register({id:'zoomin',name:'Punch In',icon:'🔎',cat:'Motion',amt:.5,
  apply(fx){const s=1+fx.amt*.6*ease(fx.p);fx.xform(x=>x.scale(s,s));}});

V.register({id:'zoomout',name:'Pull Out',icon:'🔭',cat:'Motion',amt:.5,
  apply(fx){const s=1+fx.amt*.6*(1-ease(fx.p));fx.xform(x=>x.scale(s,s));}});

V.register({id:'swing',name:'Swing',icon:'🎠',cat:'Motion',amt:.6,
  apply(fx){
    const a=Math.sin(fx.time*2)*fx.amt*.14,s=cover(fx,a);
    fx.xform(x=>{x.translate(Math.sin(fx.time*2)*fx.amt*fx.W*.02,0);x.rotate(a);x.scale(s,s);});
  }});

V.register({id:'flipflop',name:'Flip Flop',icon:'↔️',cat:'Motion',amt:.8,
  params:[{k:'rate',l:'Flips / sec',min:.5,max:8,step:.5,def:2}],
  apply(fx){
    if(fx.step(fx.par.rate)%2===0)return;
    fx.xform(x=>x.scale(-1,1));
  }});
})();
