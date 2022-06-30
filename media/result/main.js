

(function () {
  window.addEventListener('message', event => {
    // 基于准备好的dom，初始化echarts实例

    const message = event.data;
    let category = message.value.category;
    let data = message.value.data;

    var myChart = echarts.init(document.getElementById('app'));
    // 绘制图表

    let option = {
      title: {
        text: '时长统计'
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
  })
})()


