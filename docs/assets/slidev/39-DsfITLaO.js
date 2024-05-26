import{_ as p}from"./CodeBlockWrapper-DG1fbEE8.js";import{az as d,o as h,c as g,k as t,l as y,m as o,e as i,aa as a,b as l,a6 as s,q as E,s as c,H as e}from"../modules/vue-qDBvoHgk.js";import{I as A}from"./default-u-WvGX0l.js";import{_ as D,aD as n}from"../index-7ixfqLpl.js";import{p as f,u as F,f as _}from"./context-D9leBwJm.js";import"../modules/unplugin-icons-Db5cH8pe.js";import"../monaco/bundled-types-BMrb6fwg.js";import"../modules/file-saver-DY7lxZlc.js";import"../modules/shiki-BnrpArDE.js";const m=i("h1",null,"Composing Effects: flatMap",-1),u=i("pre",{class:"shiki shiki-themes vitesse-dark vitesse-light slidev-code",style:{"--shiki-dark":"#dbd7caee","--shiki-light":"#393a34","--shiki-dark-bg":"#121212","--shiki-light-bg":"#ffffff"}},[i("code",{class:"language-ts"},[i("span",{class:"line"},[i("span",{style:{"--shiki-dark":"#CB7676","--shiki-light":"#AB5959"}},"declare const "),i("span",{style:{"--shiki-dark":"#BD976A","--shiki-light":"#B07D48"}},"flatMap"),i("span",{style:{"--shiki-dark":"#666666","--shiki-light":"#999999"}},": {")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-dark":"#666666","--shiki-light":"#999999"}},"  <"),i("span",{style:{"--shiki-dark":"#5DA994","--shiki-light":"#2E8F82"}},"A"),i("span",{style:{"--shiki-dark":"#666666","--shiki-light":"#999999"}},", "),i("span",{style:{"--shiki-dark":"#5DA994","--shiki-light":"#2E8F82"}},"B"),i("span",{style:{"--shiki-dark":"#666666","--shiki-light":"#999999"}},", "),i("span",{style:{"--shiki-dark":"#5DA994","--shiki-light":"#2E8F82"}},"E1"),i("span",{style:{"--shiki-dark":"#666666","--shiki-light":"#999999"}},", "),i("span",{style:{"--shiki-dark":"#5DA994","--shiki-light":"#2E8F82"}},"R1"),i("span",{style:{"--shiki-dark":"#666666","--shiki-light":"#999999"}},">("),i("span",{style:{"--shiki-dark":"#80A665","--shiki-light":"#59873A"}},"f"),i("span",{style:{"--shiki-dark":"#666666","--shiki-light":"#999999"}},": ("),i("span",{style:{"--shiki-dark":"#BD976A","--shiki-light":"#B07D48"}},"a"),i("span",{style:{"--shiki-dark":"#666666","--shiki-light":"#999999"}},": "),i("span",{style:{"--shiki-dark":"#5DA994","--shiki-light":"#2E8F82"}},"A"),i("span",{style:{"--shiki-dark":"#666666","--shiki-light":"#999999"}},") => "),i("span",{style:{"--shiki-dark":"#5DA994","--shiki-light":"#2E8F82"}},"Effect"),i("span",{style:{"--shiki-dark":"#666666","--shiki-light":"#999999"}},"<"),i("span",{style:{"--shiki-dark":"#5DA994","--shiki-light":"#2E8F82"}},"B"),i("span",{style:{"--shiki-dark":"#666666","--shiki-light":"#999999"}},", "),i("span",{style:{"--shiki-dark":"#5DA994","--shiki-light":"#2E8F82"}},"E1"),i("span",{style:{"--shiki-dark":"#666666","--shiki-light":"#999999"}},", "),i("span",{style:{"--shiki-dark":"#5DA994","--shiki-light":"#2E8F82"}},"R1"),i("span",{style:{"--shiki-dark":"#666666","--shiki-light":"#999999"}},">): <"),i("span",{style:{"--shiki-dark":"#5DA994","--shiki-light":"#2E8F82"}},"E"),i("span",{style:{"--shiki-dark":"#666666","--shiki-light":"#999999"}},", "),i("span",{style:{"--shiki-dark":"#5DA994","--shiki-light":"#2E8F82"}},"R"),i("span",{style:{"--shiki-dark":"#666666","--shiki-light":"#999999"}},">("),i("span",{style:{"--shiki-dark":"#BD976A","--shiki-light":"#B07D48"}},"self"),i("span",{style:{"--shiki-dark":"#666666","--shiki-light":"#999999"}},": "),i("span",{style:{"--shiki-dark":"#5DA994","--shiki-light":"#2E8F82"}},"Effect"),i("span",{style:{"--shiki-dark":"#666666","--shiki-light":"#999999"}},"<"),i("span",{style:{"--shiki-dark":"#5DA994","--shiki-light":"#2E8F82"}},"A"),i("span",{style:{"--shiki-dark":"#666666","--shiki-light":"#999999"}},", "),i("span",{style:{"--shiki-dark":"#5DA994","--shiki-light":"#2E8F82"}},"E"),i("span",{style:{"--shiki-dark":"#666666","--shiki-light":"#999999"}},", "),i("span",{style:{"--shiki-dark":"#5DA994","--shiki-light":"#2E8F82"}},"R"),i("span",{style:{"--shiki-dark":"#666666","--shiki-light":"#999999"}},">) => "),i("span",{style:{"--shiki-dark":"#5DA994","--shiki-light":"#2E8F82"}},"Effect"),i("span",{style:{"--shiki-dark":"#666666","--shiki-light":"#999999"}},"<"),i("span",{style:{"--shiki-dark":"#5DA994","--shiki-light":"#2E8F82"}},"B"),i("span",{style:{"--shiki-dark":"#666666","--shiki-light":"#999999"}},", "),i("span",{style:{"--shiki-dark":"#5DA994","--shiki-light":"#2E8F82"}},"E1"),i("span",{style:{"--shiki-dark":"#666666","--shiki-light":"#999999"}}," | "),i("span",{style:{"--shiki-dark":"#5DA994","--shiki-light":"#2E8F82"}},"E"),i("span",{style:{"--shiki-dark":"#666666","--shiki-light":"#999999"}},", "),i("span",{style:{"--shiki-dark":"#5DA994","--shiki-light":"#2E8F82"}},"R1"),i("span",{style:{"--shiki-dark":"#666666","--shiki-light":"#999999"}}," | "),i("span",{style:{"--shiki-dark":"#5DA994","--shiki-light":"#2E8F82"}},"R"),i("span",{style:{"--shiki-dark":"#666666","--shiki-light":"#999999"}},">")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-dark":"#666666","--shiki-light":"#999999"}},"  <"),i("span",{style:{"--shiki-dark":"#5DA994","--shiki-light":"#2E8F82"}},"A"),i("span",{style:{"--shiki-dark":"#666666","--shiki-light":"#999999"}},", "),i("span",{style:{"--shiki-dark":"#5DA994","--shiki-light":"#2E8F82"}},"E"),i("span",{style:{"--shiki-dark":"#666666","--shiki-light":"#999999"}},", "),i("span",{style:{"--shiki-dark":"#5DA994","--shiki-light":"#2E8F82"}},"R"),i("span",{style:{"--shiki-dark":"#666666","--shiki-light":"#999999"}},", "),i("span",{style:{"--shiki-dark":"#5DA994","--shiki-light":"#2E8F82"}},"B"),i("span",{style:{"--shiki-dark":"#666666","--shiki-light":"#999999"}},", "),i("span",{style:{"--shiki-dark":"#5DA994","--shiki-light":"#2E8F82"}},"E1"),i("span",{style:{"--shiki-dark":"#666666","--shiki-light":"#999999"}},", "),i("span",{style:{"--shiki-dark":"#5DA994","--shiki-light":"#2E8F82"}},"R1"),i("span",{style:{"--shiki-dark":"#666666","--shiki-light":"#999999"}},">("),i("span",{style:{"--shiki-dark":"#BD976A","--shiki-light":"#B07D48"}},"self"),i("span",{style:{"--shiki-dark":"#666666","--shiki-light":"#999999"}},": "),i("span",{style:{"--shiki-dark":"#5DA994","--shiki-light":"#2E8F82"}},"Effect"),i("span",{style:{"--shiki-dark":"#666666","--shiki-light":"#999999"}},"<"),i("span",{style:{"--shiki-dark":"#5DA994","--shiki-light":"#2E8F82"}},"A"),i("span",{style:{"--shiki-dark":"#666666","--shiki-light":"#999999"}},", "),i("span",{style:{"--shiki-dark":"#5DA994","--shiki-light":"#2E8F82"}},"E"),i("span",{style:{"--shiki-dark":"#666666","--shiki-light":"#999999"}},", "),i("span",{style:{"--shiki-dark":"#5DA994","--shiki-light":"#2E8F82"}},"R"),i("span",{style:{"--shiki-dark":"#666666","--shiki-light":"#999999"}},">, "),i("span",{style:{"--shiki-dark":"#80A665","--shiki-light":"#59873A"}},"f"),i("span",{style:{"--shiki-dark":"#666666","--shiki-light":"#999999"}},": ("),i("span",{style:{"--shiki-dark":"#BD976A","--shiki-light":"#B07D48"}},"a"),i("span",{style:{"--shiki-dark":"#666666","--shiki-light":"#999999"}},": "),i("span",{style:{"--shiki-dark":"#5DA994","--shiki-light":"#2E8F82"}},"A"),i("span",{style:{"--shiki-dark":"#666666","--shiki-light":"#999999"}},") => "),i("span",{style:{"--shiki-dark":"#5DA994","--shiki-light":"#2E8F82"}},"Effect"),i("span",{style:{"--shiki-dark":"#666666","--shiki-light":"#999999"}},"<"),i("span",{style:{"--shiki-dark":"#5DA994","--shiki-light":"#2E8F82"}},"B"),i("span",{style:{"--shiki-dark":"#666666","--shiki-light":"#999999"}},", "),i("span",{style:{"--shiki-dark":"#5DA994","--shiki-light":"#2E8F82"}},"E1"),i("span",{style:{"--shiki-dark":"#666666","--shiki-light":"#999999"}},", "),i("span",{style:{"--shiki-dark":"#5DA994","--shiki-light":"#2E8F82"}},"R1"),i("span",{style:{"--shiki-dark":"#666666","--shiki-light":"#999999"}},">): "),i("span",{style:{"--shiki-dark":"#5DA994","--shiki-light":"#2E8F82"}},"Effect"),i("span",{style:{"--shiki-dark":"#666666","--shiki-light":"#999999"}},"<"),i("span",{style:{"--shiki-dark":"#5DA994","--shiki-light":"#2E8F82"}},"B"),i("span",{style:{"--shiki-dark":"#666666","--shiki-light":"#999999"}},", "),i("span",{style:{"--shiki-dark":"#5DA994","--shiki-light":"#2E8F82"}},"E"),i("span",{style:{"--shiki-dark":"#666666","--shiki-light":"#999999"}}," | "),i("span",{style:{"--shiki-dark":"#5DA994","--shiki-light":"#2E8F82"}},"E1"),i("span",{style:{"--shiki-dark":"#666666","--shiki-light":"#999999"}},", "),i("span",{style:{"--shiki-dark":"#5DA994","--shiki-light":"#2E8F82"}},"R"),i("span",{style:{"--shiki-dark":"#666666","--shiki-light":"#999999"}}," | "),i("span",{style:{"--shiki-dark":"#5DA994","--shiki-light":"#2E8F82"}},"R1"),i("span",{style:{"--shiki-dark":"#666666","--shiki-light":"#999999"}},">")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-dark":"#666666","--shiki-light":"#999999"}},"}")])])],-1),B=i("code",null,"A",-1),R=i("code",null,"Effect",-1),v=i("code",null,"B",-1),x=i("code",null,"self",-1),C={__name:"39",setup(b){return f(n),F(),(w,P)=>{const r=p,k=d("click");return h(),g(A,E(c(e(_)(e(n),38))),{default:t(()=>[m,y(r,o({},{ranges:[]}),{default:t(()=>[u]),_:1},16),i("ul",null,[a((h(),l("li",null,[s("Unwraps a value "),B,s(" and re-wraps it into an "),R,s(" of "),v])),[[k]]),a((h(),l("li",null,[s("Will not run if "),x,s(" is not a success")])),[[k]])])]),_:1},16)}}},H=D(C,[["__file","/@slidev/slides/39.md"]]);export{H as default};