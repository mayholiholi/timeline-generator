new Vue({
  el: '#app',
  vuetify: new Vuetify(),
  data() {
    return {
      userInput: '<黒船来航#1853年7月8日#ペリー提督が浦賀に来航><日米和親条約#1854年3月31日#日本がアメリカと条約を締結><井伊直弼#1858年#安政の大獄が始まる><桜田門外の変#1860年3月24日#井伊直弼が暗殺される><坂本龍馬#1862年3月24日#脱藩><生麦事件#1862年9月14日#薩摩藩士が英国人を殺傷><長州藩#1863年1月29日#攘夷派が政権を掌握する><禁門の変#1864年7月19日#長州藩と幕府軍が衝突><隠し刀#1864年#比翼><池田屋事件#1864年6月5日#新選組が尊攘派志士を襲撃><四国艦隊下関砲撃事件#1864年8月5日#英米仏蘭の四国艦隊が長州藩を攻撃><薩長同盟#1866年1月#薩摩藩と長州藩が同盟を結ぶ><大政奉還#1867年10月14日#徳川慶喜が政権を朝廷に返上><王政復古の大号令#1867年12月9日#新政府が発足><鳥羽伏見の戦い#1868年1月27日#戊辰戦争の始まり><江戸城無血開城#1868年4月11日#江戸城が新政府に引き渡される>',
      timelineItems: [],
      minYear: null,
      maxYear: null
    };
  },
  methods: {
    generateTimeline() {
      const entries = this.userInput.match(/<[^>]+>/g);
      this.timelineItems = entries.map(entry => {
        const match = entry.match(/<([^#]+)#([^#]+)#([^>]+)>/);
        if (match) {
          const year = parseInt(match[2].match(/\d{4}/)[0], 10);
          return {
            title: match[1],
            date: match[2],
            description: match[3],
            year: year
          };
        }
        return null;
      }).filter(item => item !== null);

      this.timelineItems.sort((a, b) => a.year - b.year);
      this.calculateMinMaxYear();
      this.applyGradientColors();
    },
    calculateMinMaxYear() {
      const years = this.timelineItems.map(item => item.year);
      this.minYear = Math.min(...years);
      this.maxYear = Math.max(...years);
    },
    applyGradientColors() {
      const startColor = '#002f4b'; // 深い群青色
      const endColor = '#FF69B4'; // 朝焼けのピンク
      this.timelineItems.forEach(item => {
        const ratio = (item.year - this.minYear) / (this.maxYear - this.minYear);
        item.color = this.getGradientColor(startColor, endColor, ratio);
      });
    },
    getGradientColor(startColor, endColor, ratio) {
      const hex = function(x) {
        x = x.toString(16);
        return (x.length === 1) ? '0' + x : x;
      };

      const r = Math.ceil(parseInt(startColor.substring(1, 3), 16) * (1 - ratio) + parseInt(endColor.substring(1, 3), 16) * ratio);
      const g = Math.ceil(parseInt(startColor.substring(3, 5), 16) * (1 - ratio) + parseInt(endColor.substring(3, 5), 16) * ratio);
      const b = Math.ceil(parseInt(startColor.substring(5, 7), 16) * (1 - ratio) + parseInt(endColor.substring(5, 7), 16) * ratio);

      return `#${hex(r)}${hex(g)}${hex(b)}`;
    }
  }
});
