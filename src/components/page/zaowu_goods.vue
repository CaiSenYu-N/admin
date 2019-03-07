<template>
 <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i>造物-分类二级页面</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container" @abc="count=1">
            <div class="handle-box">
                <el-button type="primary" icon="search" @click="addGoods">添加商品信息</el-button>
            </div>
            <el-table
                :data="goodsList.list"
                style="width: 100%">
                <el-table-column type="expand">
                <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                    <el-form-item label="商品颜色">
                        <span :style="{background:props.row.goods.color1}" class="span-color" :title="props.row.goods.color1"></span>
                        <span :style="{background:props.row.goods.color2}" class="span-color" :title="props.row.goods.color2"></span>
                        <span :style="{background:props.row.goods.color3}" class="span-color" :title="props.row.goods.color3"></span>
                    </el-form-item>
                    <el-form-item label="商品尺寸">
                        <span>{{ props.row.shop }}</span>
                    </el-form-item>
                    <el-form-item label="进价">
                        <span>{{ props.row.goods.priceIn }}</span>
                    </el-form-item>
                    <el-form-item label="售价">
                        <span>{{ props.row.goods.priceOut }}</span>
                    </el-form-item>
                    <el-form-item label="是否热卖">
                        <span>{{ props.row.goods.hot>0?'热卖':'' }}</span>
                    </el-form-item>
                    <el-form-item label="数量">
                        <span>{{ props.row.goods.count }}</span>
                    </el-form-item>
                    <el-button type="primary" icon="search" @click="addTwo(props.row.goods)">添加二级信息</el-button>
                    </el-form>
                </template>
                </el-table-column>
                <el-table-column
                label="添加时间"
                prop="goods.addTime">
                </el-table-column>
                <el-table-column
                label="品牌"
                prop="goods.brandId">
                </el-table-column>
                <el-table-column
                label="商品"
                prop="goods.name">
                </el-table-column>
                <el-table-column
                label="Banner"
                prop="goods.img1">
                    <template  slot-scope="scope">
                        <img :src="'http://www.bufantec.com/'+scope.row.goods.img1" alt="" height="50px" width="30%">
                        <img :src="'http://www.bufantec.com/'+scope.row.goods.img2" alt="" height="50px" width="30%">
                        <img :src="'http://www.bufantec.com/'+scope.row.goods.img3" alt="" height="50px" width="30%">
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="addGoods()">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.row.goodsKind.id,0)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- 添加/编辑弹窗 -->
        <el-dialog :title="tName" :visible.sync="openAddShow" width="50%">
            <el-form ref="form2" :model="form" label-width="50px">
                <el-cascader
                    expand-trigger="hover"
                    :options="options"
                    v-model="selectedOptions2"
                    @change="handleChange">
                </el-cascader>
                <el-form-item label="品牌">
                    <el-input v-model="form.brandId"></el-input>
                </el-form-item>
                <el-form-item label="名称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input v-model="form.desc"></el-input>
                </el-form-item>
                <el-form-item label="进价">
                    <el-input v-model="form.priceIn"></el-input>
                </el-form-item>
                <el-form-item label="卖出价格">
                    <el-input v-model="form.priceOut"></el-input>
                </el-form-item>
                <el-form-item label="当前价格">
                    <el-input v-model="form.priceNow"></el-input>
                </el-form-item>
                <el-form-item label="hot">
                    <el-radio-group v-model="form.hot">
                    <el-radio :label="1">热卖</el-radio>
                    <el-radio :label="0">非热卖</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="添加图片1" >
                    <el-upload :action=uploadAdress 
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess1">
                    <img v-if="img1" :src="editAdress + img1" class="banner1">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="添加图片2" >
                    <el-upload class="avatar-uploader" :action=uploadAdress 
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess2">
                    <img v-if="img2" :src="editAdress + img2" class="banner1">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="添加图片3" >
                    <el-upload class="avatar-uploader" :action=uploadAdress 
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess3">
                    <img v-if="img3" :src="editAdress + img3" class="banner1">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="颜色1" prop="color1" >
                    <el-input v-model="form.color1"></el-input>
                </el-form-item>
                <el-form-item label="颜色2" prop="color2" >
                    <el-input v-model="form.color2"></el-input>
                </el-form-item>
                <el-form-item label="颜色3" prop="color3" >
                    <el-input v-model="form.color3"></el-input>
                </el-form-item>
                <el-form-item label="型号s" prop="size_s" >
                    <template>
                    <el-radio-group v-model="form.size_s">
                        <el-radio :label="1">有</el-radio>
                        <el-radio :label="0">无</el-radio>
                    </el-radio-group>
                    </template>
                </el-form-item>
                <el-form-item label="型号m" prop="size_s" >
                    <template>
                    <el-radio-group v-model="form.size_m">
                        <el-radio :label="1">有</el-radio>
                        <el-radio :label="0">无</el-radio>
                    </el-radio-group>
                    </template>
                </el-form-item>
                <el-form-item label="型号l" prop="size_s" >
                    <template>
                    <el-radio-group v-model="form.size_l">
                        <el-radio :label="1">有</el-radio>
                        <el-radio :label="0">无</el-radio>
                    </el-radio-group>
                    </template>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeAdd">取 消</el-button>
                <el-button type="primary" @click="saveAdd">确 定</el-button>
            </div>        
        </el-dialog>

        <!-- 二级信息弹窗 -->
       <!-- <el-dialog title="添加二级信息" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="50px">
                <el-form-item label="color">
                    <el-radio v-model="form.color" :label="item.color1">颜色1</el-radio>
                    <el-radio v-model="form.color" :label="item.color2">颜色2</el-radio>
                    <el-radio v-model="form.color" :label="item.color3">颜色3</el-radio>
                </el-form-item>
                <el-form-item label="size">
                    <el-radio v-model="form.size" :label="item.size_l" v-if=item.size_l>型号L</el-radio>
                    <el-radio v-model="form.size" :label="item.size_s" v-if=item.size_s>型号S</el-radio>
                    <el-radio v-model="form.size" :label="item.size_m" v-if=item.size_m>型号M</el-radio>
                </el-form-item>
                <el-form-item label="count">
                    <el-input v-model="form.count"></el-input>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveTwo">确 定</el-button>
            </span>
        </el-dialog> -->
    </div>
</template>

<script>

    import bufanApi from '@/api/bufan_zaowu_goods'
    import bfApi from '@/api/bufan_zaowu_kind'

    export default {
        name:'goods',
        data() {
            return {
                editAdress:'http://www.bufantec.com/',
                uploadAdress:'http://www.bufantec.com/api/admin/upload',
                goodsList: {},
                tName: '',
                editVisible:false,
                form:{
                    id:'',
                    color: '',
                    size: '',
                },
                count:0,
                item: {
                    color1:'',
                    color2:'',
                    color3:'',
                    size_l:'',
                    size_s:'',
                    size_m:''
                },
                options: [],
                openAddShow: false,
                selectedOptions2: [],
                img1:'',
                img2:'',
                img3:''

            }
        },
        // 初始获取数据渲染页面
        created(){
            this.getGoodsList();
        },
        methods: {
            // 添加二级商品信息
            addTwo(item){
                this.form.id = item.id
                this.item = item
                console.log(item)
                this.item.size_l=1?this.item.size_l = 'l':this.item.size_l=''
                this.item.size_s=1?this.item.size_s = 's':this.item.size_s=''
                this.item.size_m=1?this.item.size_m = 'm':this.item.size_m=''
                this.editVisible = true
            },
            // 保存商品二级信息
            saveTwo(){
                bufanApi.addTwo({goodsStock:this.form}).then(res=>{
                    if(res.data.code == 'S'){
                        this.$message.success('添加成功');
                    }
                })
                this.editVisible = false
                this.openAddShow = false
                this.getGoodsList();
            },
            saveAdd(){
                bufanApi.goodsSave({goods:this.form}).then(res=>{
                    if(res.data.code == 'S'){
                        this.$message.success('添加成功');
                    }
                })
                this.openAddShow = false
                this.getGoodsList();
            },
            // 商品添加
            addGoods(data){
                if(data){
                    this.tName = '添加'
                }else{
                    this.tName = '编辑'
                }
                bfApi.getKindList().then(res=>{
                    console.log(res)
                    let data = res.data.data
                    let data2 = []
                   for(let i = 0;i<data.length;i++){
                        data2.push(data[i].goodsKind);
                        data2[i].children = data[i].list;
                        data2[i].value = data2[i].id;
                        data2[i].label = data2[i].ctitle;//这个时候一级分类的东西label和value已经完备了
                        var editList = data2[i].children;//需要循环children的label和value
                        for(let j=0;j < editList.length;j++){
                            editList[j].value = editList[j].id ;
                            editList[j].label = editList[j].ctitle;
                        }
                    }
                    this.options = data2
                })
                this.openAddShow = true
            },
            closeAdd(){
                this.openAddShow = false
            },
            getGoodsList(){
                bufanApi.getGoodsList().then(res=>{
                    this.goodsList = res.data.data
                    
                })
            },
            handleChange(){

            },
             // 弹窗添加或编辑修改图片的操作
            handleAvatarSuccess1(res, file) {
                console.log(res, file)
                // 把图片的路径赋给form里面的img
                this.img1 = file.response.data;
                this.form.img1 = this.img1;
                if(file.response.code==='S'){
                this.$message({
                        type: 'success',
                        message: '图片添加成功!'
                    })
                }
                console.log(this.form.img1)
            },
            handleAvatarSuccess2(res, file) {
                console.log(file)
                this.img2 = file.response.data;
                this.form.img2 = this.img2;
                if(file.response.code==='S'){
                this.$message({
                        type: 'success',
                        message: '图片添加成功!'
                    })
                }
                console.log(this.form.img2)
            },
            handleAvatarSuccess3(res, file) {
                console.log(file)
                this.img3 = file.response.data;
                this.form.img3 = this.img3;
                if(file.response.code==='S'){
                this.$message({
                        type: 'success',
                        message: '图片添加成功!'
                    })
                }
            },

        }
    } 
</script>

<style>
  .demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }

  .span-color {
      display: inline-block;
      width: 40px;
      height: 25px;
      margin-left: 10px;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
</style>
