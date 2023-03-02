let myProductModal = "";
let myDeleteModal = "";

const app = Vue.createApp({
  data() {
    return {
      products: [],
      baseUrl: "https://vue3-course-api.hexschool.io/v2",
      apiPath: "giganoto",
      tempProduct: {
        imagesUrl:[],
      },
      modalStatus: "create",
    }
  },
  methods: {
    checkLoginStatus() {
      axios({
        method: 'post',
        url: `${this.baseUrl}/api/user/check`,
      })
        .then(res => {
          console.log(res);
          alert(`登入狀態=> ${res.data.success}`)
        })
        .catch(err => {
          // console.log(err);
          alert(err.data.message);
          document.location.href = "./index.html";
        })
    },
    logout() {
      axios({
        method: 'post',
        url: `${this.baseUrl}/logout`,
      })
        .then(res => {
          // console.log(res);
          document.cookie = `hexToken=""; expires=${new Date(1980, 1, 1)};`;
          alert(res.data.message);
          document.location.href = "./index.html";
        })
        .catch(err => {
          // console.log(err);
          alert(err.data.message);
        })
    },
    getProductsAll() {
      axios({
        method: 'get',
        url: `${this.baseUrl}/api/${this.apiPath}/admin/products/all`,
      })
        .then(res => {
          // console.log(res.data.products);
          this.products = res.data.products;
        })
        .catch(err => {
          console.log(err);
        })
    },
    openModal(type,product={}){

      const newImageInput = document.querySelector("#newImageInput");
      newImageInput.value="";

      if(type==="create"){
        this.modalStatus = type;
        this.tempProduct = {
          imagesUrl:[],
        };
        myProductModal.show();
      }else if(type==="edit"){
        this.modalStatus = type;
        this.tempProduct = JSON.parse(JSON.stringify(product));
        myProductModal.show();
      }else if(type="delete"){
        this.tempProduct = JSON.parse(JSON.stringify(product));
        myDeleteModal.show();
      }
    },
    updateProduct(){

      //編輯產品
      if(this.modalStatus==="edit"){

        axios.put(`${this.baseUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`,{
          data:{
            ...this.tempProduct,
          }
        }).then(res=>{
          // console.log(res);
          alert(res.data.message);
          this.getProductsAll();
          this.tempProduct = { imagesUrl:[] };
          myProductModal.hide();
        }).catch(err=>{
          console.log(err);
        })

      //新增產品
      }else if(this.modalStatus ==="create"){

        axios.post(`${this.baseUrl}/api/${this.apiPath}/admin/product`,{
          data:{
            ...this.tempProduct,
          }
        }).then(res=>{
          console.log(res);
          this.getProductsAll();
          this.tempProduct = { imagesUrl:[] };
          myProductModal.hide();

        }).catch(err=>{
          console.log(err);
        })
      }

    },
    deleteProduct(){
      // console.log(this.tempProduct.id);
      axios.delete(`${this.baseUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`)
        .then(res=>{
          // console.log(res);
          alert(res.data.message);
          this.getProductsAll();
          this.tempProduct = { imagesUrl:[] };
          myDeleteModal.hide();
        })
        .catch(err=>{
          console.log(err);
        })
    },
    addImage(){
      const newImageInput = document.querySelector("#newImageInput");
      if(newImageInput.value.trim()===""){
        alert("圖片網址不得為空");
        return ;
      }
      if(!(this.tempProduct?.imageUrl)){
        this.tempProduct.imageUrl = newImageInput.value;
      }else{
        //防止，產品創建時無多圖，沒有imagesUrl屬性。        
        if(!(this.tempProduct?.imagesUrl)){
          this.tempProduct.imagesUrl = [];
        }
        this.tempProduct.imagesUrl.push(newImageInput.value);
      }

      newImageInput.value = "";
    },
    deletePrimaryImg(){
      this.tempProduct.imageUrl = "";
    },
    deleteTempImgs(index){
      this.tempProduct.imagesUrl.splice(index,1);
    },
  },
  mounted() {

    //cookie相關設定
    const hexToken = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    // console.log(hexToken);
    axios.defaults.headers.common['Authorization'] = hexToken;

    myProductModal = new bootstrap.Modal(document.getElementById('productModal'), {
      keyboard: false,
      backdrop: "static",
    });

    myDeleteModal = new bootstrap.Modal(document.getElementById('delProductModal'), {
      keyboard: false,
      backdrop: "static",
    });

    this.getProductsAll();
  }
});

app.mount("#app");
