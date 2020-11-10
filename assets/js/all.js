const Toast = Swal.mixin({
  toast: true,
  showConfirmButton: false,
  timer: 2000,
  padding: '1em 2em',
  position: 'top',
});

const app = new Vue({
  el: '#app',
  data: {
    title: {},
    description: '',
    degree: {},
    traits: [],
    problemList: {},
    questions: [],
    questionList: [],
    questionIndex: 0,
    result: false,
    resultList: [],
    resultIndex: 0,
    isCheck: false,
    isDisabled: true,
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      const api = 'https://raw.githubusercontent.com/hexschool/js-training-task/master/api/BigFive.json';
      axios.get(api)
        .then((res) => {
          const { name, description ,degree ,traits ,problemList} = res.data;
          this.title = name; // 標題
          this.description = description; //敘述
          this.degree = degree; // 程度
          this.traits = traits; // 特質
          this.problemList = problemList; // 問題
          for (index in this.problemList) {
            this.questionList.push({
              category: index,
              categoryZH: this.problemList[index].name,
              description: this.problemList[index].description,
              point: [0, 0],
            });
            this.problemList[index].problems.forEach((item) => {
              this.questions.push(item);
            });
          }
          this.questions.forEach((item) => {
            item.options.reverse();
          });
          // 隨機排序
          this.questions = this.random(this.questions);
        }).catch((err) => {
          console.log(err);
        });
    },
    // 下一題
    nextPage(id) {
      this.isDisabled = true;
      const check = document.querySelector(`[name="${id}"]:checked`);
      if (check) {
        this.isCheck = true;
        this.questionIndex += 1;
      } else {
        this.isCheck = false;
        Toast.fire({
          title: '尚未選擇',
          icon: 'warning',
        });
      }
    },
    // 最後結果
    showResult(id) {
      this.isDisabled = true;
      const check = document.querySelector(`[name="${id}"]:checked`);
      if (check) {
        this.isCheck = true;
        this.result = true;
        for (index in this.questionList) {
          const data = this.questionList[index];
          const numTotal = data.point.reduce((pre, cur) => pre + cur, 0);
          if (numTotal <= 5) {
            this.resultList.push({
              total: numTotal,
              degree: '低',
              category: data.categoryZH,
              description: data.description,
            });
          } else if (numTotal == 6) {
            this.resultList.push({
              total: numTotal,
              degree: '中',
              category: data.categoryZH,
              description: data.description,
            });
          } else {
            this.resultList.push({
              total: numTotal,
              degree: '高',
              category: data.categoryZH,
              description: data.description,
            });
          }
        }
      } else {
        this.isCheck = false;
        Toast.fire({
          title: '尚未選擇',
          icon: 'warning',
        });
      }
    },
    // 重新開始
    resetData() {
      this.result = false;
      this.questionIndex = 0;
      this.resultIndex = 0;
      this.resultList = [];
      for (index in this.questionList) {
        this.questionList[index].point = [0, 0];
      }
    },
    random(data) {
      for (let i = data.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [data[i], data[j]] = [data[j], data[i]];
      }
      return data;
    },
    isDisabledFn() {
      this.isDisabled = false;
    },
  },
});
