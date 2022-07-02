

(function () {
  window.addEventListener('message', event => {
    // 基于准备好的dom，初始化echarts实例

    const message = event.data.value;

    // document.getElementById('app1').innerHTML = `111${JSON.stringify(message)}`
    Chart1();
    Chart0();
    function Chart1() {
      let dom = document.getElementById('app1');
      let category = message.curData.category;
      let data = message.curData.data;
      dom.style = {
        height: (100 + 30 * category.length) + 'px'
      }
      var myChart = echarts.init(dom);
      // 绘制图表
      let option = {
        title: {
          text: '本周时长统计(h)'
        },
        grid: {
          left: '0%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'value'
          }

        ],
        yAxis: [
          {
            type: 'category',
            data: category,
            axisTick: {
              alignWithLabel: true
            }
          }

        ],
        series: [
          {
            type: 'bar',
            barWidth: '60%',
            label: {
              show: true,
              position: 'right'

            },
            data: data
          }
        ]
      };
      myChart.setOption(option);
    }
    function Chart0() {
      let category = message.allData.category;
      let data = message.allData.data;
      let dom = document.getElementById('app')
      dom.style = {
        height: (100 + 30 * category.length) + 'px'
      }
      var myChart = echarts.init(dom);
      // 绘制图表
      let option = {
        title: {
          text: '总时长统计(h)'
        },
        grid: {
          left: '0%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'value'
          }

        ],
        yAxis: [
          {
            type: 'category',
            data: category,
            axisTick: {
              alignWithLabel: true
            }
          }

        ],
        series: [
          {
            type: 'bar',
            barWidth: '60%',
            label: {
              show: true,
              position: 'right'

            },
            data: data
          }
        ]
      };
      myChart.setOption(option);
    }

  })

})()


