
const app = Vue.createApp({
    data(){
        return {
            username:"",
            password:"",
            baseUrl: "https://vue3-course-api.hexschool.io/v2",
        };
    },
    methods:{
        login(){
            axios({
                method: 'post',
                url: `${this.baseUrl}/admin/signin`,
                data: {
                    "username": this.username,
                    "password": this.password,
                }
            })
            .then(res=>{
                // console.log("成功");
                // console.log(res);
                let token = res.data.token;
                let expired = res.data.expired;
                document.cookie = `hexToken=${token}; expires=${new Date(expired)};`;
                document.location.href = "./product.html"
            })
            .catch(err=>{
                // console.log("失敗");
                // console.log(err);
                alert(err.data.message);
            })
        }
    },
});

app.mount("#app");