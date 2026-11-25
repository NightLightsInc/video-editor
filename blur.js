/* Blur effects */
(function(){
const V=VFX;

V.register({id:'blur',name:'Gaussian Blur',icon:'🌫️',cat:'Blur',amt:.5,
  apply(fx){
    const b=fx.blurCopy(fx.amt*40*fx.S);
    fx.reset();fx.x.clearRect(0,0,fx.W,fx.H);fx.x.drawImage(b,0,0);
  }});

V.register({id:'zoomblur',name:'Zoom Blur',icon:'💨',cat:'Blur',amt:.6,
  apply(fx){
    const{x,W,H}=fx,src=fx.snap(),n=10;
    fx.reset();x.clearRect(0,0,W,H);
    for(let i=0;i<n;i++){
      const s=1+i*fx.amt*.06;
      x.globalAlpha=1/(i+1);
      x.drawImage(src,-(s-1)*W/2,-(s-1)*H/2,W*s,H*s);
    }
    x.globalAlpha=1;
  }});

V.register({id:'motionblur',name:'Motion Blur',icon:'🏎️',cat:'Blur',amt:.6,
  params:[{k:'angle',l:'Direction',min:0,max:360,step:1,def:0}],
  apply(fx){
    const{x,W,H}=fx,src=fx.snap(),n=10,a=fx.par.angle*Math.PI/180,d=fx.amt*W*.08;
    fx.reset();x.clearRect(0,0,W,H);
    for(let i=0;i<n;i++){
      const o=(i/(n-1)-.5)*d;
      x.globalAlpha=1/(i+1);
      x.drawImage(src,Math.cos(a)*o,Math.sin(a)*o);
    }
    x.globalAlpha=1;
  }});

V.register({id:'tiltshift',name:'Tilt-Shift',icon:'🏙️',cat:'Blur',amt:.6,
  apply(fx){
    const{x,W,H}=fx,b=fx.blurCopy(fx.amt*18*fx.S),t2=fx.tx2;
    t2.save();t2.globalCompositeOperation='destination-in';
    const g=t2.createLinearGradient(0,0,0,H);
    g.addColorStop(0,'rgba(0,0,0,1)');g.addColorStop(.3,'rgba(0,0,0,0)');g.addColorStop(.7,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,1)');
    t2.fillStyle=g;t2.fillRect(0,0,W,H);t2.restore();
    fx.reset();x.drawImage(b,0,0);
  }});
})();
