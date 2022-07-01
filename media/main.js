

(function () {

  window.onerror = function (e) {
    console.log(e)
    ElementPlus.ElMessage({
      type: 'error',
      message: event.message
    })
  }
  window.addEventListener('error', event => {
    // 处理错误信息
    ElementPlus.ElMessage({
      type: 'error',
      message: event.message
    })
    console.log(event)
  }, false);
  const vscode = acquireVsCodeApi();
  // window.addEventListener('message', (event) => {
  //   const message = event.data;
  //   document.querySelector('#app').innerHTML = message.text
  //   vscode.postMessage({ type: 'finishTask', value: message.text });
  // })
  const main = {
    data() {
      return {
        taskFlag: false,
        taskData: {},
        typeOption: [],
        rules: {
          name: [
            { required: true, message: '名称不能为空', trigger: 'blur' },
            { min: 0, max: 20, message: '不能超过二十个字', trigger: 'blur' }
          ],
          type: [
            {
              required: true,
              message: '请选择类型',
              trigger: 'change',
            },
          ],
          desc: [
            {
              required: true,
              message: '请输入描述，可以输入:[无]',
              trigger: 'change',
            },
          ],
        }
      }
    },
    mounted() {
      window.addEventListener('message', event => {
        const message = event.data;
        switch (message.type) {
          case 'getTypeOption':
            this.typeOption = message.value;
            break;
          case 'info':
            this.taskData = message.value.taskData || {};
            this.taskFlag = message.value.taskFlag || false
            break;

          default:
            break;
        }
      })
    },
    methods: {
      async gameStart() {
        let formEl = this.$refs['ruleFormRef'];
        if (!formEl) return
        await formEl.validate((valid, fields) => {
          if (valid) {
            this.taskFlag = true;
            this.taskData.starTime = new Date().getTime()
            // vscode.postMessage({ type: 'taskFlag', value: JSON.stringify(this.taskData) });
            // console.log('submit!')
            vscode.postMessage({
              type: 'addTask', value: JSON.stringify({
                taskFlag: this.taskFlag,
                taskData: this.taskData
              })
            });
          } else {
            console.log('error submit!', fields)
          }
        })
      },
      async gameOver() {
        this.taskFlag = false;
        this.taskData.endTime = new Date().getTime();
        vscode.postMessage({ type: 'finishTask', value: JSON.stringify(this.taskData) });

      },
      async resetForm() {
        let formEl = this.$refs['ruleFormRef'];
        if (!formEl) return;
        formEl.resetFields()
      }
    }
  }

  Vue.createApp(main).use(ElementPlus).mount('#app')
})();

