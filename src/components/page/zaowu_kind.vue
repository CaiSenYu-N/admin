<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i>造物-分类页面</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>
                <el-button type="primary" icon="search" @click="addKind(false)">添加</el-button>
            </div>

            <el-table :data="kindList" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="goodsKind.addTime" label="添加日期" sortable width="150" align="center">
                </el-table-column>
                <el-table-column prop="goodsKind.title" label="ename" width="120" align="center">
                </el-table-column>
                <el-table-column prop="goodsKind.ctitle" label="cname" width="120" align="center">
                </el-table-column>
                <el-table-column  label="图片" width="160" align="center">
                    <template  slot-scope="scope">
                        <img :src="'http://www.bufantec.com/'+scope.row.goodsKind.img" alt="" width="100%">
                    </template>
                </el-table-column>

                <!-- 添加子集 -->
                <el-table-column prop="#" label="子集分类" align="center">
                    <template slot-scope="scope">
                        <el-tag
                        closable
                        v-for="tag in scope.row.list"
                        :key="tag.id"
                        @click.native="addKind(tag,scope.row.goodsKind.id)"
                        @close="handleDelete(tag.id,1)"
                        :type="tag.type">
                        {{tag.ctitle}}
                        </el-tag>
                        <el-button  class="button-new-tag" size="small" @click="addKind(false,scope.row.goodsKind.id)">+添加一个子分类</el-button>
                    </template>
                </el-table-column>

                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="addKind(scope.row.goodsKind)">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.row.goodsKind.id,0)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next" :total="1000">
                </el-pagination>
            </div> -->
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog :title="tName" :visible.sync="editVisible" width="30%">
                <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="英文名字">
                    <el-input v-model="form.title"></el-input>
                </el-form-item>
                <el-form-item label="中文名字">
                    <el-input v-model="form.ctitle"></el-input>
                </el-form-item>

                <!-- 照片添加
                 -->
                <el-upload 
                class="upload-demo" 
                v-show="isShow"
                :on-success="returnImg"
                :on-remove="removeImg"
                :show-file-list="false"
                :on-error = "wrong"
                drag 
                action="http://www.bufantec.com/api/admin/upload" 
                multiple 
                align="center">
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
                    <img width="100%" :src="'http://www.bufantec.com/'+form.img" v-if=form.img>
                </el-upload>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="save">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>

import bfApi from '@/api/bufan_zaowu_kind'

    export default {
        name: 'zaowu',
        data() {
            return {
               url: './vuetable.json',
                tableData: [],
                cur_page: 1,
                multipleSelection: [],
                select_cate: '',
                select_word: '',
                del_list: [],
                is_search: false,    
                idx: -1,
                kindList:[],
                // childList:[],
                form: {
                    title: '',
                    ctitle: '',
                    pid: '',
                    img:''
                },
                del_id:'',
                del_type:1,
                editVisible: false,//弹窗框
                delVisible: false,//删除的弹出
                tName: '',
                isShow: true
            }
        },
        created() {
            this.getKindList();
        },
        computed: {
            data() {
                return this.tableData.filter((d) => {
                    let is_del = false;
                    for (let i = 0; i < this.del_list.length; i++) {
                        if (d.name === this.del_list[i].name) {
                            is_del = true;
                            break;
                        }
                    }
                    if (!is_del) {
                        if (d.address.indexOf(this.select_cate) > -1 &&
                            (d.name.indexOf(this.select_word) > -1 ||
                                d.address.indexOf(this.select_word) > -1)
                        ) {
                            return d;
                        }
                    }
                })
            }
        },
        methods: {
            // 把获取到结果的照片给弹窗的照片
            returnImg(res, file, fileList){
                // console.log(res)
                console.log(file,fileList)
                this.form.img = res.data
            },
            removeImg(file, fileList){
                // console.log(this.form.img)
                this.form.img = ''
                // console.log(this.form.img)
            },
            wrong(err, file, fileList){
                alert('上传失败,请重新上传...')
            },
            getKindList(){ 
                bfApi.getKindList().then(res=>{
                    this.kindList = res.data.data
                })
            },
            addKind(data,pid){
                console.log(pid)
                if(pid){
                    this.isShow = false
                }else{
                    this.isShow = true
                }
                if(data){
                    this.tName = '编辑'
                    
                    // console.log(this.isShow)
                    this.form = Object.assign({},data)
                }else{
                    if(pid){
                        this.tName = '添加子集'
                    }else{
                        this.tName = '添加'
                    }
                    Object.assign(this.$data.form,this.$options.data().form)
                }
                this.form.pid = pid
                this.editVisible = true
            },
            save(){
               if(this.form.id){//存在ID 及判断你为编辑
                    bfApi.editKind({goodsKind:this.form})
                    .then(res=>{
                        if(res.data.code==='S'){
                            this.$message.success('保存成功');
                        }
                    })
                }else{
                    console.log('添加')
                    bfApi.addKind({goodsKind:this.form}).then(res=>{
                        if(res.data.code == 'S'){
                            this.$message.success('添加成功');
                        }
                    })
                }
                this.editVisible = false
                this.getKindList()
            },
            handleDelete(id,type){//handleDelete
                console.log('删除？？？')
                this.del_id = id
                this.del_type = type
                this.delVisible = true
            },
            deleteRow(){
                console.log('已确定删除！！！')
                this.delVisible = false
                bfApi.delKind({id:this.del_id,type:this.del_type}).then(res=>{
                    if(res.data.code == 'S'){
                        this.$message.success('删除成功');
                        this.getKindList()
                    }
                })
            },
           

            
            
            












            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            },
            // 获取 easy-mock 的模拟数据
            getData() {
                // 开发环境使用 easy-mock 数据，正式环境使用 json 文件
                if (process.env.NODE_ENV === 'development') {
                    this.url = '/ms/table/list';
                };
                this.$axios.post(this.url, {
                    page: this.cur_page
                }).then((res) => {
                    this.tableData = res.data.list;
                })
            },
            search() {
                this.is_search = true;
            },
            formatter(row, column) {
                return row.address;
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            handleEdit(index, row) {
                this.idx = index;
                const item = this.tableData[index];
                this.form = {
                    name: item.name,
                    date: item.date,
                    address: item.address
                }
                this.editVisible = true;
            },
            delAll() {
                const length = this.multipleSelection.length;
                let str = '';
                this.del_list = this.del_list.concat(this.multipleSelection);
                for (let i = 0; i < length; i++) {
                    str += this.multipleSelection[i].name + ' ';
                }
                this.$message.error('删除了' + str);
                this.multipleSelection = [];
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 保存编辑
        }
    }

</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
    }
    .table{
        width: 100%;
        font-size: 14px;
    }
    .red{
        color: #ff0000;
    }
    .mr10{
        margin-right: 10px;
    }
</style>
