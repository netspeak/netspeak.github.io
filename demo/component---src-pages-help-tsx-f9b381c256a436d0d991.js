(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{"32Vs":function(e,n,t){},vj21:function(e,n,t){"use strict";t.r(n),t.d(n,"default",(function(){return w}));var r=t("q1tI"),a=t.n(r),i=(t("32Vs"),t("EO4T")),s=t("Pa1A"),l=t("PKJ3");function o(){var e=Object(i.b)(),n=Object(i.a)({lang:e},h);return a.a.createElement(s.a,{lang:e,className:"HelpPage"},a.a.createElement("h1",{className:"article"},n("help")),a.a.createElement(u,{id:"contact"},n("contact")),n("contactP")(),a.a.createElement(u,{id:"how"},n("how")),n("howP")(),a.a.createElement(m,{id:"examples"},n("examples")),n("exampleData").map((function(n,t){return a.a.createElement("div",{key:t,className:"group-box"},a.a.createElement("div",{className:"group-title"},n.title),a.a.createElement("div",{className:"group-content"},a.a.createElement(c,null,n.desc()),a.a.createElement(l.a,{lang:e,corpus:"web-en",defaultQuery:n.query,defaultExampleVisibility:"hidden",pageSize:10})))})),a.a.createElement(m,{id:"for-developers"},n("devs")),n("devsP")())}function c(e){return a.a.createElement("p",{className:"article"},e.children)}function u(e){return a.a.createElement("a",{href:"#"+e.id,className:"article"},a.a.createElement("h2",{id:e.id,className:"article"},e.children))}function m(e){return a.a.createElement("h3",{id:e.id,className:"article"},e.children)}function d(e){return a.a.createElement("a",{href:"mailto:"+e.address,className:"article"},e.address)}var h={en:{help:"Help",contact:"Contact",contactP:function(){return a.a.createElement(c,null,"Email: ",a.a.createElement(d,{address:"info@netspeak.org"}))},how:"How Netspeak works",howP:function(){return a.a.createElement(c,null,"Netspeak is a search engine designed to help you to express yourself in a foreign language by providing you with insight on how common native speakers use certain phrases. The following examples illustrate how you can use Netspeak to query phrases.")},examples:"Examples",exampleData:[{title:"Find one word",desc:function(){return a.a.createElement(a.a.Fragment,null,"Use a question mark in your query to search for a missing word.")},query:"waiting ? response"},{title:"Find at least one word",desc:function(){return a.a.createElement(a.a.Fragment,null,"Use a plus in your query to search for missing words.")},query:"waiting + response"},{title:"Find two or more words",desc:function(){return a.a.createElement(a.a.Fragment,null,"Use a two or more question marks to find as many words for them.")},query:"waiting ? ? response"},{title:"Find any number of words",desc:function(){return a.a.createElement(a.a.Fragment,null,"Use dots, to find zero, one, two, or more words at the same time.")},query:"waiting * response"},{title:"Find the best option",desc:function(){return a.a.createElement(a.a.Fragment,null,"Use square brackets to check which of two or more words is most common, or if none applies.")},query:"the same [ like as ]"},{title:"Find the best order",desc:function(){return a.a.createElement(a.a.Fragment,null,"Use curly brackets to check in which order two or more words are commonly written.")},query:"{ only for members }"},{title:"Find the best synonym",desc:function(){return a.a.createElement(a.a.Fragment,null,"Use the hash sign in front of a word to check which of its synonyms are commonly written.")},query:"waiting * #response"},{title:"Compare phrases",desc:function(){return a.a.createElement(a.a.Fragment,null,"Use the pipe symbol between phrases to get a comparison.")},query:"waiting ? ? response | waiting ? response"}],devs:"For developers",devsP:function(){return a.a.createElement(c,null,a.a.createElement("a",{className:"article",href:"https://github.com/netspeak",target:"_blank",rel:"noopener noreferrer"},"GitHub"))}},de:{help:"Hilfe",contact:"Kontakt",contactP:function(){return a.a.createElement(c,null,"Email: ",a.a.createElement(d,{address:"info@netspeak.org"}))},how:"So funktioniert Netspeak",howP:function(){return a.a.createElement(c,null,"Netspeak ist eine Suchmaschine, die ihnen hilft sich in einer fremden Sprache auszudrücken, indem es dir anzeigt wie häufig Muttersprachler bestimmte Wendungen nutzen. Die folgenden Beispiele zeigen, wie sie mit Netspeak Wendungen und Wortgruppen abfragen.")},examples:"Beispiele",exampleData:[{title:"Ein Wort finden",desc:function(){return a.a.createElement(a.a.Fragment,null,"Das Fragezeichen steht für genau ein Wort. Verwenden Sie es irgendwo in ihrer Anfrage, um nach dem dort passenden Wort zu suchen.")},query:"waiting ? response"},{title:"Mindestens ein Wort finden",desc:function(){return a.a.createElement(a.a.Fragment,null,"Das Plus steht für mindestens ein Wort. Verwenden Sie es irgendwo in ihrer Anfrage, um nach dem dort passenden Wort/Wörtern zu suchen.")},query:"waiting + response"},{title:"Zwei oder mehr Wörter finden",desc:function(){return a.a.createElement(a.a.Fragment,null,"Zwei Fragezeichen hintereinander stehen für genau zwei Wörter. Verwenden Sie mehr Fragezeichen, um nach entsprechend vielen Wörtern zu suchen.")},query:"waiting ? ? response"},{title:"Beliebig viele Wörter finden",desc:function(){return a.a.createElement(a.a.Fragment,null,"Die Punkte stehen für beliebig viele Wörter. Verwenden Sie sie, um gleichzeitig nach ein, zwei oder mehr passenden Wörtern zu suchen.")},query:"waiting * response"},{title:"Die bessere Alternative finden",desc:function(){return a.a.createElement(a.a.Fragment,null,"Um zu prüfen, welches von zwei oder mehr Wörtern eher geschrieben wird, oder ob keins davon zutrifft, verwenden Sie eckige Klammern.")},query:"the same [ like as ]"},{title:"Die richtige Reihenfolge finden",desc:function(){return a.a.createElement(a.a.Fragment,null,"Um zu prüfen, in welcher Reihenfolge zwei oder mehr Wörter geschrieben werden, verwenden sie geschweifte Klammern.")},query:"{ only for members }"},{title:"Das häufigste Synonym finden",desc:function(){return a.a.createElement(a.a.Fragment,null,"Um zu prüfen, welches Synonym eines Wortes am häufigsten geschrieben wird, verwenden Sie das Doppelkreuz vor dem Wort.")},query:"waiting * #response"},{title:"Wortgruppen vergleichen",desc:function(){return a.a.createElement(a.a.Fragment,null,"Um die Häufigkeit von Wortgruppen zu vergleichen trennen sie diese durch das Pipe-Symbol.")},query:"waiting ? ? response | waiting ? response"}],devs:"Für Entwickler",devsP:function(){return a.a.createElement(c,null,a.a.createElement("a",{className:"article",href:"https://github.com/netspeak",target:"_blank",rel:"noopener noreferrer"},"GitHub"))}}},p=t("qhky"),f=t("uCLs"),g=t("fKQA");function w(){return a.a.createElement(a.a.Fragment,null,Object(g.a)((function(){return a.a.createElement(o,null)})),a.a.createElement(p.a,null,a.a.createElement("title",null,"Help - Netspeak"),a.a.createElement(f.a,null)))}}}]);
//# sourceMappingURL=component---src-pages-help-tsx-f9b381c256a436d0d991.js.map