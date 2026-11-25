/* Retro / film effects */
(function(){
const V=VFX;

V.register({id:'crt',name:'CRT TV',icon:'🖥️',cat:'Retro',amt:.7,
  apply(fx){
    const{x,W,H,S}=fx,a=fx.amt;
    fx.channelShift(W*.002*(1+a*2),0);
    x.save();x.globalCompositeOperation='source-atop';
    const st=Math.max(2,Math.round(3*S));
    x.fillStyle='rgba(0,0,0,'+.35*a+')';
    for(let y=0;y<H;y+=st*2)x.fillRect(0,y,W,st);
    const m=st;
    for(let xx=0;xx<W;xx+=m*3){
      x.fillStyle='rgba(255,0,0,'+.07*a+')';x.fillRect(xx,0,m,H);
      x.fillStyle='rgba(0,255,0,'+.07*a+')';x.fillRect(xx+m,0,m,H);
      x.fillStyle='rgba(0,0,255,'+.07*a+')';x.fillRect(xx+2*m,0,m,H);
    }
    x.fillStyle='rgba(255,255,255,'+Math.max(0,.03*a*(1+Math.sin(fx.time*50)))+')';x.fillRect(0,0,W,H);
    x.restore();
    fx.vig(.6*a);
  }});

V.register({id:'oldfilm',name:'Old Film',icon:'🎞️',cat:'Retro',amt:.7,
  apply(fx){
    const{x,W,H,S}=fx,a=fx.amt,n=fx.step(12);
    fx.applyFilter('sepia('+.85*a+') contrast('+(1+.15*a)+') brightness('+(1-.05*a)+')');
    x.save();x.globalCompositeOperation='source-atop';
    x.strokeStyle='rgba(255,255,255,'+.5*a+')';x.lineWidth=Math.max(1,S);
    for(let i=0;i<4;i++){
      if(fx.rnd(n*4+i)<.5)continue;
      const sx=fx.rnd(n+i*17)*W;
      x.beginPath();x.moveTo(sx,0);x.lineTo(sx+(fx.rnd(n+i)-.5)*10,H);x.stroke();
    }
    x.fillStyle='rgba(0,0,0,'+.6*a+')';
    for(let i=0;i<14;i++){
      const px=fx.rnd(n*9+i)*W,py=fx.rnd(n*9+i+40)*H,r=(1+fx.rnd(i+n)*2.5)*S;
      x.beginPath();x.arc(px,py,r,0,7);x.fill();
    }
    const fl=(fx.rnd(n+3)-.5)*.2*a;
    x.fillStyle=fl>0?'rgba(255,255,255,'+fl+')':'rgba(0,0,0,'+(-fl)+')';x.fillRect(0,0,W,H);
    x.restore();
    fx.noise(.2*a);fx.vig(.5*a);
  }});

V.register({id:'noir',name:'Film Noir',icon:'🕶️',cat:'Retro',amt:.9,
  apply(fx){
    const a=fx.amt;
    if(!fx.applyFilter('grayscale('+a+') contrast('+(1+.4*a)+') brightness('+(1-.1*a)+')')){
      fx.pixels(d=>{for(let i=0;i<d.length;i+=4){const g=.299*d[i]+.587*d[i+1]+.114*d[i+2];d[i]+=(g-d[i])*a;d[i+1]+=(g-d[i+1])*a;d[i+2]+=(g-d[i+2])*a;}});
    }
    fx.noise(.22*a);fx.vig(.55*a);
  }});

V.register({id:'pixel8',name:'8-Bit Retro',icon:'👾',cat:'Retro',amt:.5,
  params:[{k:'levels',l:'Colors / channel',min:2,max:8,step:1,def:4}],
  apply(fx){
    const L=V.posterLut(fx.par.levels);
    fx.pixelate(Math.max(2,Math.round((3+fx.amt*14)*fx.S)));
    fx.pixels(d=>{for(let i=0;i<d.length;i+=4){d[i]=L[d[i]];d[i+1]=L[d[i+1]];d[i+2]=L[d[i+2]];}});
  }});

V.register({id:'vintage',name:'Faded Vintage',icon:'📷',cat:'Retro',amt:.7,
  apply(fx){
    const a=fx.amt;
    fx.applyFilter('sepia('+.4*a+') saturate('+(1-.25*a)+') contrast('+(1-.1*a)+') brightness('+(1+.1*a)+')');
    fx.grade('soft-light',x=>{x.fillStyle='rgba(255,170,90,'+.5*a+')';x.fillRect(0,0,fx.W,fx.H);});
    fx.vig(.35*a);
  }});
})();
