import{a2 as n,a8 as r,t as j,y as u,av as v,aB as $}from"../modules/vue-qDBvoHgk.js";import{I as p,Q as C,aj as x,P as S,N as k,O as R,ak as l,M as T,al as E,am as F}from"../index-CH24ehoa.js";function O(){const t=n(x),a=r(t,"nav"),s=n(S).value,e=r(s,"current"),i=n(k),c=n(R),o=n(l,{}),d=n(T,void 0),m=n(p,j(1)),f=n(C,u(()=>1));return{$slidev:t,$nav:a,$clicksContext:s,$clicks:e,$page:i,$route:d,$renderContext:c,$frontmatter:o,$scale:m,$zoom:f}}function b(t){var i,c;v(l,t);const{$slidev:a,$page:s}=O(),e=a.nav.slides.find(o=>o.no===s.value);if((c=(i=e==null?void 0:e.meta)==null?void 0:i.slide)!=null&&c.frontmatter){for(const o of Object.keys(e.meta.slide.frontmatter))o in t||delete e.meta.slide.frontmatter[o];Object.assign(e.meta.slide.frontmatter,t)}}function y(t,a){return{...$(t,a===0?E:F),frontmatter:t}}export{y as f,b as p,O as u};
