// build time:Wed Dec 12 2018 17:18:21 GMT+0800 (中国标准时间)
var a_idx=0;jQuery(document).ready(function(a){a("body").click(function(e){var o=new Array("富强","民主","文明","和谐","自由","平等","公正","法治","爱国","敬业","诚信","友善");var t=a("<span>").text(o[a_idx]);a_idx=(a_idx+1)%o.length;var n=e.pageX,i=e.pageY;t.css({"z-index":1e69,top:i-20,left:n,position:"absolute","font-weight":"bold",color:"#ff6651"});a("body").append(t);t.animate({top:i-180,opacity:0},1500,function(){t.remove()})})});
//rebuild by neat </span>